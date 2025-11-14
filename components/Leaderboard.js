import { useState, useEffect } from 'react';
import axios from 'axios';
import styles from './Leaderboard.module.css';

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
    <div className={styles.leaderboard}>
      <h2 className={styles.leaderboardTitle}>🏆 Leaderboard</h2>
      {loading ? (
        <div className={styles.leaderboardLoading}>Loading...</div>
      ) : leaderboard.length === 0 ? (
        <div className={styles.leaderboardEmpty}>No scores yet. Be the first!</div>
      ) : (
        <div className={styles.leaderboardList}>
          {leaderboard.map((user, index) => (
            <div key={user._id || index} className={styles.leaderboardItem}>
              <div className={styles.leaderboardRank}>
                {index === 0 && '🥇'}
                {index === 1 && '🥈'}
                {index === 2 && '🥉'}
                {index > 2 && `#${index + 1}`}
              </div>
              <div className={styles.leaderboardAddress}>{formatAddress(user.walletAddress)}</div>
              <div className={styles.leaderboardScore}>{user.highScore.toLocaleString()}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

