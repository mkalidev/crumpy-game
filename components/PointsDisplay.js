export default function PointsDisplay({ points, highScore, walletAddress, onLogout }) {
  const shortAddress = `${walletAddress.slice(0, 6)}...${walletAddress.slice(-4)}`;

  return (
    <div className="bg-white/10 backdrop-blur-md rounded-2xl p-5 flex justify-between items-center flex-wrap gap-4 mb-5">
      <div className="flex gap-8 flex-wrap">
        <div className="flex flex-col items-center">
          <span className="text-sm opacity-90 mb-1">Points:</span>
          <span className="text-2xl font-bold text-yellow-400 drop-shadow-md">{points.toLocaleString()}</span>
        </div>
        <div className="flex flex-col items-center">
          <span className="text-sm opacity-90 mb-1">High Score:</span>
          <span className="text-2xl font-bold text-yellow-400 drop-shadow-md">{highScore.toLocaleString()}</span>
        </div>
      </div>
      <div className="flex items-center gap-4">
        <span className="bg-white/20 py-2 px-4 rounded-full font-mono text-sm">{shortAddress}</span>
        <button 
          className="bg-white/20 text-white border border-white/30 py-2 px-5 rounded-full cursor-pointer transition-colors hover:bg-white/30 text-sm" 
          onClick={onLogout}
        >
          Logout
        </button>
      </div>
    </div>
  );
}

