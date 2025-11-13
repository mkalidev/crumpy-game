import React from 'react';
import './PointsDisplay.css';

const PointsDisplay = ({ points, highScore, walletAddress, onLogout }) => {
  const shortAddress = `${walletAddress.slice(0, 6)}...${walletAddress.slice(-4)}`;

  return (
    <div className="points-display">
      <div className="points-info">
        <div className="point-item">
          <span className="point-label">Points:</span>
          <span className="point-value">{points.toLocaleString()}</span>
        </div>
        <div className="point-item">
          <span className="point-label">High Score:</span>
          <span className="point-value">{highScore.toLocaleString()}</span>
        </div>
      </div>
      <div className="wallet-info">
        <span className="wallet-address">{shortAddress}</span>
        <button className="logout-button" onClick={onLogout}>
          Logout
        </button>
      </div>
    </div>
  );
};

export default PointsDisplay;

