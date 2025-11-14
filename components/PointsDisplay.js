export default function PointsDisplay({ points, highScore, walletAddress, onLogout }) {
  const shortAddress = `${walletAddress.slice(0, 6)}...${walletAddress.slice(-4)}`;

  return (
    <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row justify-between items-center gap-4 sm:gap-6">
      <div className="flex gap-6 sm:gap-8 flex-wrap justify-center sm:justify-start w-full sm:w-auto">
        <div className="flex flex-col items-center">
          <span className="text-xs sm:text-sm opacity-90 mb-1">Points:</span>
          <span className="text-xl sm:text-2xl font-bold text-yellow-400 drop-shadow-md">{points.toLocaleString()}</span>
        </div>
        <div className="flex flex-col items-center">
          <span className="text-xs sm:text-sm opacity-90 mb-1">High Score:</span>
          <span className="text-xl sm:text-2xl font-bold text-yellow-400 drop-shadow-md">{highScore.toLocaleString()}</span>
        </div>
      </div>
      <div className="flex items-center gap-3 sm:gap-4 justify-center sm:justify-start w-full sm:w-auto">
        <span className="bg-white/20 py-2 px-3 sm:px-4 rounded-full font-mono text-xs sm:text-sm">{shortAddress}</span>
        <button 
          className="bg-white/20 text-white border border-white/30 py-2 px-4 sm:px-5 rounded-full cursor-pointer transition-colors hover:bg-white/30 text-xs sm:text-sm" 
          onClick={onLogout}
        >
          Logout
        </button>
      </div>
    </div>
  );
}

