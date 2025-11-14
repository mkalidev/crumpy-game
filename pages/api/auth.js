import { ethers } from 'ethers';
import connectDB from '../../lib/mongodb';
import User from '../../lib/models/User';
import { signToken } from '../../lib/auth';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    await connectDB();

    const { walletAddress, signature, message } = req.body;

    if (!walletAddress || !signature || !message) {
      return res.status(400).json({ error: 'Wallet address, signature, and message are required' });
    }

    // Verify signature
    const recoveredAddress = ethers.verifyMessage(message, signature);

    if (recoveredAddress.toLowerCase() !== walletAddress.toLowerCase()) {
      return res.status(401).json({ error: 'Invalid signature' });
    }

    // Find or create user
    let user = await User.findOne({ walletAddress: walletAddress.toLowerCase() });

    if (!user) {
      user = new User({ walletAddress: walletAddress.toLowerCase() });
      await user.save();
      console.log(`New user created: ${walletAddress}`);
    }

    // Generate JWT token
    const token = signToken({ walletAddress: user.walletAddress });

    res.json({
      token,
      user: {
        walletAddress: user.walletAddress,
        points: user.points,
        highScore: user.highScore,
      },
    });
  } catch (err) {
    console.error('Auth error:', err);
    res.status(500).json({ error: 'Authentication failed' });
  }
}
