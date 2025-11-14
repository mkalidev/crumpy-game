import styles from './WalletAuth.module.css';

export default function WalletAuth({ onConnect, loading }) {
  return (
    <div className={styles.walletAuth}>
      <div className={styles.authCard}>
        <div className={styles.authIcon}>🔐</div>
        <h2>Connect Your Wallet</h2>
        <p className={styles.authDescription}>
          Connect your Web3 wallet to play 2405 Game and earn points!
        </p>
        <button 
          className={styles.connectButton} 
          onClick={onConnect}
          disabled={loading}
        >
          {loading ? 'Connecting...' : 'Connect Wallet'}
        </button>
        <p className={styles.authNote}>
          You'll need MetaMask or another Web3 wallet installed in your browser.
        </p>
      </div>
    </div>
  );
}

