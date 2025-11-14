import GameHeader from './GameHeader';
import GameLayout from './GameLayout';
import WalletAuth from './WalletAuth';
import PointsDisplay from './PointsDisplay';

export default function GameContainer({
  isAuthenticated,
  address,
  points,
  highScore,
  loading,
  isConnected,
  contractRewards,
  contractHighScore,
  playerStats,
  onWalletConnect,
  onLogout,
  onGameScore,
}) {
  return (
    <main className="min-h-screen py-6 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto flex flex-col">
        <GameHeader />

        {isAuthenticated && address && (
          <div className="max-w-3xl mx-auto mb-8 w-full">
            <PointsDisplay 
              points={points} 
              highScore={highScore}
              walletAddress={address}
              onLogout={onLogout}
              contractRewards={contractRewards}
              contractHighScore={contractHighScore}
              playerStats={playerStats}
            />
          </div>
        )}

        {!isAuthenticated || !isConnected ? (
          <WalletAuth onConnect={onWalletConnect} loading={loading} isConnected={isConnected} />
        ) : (
          <div className="flex-1 flex items-start justify-center">
            <GameLayout onGameScore={onGameScore} />
          </div>
        )}
      </div>
    </main>
  );
}
