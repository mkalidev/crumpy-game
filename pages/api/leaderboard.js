import connectDB from '../../lib/mongodb';
import User from '../../lib/models/User';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    await connectDB();

    const limit = parseInt(req.query.limit) || 10;
    const users = await User.find()
      .sort({ highScore: -1 })
      .limit(limit)
      .select('walletAddress highScore points')
      .lean();

    res.json(users);
  } catch (err) {
    console.error('Leaderboard error:', err);
    res.status(500).json({ error: 'Failed to fetch leaderboard' });
  }
}

