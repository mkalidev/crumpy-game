import { ethers } from 'ethers';
import connectDB from '../../lib/mongodb';
import User from '../../lib/models/User';
import { signToken } from '../../lib/auth';

export default async function handler(req, res) {
  // Set CORS headers for Vercel
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  // Handle OPTIONS request
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Connect to MongoDB
    await connectDB();

    const { walletAddress, signature, message } = req.body;

    if (!walletAddress || !signature || !message) {
      return res.status(400).json({ error: 'Wallet address, signature, and message are required' });
    }

    // Verify signature
    let recoveredAddress;
    try {
      recoveredAddress = ethers.verifyMessage(message, signature);
    } catch (verifyError) {
      console.error('Signature verification error:', verifyError);
      return res.status(401).json({ error: 'Invalid signature format' });
    }

    if (recoveredAddress.toLowerCase() !== walletAddress.toLowerCase()) {
      return res.status(401).json({ error: 'Invalid signature' });
    }

    // Find or create user
    let user;
    try {
      user = await User.findOne({ walletAddress: walletAddress.toLowerCase() });

      if (!user) {
        user = new User({ walletAddress: walletAddress.toLowerCase() });
        await user.save();
        console.log(`New user created: ${walletAddress}`);
      }
    } catch (dbError) {
      console.error('Database error:', dbError);
      return res.status(500).json({ error: 'Database operation failed' });
    }

    // Generate JWT token
    const token = signToken({ walletAddress: user.walletAddress });

    return res.status(200).json({
      token,
      user: {
        walletAddress: user.walletAddress,
        points: user.points || 0,
        highScore: user.highScore || 0,
      },
    });
  } catch (err) {
    console.error('Auth error:', err);

    // Provide more detailed error information in development
    const errorMessage =
      process.env.NODE_ENV === 'development' ? err.message : 'Authentication failed';

    return res.status(500).json({
      error: errorMessage,
      ...(process.env.NODE_ENV === 'development' && { details: err.stack }),
    });
  }
}
