require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const { ethers } = require('ethers');
const jwt = require('jsonwebtoken');

const app = express();
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/crumpy-game';
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-jwt-key-change-this';

app.use(cors());
app.use(express.json());

// MongoDB connection
mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('✓ MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

// User schema
const userSchema = new mongoose.Schema({
  walletAddress: { type: String, unique: true, required: true, lowercase: true },
  points: { type: Number, default: 0 },
  highScore: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now },
  lastPlayed: { type: Date, default: Date.now }
});

const User = mongoose.model('User', userSchema);

// Middleware to verify JWT token
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

  if (!token) {
    return res.status(401).json({ error: 'Access token required' });
  }

  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(403).json({ error: 'Invalid or expired token' });
    }
    req.walletAddress = decoded.walletAddress;
    next();
  });
};

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Wallet authentication
app.post('/api/auth', async (req, res) => {
  try {
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
    const token = jwt.sign({ walletAddress: user.walletAddress }, JWT_SECRET, { expiresIn: '7d' });

    res.json({
      token,
      user: {
        walletAddress: user.walletAddress,
        points: user.points,
        highScore: user.highScore
      }
    });
  } catch (err) {
    console.error('Auth error:', err);
    res.status(500).json({ error: 'Authentication failed' });
  }
});

// Get user points
app.get('/api/points', authenticateToken, async (req, res) => {
  try {
    const user = await User.findOne({ walletAddress: req.walletAddress });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({
      points: user.points,
      highScore: user.highScore
    });
  } catch (err) {
    console.error('Get points error:', err);
    res.status(500).json({ error: 'Failed to fetch points' });
  }
});

// Update points after game
app.post('/api/points', authenticateToken, async (req, res) => {
  try {
    const { points, score } = req.body;

    if (typeof points !== 'number' || points < 0) {
      return res.status(400).json({ error: 'Points must be a non-negative number' });
    }

    const user = await User.findOne({ walletAddress: req.walletAddress });

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
      highScore: user.highScore
    });
  } catch (err) {
    console.error('Update points error:', err);
    res.status(500).json({ error: 'Failed to update points' });
  }
});

// Get leaderboard
app.get('/api/leaderboard', async (req, res) => {
  try {
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
});

app.listen(PORT, () => {
  console.log(`✓ Server running on port ${PORT}`);
});

