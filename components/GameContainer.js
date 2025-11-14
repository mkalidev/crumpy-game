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
  onWalletConnect, 
  onLogout, 
  onGameScore 
}) {
  return (
    <main className="min-h-screen py-6 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <GameHeader />
        
        {isAuthenticated && address && (
          <div className="max-w-3xl mx-auto mb-8">
            <PointsDisplay 
              points={points} 
              highScore={highScore}
              walletAddress={address}
              onLogout={onLogout}
            />
          </div>
        )}

        {!isAuthenticated || !isConnected ? (
          <WalletAuth 
            onConnect={onWalletConnect} 
            loading={loading} 
            isConnected={isConnected} 
          />
        ) : (
          <GameLayout onGameScore={onGameScore} />
        )}
      </div>
    </main>
  );
}

