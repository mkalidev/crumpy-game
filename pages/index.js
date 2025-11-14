import { useState, useEffect } from 'react';
import { useAccount, useSignMessage, useDisconnect } from 'wagmi';
import axios from 'axios';
import Head from 'next/head';
import Game2048 from '../components/Game2048';
import WalletAuth from '../components/WalletAuth';
import PointsDisplay from '../components/PointsDisplay';
import Leaderboard from '../components/Leaderboard';
import { useAppKit } from '@reown/appkit/react';

export default function Home() {
  const { address, isConnected } = useAccount();
  const { signMessageAsync } = useSignMessage();
  const { disconnect } = useDisconnect();
  const { open } = useAppKit();
  
  const [token, setToken] = useState('');
  const [points, setPoints] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Check for stored auth token
    if (typeof window !== 'undefined') {
      const storedToken = localStorage.getItem('gameToken');
      const storedWallet = localStorage.getItem('walletAddress');
      
      if (storedToken && storedWallet) {
        setToken(storedToken);
        fetchPoints(storedToken);
      }
    }
  }, []);

  // Auto-authenticate when wallet is connected
  useEffect(() => {
    if (isConnected && address && !token) {
      handleWalletAuth(address);
    }
    // If wallet disconnects, clear auth
    if (!isConnected && token) {
      handleLogout();
    }
  }, [isConnected, address]);

  const fetchPoints = async (authToken = token) => {
    if (!authToken) return;
    
    try {
      const response = await axios.get('/api/points', {
        headers: { Authorization: `Bearer ${authToken}` }
      });
      setPoints(response.data.points);
      setHighScore(response.data.highScore);
    } catch (err) {
      console.error('Failed to fetch points:', err);
      // Token might be expired, clear it
      if (err.response?.status === 401 || err.response?.status === 403) {
        handleLogout();
      }
    }
  };

  const handleWalletConnect = () => {
    open();
  };

  const handleWalletAuth = async (walletAddress) => {
    if (!walletAddress) return;

    setLoading(true);
    try {
      // Create authentication message
      const message = `Please sign this message to authenticate with 2405 Game.\n\nWallet: ${walletAddress}\n\nThis will not cost any gas.`;
      
      // Sign message using wagmi
      const signature = await signMessageAsync({ message });

      // Authenticate with backend
      const response = await axios.post('/api/auth', {
        walletAddress,
        signature,
        message
      });

      setToken(response.data.token);
      setPoints(response.data.user.points);
      setHighScore(response.data.user.highScore);

      // Store in localStorage
      localStorage.setItem('gameToken', response.data.token);
      localStorage.setItem('walletAddress', walletAddress);
    } catch (err) {
      console.error('Wallet authentication error:', err);
      if (err.code !== 4001 && err.code !== 'ACTION_REJECTED') {
        alert('Failed to authenticate wallet. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    disconnect();
    setToken('');
    setPoints(0);
    setHighScore(0);
    if (typeof window !== 'undefined') {
      localStorage.removeItem('gameToken');
      localStorage.removeItem('walletAddress');
    }
  };

  const handleGameScore = async (score) => {
    if (!token) return;

    try {
      // Calculate points: 1 point per 100 score
      const pointsEarned = Math.floor(score / 100);
      
      if (pointsEarned > 0) {
        const response = await axios.post(
          '/api/points',
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
    <>
      <Head>
        <title>2405 Game - Play & Earn Points</title>
        <meta name="description" content="Play 2405 Game with Web3 wallet authentication and earn points!" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="min-h-screen py-6 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <header className="text-center mb-8">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 drop-shadow-lg">
              2405 Game
            </h1>
            {address && token && (
              <div className="max-w-3xl mx-auto">
                <PointsDisplay 
                  points={points} 
                  highScore={highScore}
                  walletAddress={address}
                  onLogout={handleLogout}
                />
              </div>
            )}
          </header>

          {!token || !isConnected ? (
            <WalletAuth onConnect={handleWalletConnect} loading={loading} isConnected={isConnected} />
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-[1fr_350px] gap-6 lg:gap-8">
              <Game2048 onScore={handleGameScore} />
              <Leaderboard />
            </div>
          )}
        </div>
      </main>
    </>
  );
}

