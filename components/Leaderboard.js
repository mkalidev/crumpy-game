import { useState, useEffect } from 'react';
import axios from 'axios';

export default function Leaderboard() {
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLeaderboard();
    // Refresh leaderboard every 30 seconds
    const interval = setInterval(fetchLeaderboard, 30000);
    return () => clearInterval(interval);
  }, []);

  const fetchLeaderboard = async () => {
    try {
      const response = await axios.get('/api/leaderboard?limit=10');
      setLeaderboard(response.data);
    } catch (err) {
      console.error('Failed to fetch leaderboard:', err);
    } finally {
      setLoading(false);
    }
  };

  const formatAddress = (address) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  return (
    <div className="bg-gray-900 border border-gray-700 rounded-3xl p-5 sm:p-6 shadow-2xl h-fit">
      <h2 className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-500 mb-5 text-xl sm:text-2xl font-bold text-center">🏆 Leaderboard</h2>
      {loading ? (
        <div className="text-center text-gray-400 py-5">Loading...</div>
      ) : leaderboard.length === 0 ? (
        <div className="text-center text-gray-400 py-5">No scores yet. Be the first!</div>
      ) : (
        <div className="flex flex-col gap-2">
          {leaderboard.map((user, index) => (
            <div 
              key={user._id || index} 
              className="grid grid-cols-[35px_1fr_auto] sm:grid-cols-[40px_1fr_auto] items-center gap-3 sm:gap-4 p-2.5 sm:p-3 bg-gray-800 border border-gray-700 rounded-lg transition-all hover:translate-x-1 hover:border-gray-600 hover:bg-gray-700"
            >
              <div className="font-bold text-gray-300 text-base sm:text-lg text-center">
                {index === 0 && '🥇'}
                {index === 1 && '🥈'}
                {index === 2 && '🥉'}
                {index > 2 && `#${index + 1}`}
              </div>
              <div className="font-mono text-gray-300 text-xs sm:text-sm overflow-hidden text-ellipsis">
                {formatAddress(user.walletAddress)}
              </div>
              <div className="font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-400 text-sm sm:text-base">
                {user.highScore.toLocaleString()}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

