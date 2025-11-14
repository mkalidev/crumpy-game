import { useReadContract, useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { contractABI, contractAddress } from '@/constants';
import { useAccount } from 'wagmi';

/**
 * Hook to interact with the Game2048 contract
 */
export function useGameContract() {
  const { address } = useAccount();
  const { writeContract, data: hash, isPending, error } = useWriteContract();
  const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({
    hash,
  });

  return {
    writeContract,
    hash,
    isPending,
    isConfirming,
    isConfirmed,
    error,
    address,
  };
}

/**
 * Hook to start a new game
 */
export function useStartGame() {
  const { writeContract, isPending, isConfirming, isConfirmed, error, hash } = useGameContract();

  const startGame = async () => {
    try {
      await writeContract({
        address: contractAddress,
        abi: contractABI,
        functionName: 'startGame',
      });
    } catch (err) {
      console.error('Error starting game:', err);
      throw err;
    }
  };

  return {
    startGame,
    isPending,
    isConfirming,
    isConfirmed,
    error,
    hash,
  };
}

/**
 * Hook to end a game
 */
export function useEndGame() {
  const { writeContract, isPending, isConfirming, isConfirmed, error, hash } = useGameContract();

  const endGame = async (finalScore) => {
    try {
      await writeContract({
        address: contractAddress,
        abi: contractABI,
        functionName: 'endGame',
        args: [BigInt(finalScore)],
      });
    } catch (err) {
      console.error('Error ending game:', err);
      throw err;
    }
  };

  return {
    endGame,
    isPending,
    isConfirming,
    isConfirmed,
    error,
    hash,
  };
}

/**
 * Hook to claim rewards
 */
export function useClaimRewards() {
  const { writeContract, isPending, isConfirming, isConfirmed, error, hash } = useGameContract();

  const claimRewards = async () => {
    try {
      await writeContract({
        address: contractAddress,
        abi: contractABI,
        functionName: 'claimRewards',
      });
    } catch (err) {
      console.error('Error claiming rewards:', err);
      throw err;
    }
  };

  return {
    claimRewards,
    isPending,
    isConfirming,
    isConfirmed,
    error,
    hash,
  };
}

/**
 * Hook to get player stats from contract
 */
export function usePlayerStats(playerAddress) {
  const { address } = useAccount();
  const addressToUse = playerAddress || address;

  const { data: playerStats, isLoading, error, refetch } = useReadContract({
    address: contractAddress,
    abi: contractABI,
    functionName: 'getPlayerStats',
    args: addressToUse ? [addressToUse] : undefined,
    query: {
      enabled: !!addressToUse,
    },
  });

  return {
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
    isLoading,
    error,
    refetch,
  };
}

/**
 * Hook to get active game
 */
export function useActiveGame(playerAddress) {
  const { address } = useAccount();
  const addressToUse = playerAddress || address;

  const { data: activeGame, isLoading, error, refetch } = useReadContract({
    address: contractAddress,
    abi: contractABI,
    functionName: 'getActiveGame',
    args: addressToUse ? [addressToUse] : undefined,
    query: {
      enabled: !!addressToUse,
    },
  });

  return {
    activeGame: activeGame
      ? {
          gameId: Number(activeGame[0] || 0),
          score: Number(activeGame[1] || 0),
          timestamp: Number(activeGame[2] || 0),
          isActive: activeGame[3] || false,
        }
      : null,
    isLoading,
    error,
    refetch,
  };
}

/**
 * Hook to get leaderboard from contract
 */
export function useContractLeaderboard() {
  const { data, isLoading, error, refetch } = useReadContract({
    address: contractAddress,
    abi: contractABI,
    functionName: 'getLeaderboard',
  });

  const leaderboard = data
    ? data[0].map((address, index) => ({
        walletAddress: address,
        highScore: Number(data[1][index] || 0),
      }))
    : [];

  return {
    leaderboard,
    isLoading,
    error,
    refetch,
  };
}

/**
 * Hook to calculate rewards for a score
 */
export function useCalculateRewards() {
  const { data, isLoading, error } = useReadContract({
    address: contractAddress,
    abi: contractABI,
    functionName: 'calculateRewards',
    args: [BigInt(0)],
    query: {
      enabled: false,
    },
  });

  const calculateRewards = async (score) => {
    try {
      // This will be called via readContract when needed
      return data ? Number(data) : 0;
    } catch (err) {
      console.error('Error calculating rewards:', err);
      return 0;
    }
  };

  return {
    calculateRewards,
    isLoading,
    error,
  };
}

