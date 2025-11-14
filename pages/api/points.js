import connectDB from '../../lib/mongodb';
import User from '../../lib/models/User';
import { authenticateToken } from '../../lib/auth';

export default async function handler(req, res) {
  await connectDB();

  const decoded = authenticateToken(req);

  if (!decoded || !decoded.walletAddress) {
    return res.status(401).json({ error: 'Access token required' });
  }

  const walletAddress = decoded.walletAddress;

  if (req.method === 'GET') {
    try {
      const user = await User.findOne({ walletAddress });

      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }

      res.json({
        points: user.points,
        highScore: user.highScore,
      });
    } catch (err) {
      console.error('Get points error:', err);
      res.status(500).json({ error: 'Failed to fetch points' });
    }
  } else if (req.method === 'POST') {
    try {
      const { points, score } = req.body;

      if (typeof points !== 'number' || points < 0) {
        return res.status(400).json({ error: 'Points must be a non-negative number' });
      }

      const user = await User.findOne({ walletAddress });

      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }

      user.points += points;
      if (score && score > user.highScore) {
        user.highScore = score;
      }
      user.lastPlayed = new Date();
      await user.save();

      res.json({
        points: user.points,
        highScore: user.highScore,
      });
    } catch (err) {
      console.error('Update points error:', err);
      res.status(500).json({ error: 'Failed to update points' });
    }
  } else {
    res.setHeader('Allow', ['GET', 'POST']);
    res.status(405).json({ error: 'Method not allowed' });
  }
}
