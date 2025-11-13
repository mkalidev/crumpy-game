import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Leaderboard.css';

const Leaderboard = ({ apiUrl }) => {
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLeaderboard();
    // Refresh leaderboard every 30 seconds
    const interval = setInterval(fetchLeaderboard, 30000);
    return () => clearInterval(interval);
  }, [apiUrl]);

  const fetchLeaderboard = async () => {
    try {
      const response = await axios.get(`${apiUrl}/api/leaderboard?limit=10`);
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
    <div className="leaderboard">
      <h2 className="leaderboard-title">🏆 Leaderboard</h2>
      {loading ? (
        <div className="leaderboard-loading">Loading...</div>
      ) : leaderboard.length === 0 ? (
        <div className="leaderboard-empty">No scores yet. Be the first!</div>
      ) : (
        <div className="leaderboard-list">
          {leaderboard.map((user, index) => (
            <div key={user._id || index} className="leaderboard-item">
              <div className="leaderboard-rank">
                {index === 0 && '🥇'}
                {index === 1 && '🥈'}
                {index === 2 && '🥉'}
                {index > 2 && `#${index + 1}`}
              </div>
              <div className="leaderboard-address">{formatAddress(user.walletAddress)}</div>
              <div className="leaderboard-score">{user.highScore.toLocaleString()}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Leaderboard;

