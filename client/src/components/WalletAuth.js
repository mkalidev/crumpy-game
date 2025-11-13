import React from 'react';
import './WalletAuth.css';

const WalletAuth = ({ onConnect, loading }) => {
  return (
    <div className="wallet-auth">
      <div className="auth-card">
        <div className="auth-icon">🔐</div>
        <h2>Connect Your Wallet</h2>
        <p className="auth-description">
          Connect your Web3 wallet to play 2405 Game and earn points!
        </p>
        <button 
          className="connect-button" 
          onClick={onConnect}
          disabled={loading}
        >
          {loading ? 'Connecting...' : 'Connect Wallet'}
        </button>
        <p className="auth-note">
          You'll need MetaMask or another Web3 wallet installed in your browser.
        </p>
      </div>
    </div>
  );
};

export default WalletAuth;

