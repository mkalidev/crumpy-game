import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  walletAddress: { type: String, unique: true, required: true, lowercase: true },
  points: { type: Number, default: 0 },
  highScore: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now },
  lastPlayed: { type: Date, default: Date.now }
});

export default mongoose.models.User || mongoose.model('User', userSchema);

