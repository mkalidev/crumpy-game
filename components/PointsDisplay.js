import styles from './PointsDisplay.module.css';

export default function PointsDisplay({ points, highScore, walletAddress, onLogout }) {
  const shortAddress = `${walletAddress.slice(0, 6)}...${walletAddress.slice(-4)}`;

  return (
    <div className={styles.pointsDisplay}>
      <div className={styles.pointsInfo}>
        <div className={styles.pointItem}>
          <span className={styles.pointLabel}>Points:</span>
          <span className={styles.pointValue}>{points.toLocaleString()}</span>
        </div>
        <div className={styles.pointItem}>
          <span className={styles.pointLabel}>High Score:</span>
          <span className={styles.pointValue}>{highScore.toLocaleString()}</span>
        </div>
      </div>
      <div className={styles.walletInfo}>
        <span className={styles.walletAddress}>{shortAddress}</span>
        <button className={styles.logoutButton} onClick={onLogout}>
          Logout
        </button>
      </div>
    </div>
  );
}

