import { useState, useEffect } from 'react';
import { useAccount, useSignMessage, useDisconnect } from 'wagmi';
import { useAppKit } from '@reown/appkit/react';
import { useReadContract } from 'wagmi';
import { contractABI, contractAddress } from '@/constants';
import axios from 'axios';

export default function useAuthHandler() {
  const { address, isConnected } = useAccount();
  const { signMessageAsync } = useSignMessage();
  const { disconnect } = useDisconnect();
  const { open } = useAppKit();

  const [token, setToken] = useState('');
  const [points, setPoints] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [loading, setLoading] = useState(false);
  const [contractRewards, setContractRewards] = useState(0);
  const [contractHighScore, setContractHighScore] = useState(0);

  useEffect(() => {
    // Check for stored auth token on mount
    if (typeof window !== 'undefined') {
      const storedToken = localStorage.getItem('gameToken');
      const storedWallet = localStorage.getItem('walletAddress');

      if (storedToken && storedWallet) {
        setToken(storedToken);
        fetchPoints(storedToken);
      }
    }
  }, []);

  // Get player stats from contract
  const { data: playerStats, refetch: refetchPlayerStats } = useReadContract({
    address: contractAddress,
    abi: contractABI,
    functionName: 'getPlayerStats',
    args: address ? [address] : undefined,
    query: {
      enabled: !!address && isConnected,
    },
  });

  // Update contract stats when playerStats changes
  useEffect(() => {
    if (playerStats) {
      setContractHighScore(Number(playerStats[1] || 0));
      setContractRewards(Number(playerStats[5] || 0)); // unclaimedRewards
    }
  }, [playerStats]);

  // Auto-authenticate when wallet is connected
  useEffect(() => {
    if (isConnected && address && !token && !loading) {
      handleWalletAuth(address);
    }
    // If wallet disconnects, clear auth
    if (!isConnected && token) {
      handleLogout();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isConnected, address]);

  // Refetch contract stats when address changes
  useEffect(() => {
    if (address && isConnected) {
      refetchPlayerStats();
    }
  }, [address, isConnected, refetchPlayerStats]);

  const fetchPoints = async (authToken = token) => {
    if (!authToken) return;

    try {
      const response = await axios.get('/api/points', {
        headers: { Authorization: `Bearer ${authToken}` },
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
        message,
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

      // Refetch contract stats after score update
      if (address) {
        refetchPlayerStats();
      }
    } catch (err) {
      console.error('Failed to update points:', err);
    }
  };

  return {
    // State
    token,
    points,
    highScore,
    loading,
    address,
    isConnected,
    contractRewards,
    contractHighScore,
    playerStats: playerStats
      ? {
          totalGamesPlayed: Number(playerStats[0] || 0),
          highScore: Number(playerStats[1] || 0),
          totalScore: Number(playerStats[2] || 0),
          rewardPoints: Number(playerStats[3] || 0),
          claimedRewards: Number(playerStats[4] || 0),
          unclaimedRewards: Number(playerStats[5] || 0),
        }
      : null,
    refetchPlayerStats,
    // Actions
    handleWalletConnect,
    handleLogout,
    handleGameScore,
  };
}
