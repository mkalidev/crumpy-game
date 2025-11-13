import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import axios from 'axios';
import './App.css';
import Game2048 from './components/Game2048';
import WalletAuth from './components/WalletAuth';
import PointsDisplay from './components/PointsDisplay';
import Leaderboard from './components/Leaderboard';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

function App() {
  const [walletAddress, setWalletAddress] = useState('');
  const [token, setToken] = useState('');
  const [points, setPoints] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Check for stored auth token
    const storedToken = localStorage.getItem('gameToken');
    const storedWallet = localStorage.getItem('walletAddress');
    
    if (storedToken && storedWallet) {
      setToken(storedToken);
      setWalletAddress(storedWallet);
      fetchPoints(storedToken);
    }
  }, []);

  const fetchPoints = async (authToken = token) => {
    if (!authToken) return;
    
    try {
      const response = await axios.get(`${API_URL}/api/points`, {
        headers: { Authorization: `Bearer ${authToken}` }
      });
      setPoints(response.data.points);
      setHighScore(response.data.highScore);
    } catch (err) {
      console.error('Failed to fetch points:', err);
      // Token might be expired, clear it
      if (err.response?.status === 403) {
        handleLogout();
      }
    }
  };

  const handleWalletConnect = async () => {
    if (!window.ethereum) {
      alert('Please install MetaMask or another Web3 wallet to play!');
      return;
    }

    setLoading(true);
    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      await provider.send('eth_requestAccounts', []);
      const signer = await provider.getSigner();
      const address = await signer.getAddress();
      
      // Create authentication message
      const message = `Please sign this message to authenticate with 2405 Game.\n\nWallet: ${address}\n\nThis will not cost any gas.`;
      
      // Sign message
      const signature = await signer.signMessage(message);

      // Authenticate with backend
      const response = await axios.post(`${API_URL}/api/auth`, {
        walletAddress: address,
        signature,
        message
      });

      setToken(response.data.token);
      setWalletAddress(address);
      setPoints(response.data.user.points);
      setHighScore(response.data.user.highScore);

      // Store in localStorage
      localStorage.setItem('gameToken', response.data.token);
      localStorage.setItem('walletAddress', address);
    } catch (err) {
      console.error('Wallet connection error:', err);
      if (err.code !== 4001) { // User rejected request
        alert('Failed to connect wallet. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    setToken('');
    setWalletAddress('');
    setPoints(0);
    setHighScore(0);
    localStorage.removeItem('gameToken');
    localStorage.removeItem('walletAddress');
  };

  const handleGameScore = async (score) => {
    if (!token) return;

    try {
      // Calculate points: 1 point per 100 score
      const pointsEarned = Math.floor(score / 100);
      
      if (pointsEarned > 0) {
        const response = await axios.post(
          `${API_URL}/api/points`,
          { points: pointsEarned, score },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setPoints(response.data.points);
        setHighScore(response.data.highScore);
      }
    } catch (err) {
      console.error('Failed to update points:', err);
    }
  };

  return (
    <div className="App">
      <div className="container">
        <header className="header">
          <h1 className="title">2405 Game</h1>
          {walletAddress && (
            <PointsDisplay 
              points={points} 
              highScore={highScore}
              walletAddress={walletAddress}
              onLogout={handleLogout}
            />
          )}
        </header>

        {!token ? (
          <WalletAuth onConnect={handleWalletConnect} loading={loading} />
        ) : (
          <div className="game-container">
            <Game2048 onScore={handleGameScore} />
            <Leaderboard apiUrl={API_URL} />
          </div>
        )}
      </div>
    </div>
  );
}

export default App;

