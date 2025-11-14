export default function PointsDisplay({ points, highScore, walletAddress, onLogout }) {
  const shortAddress = `${walletAddress.slice(0, 6)}...${walletAddress.slice(-4)}`;

  return (
    <div className="bg-gray-900/80 backdrop-blur-md border border-gray-700 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row justify-between items-center gap-4 sm:gap-6">
      <div className="flex gap-6 sm:gap-8 flex-wrap justify-center sm:justify-start w-full sm:w-auto">
        <div className="flex flex-col items-center">
          <span className="text-xs sm:text-sm text-gray-400 mb-1">Points:</span>
          <span className="text-xl sm:text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-500 drop-shadow-md">{points.toLocaleString()}</span>
        </div>
        <div className="flex flex-col items-center">
          <span className="text-xs sm:text-sm text-gray-400 mb-1">High Score:</span>
          <span className="text-xl sm:text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500 drop-shadow-md">{highScore.toLocaleString()}</span>
        </div>
      </div>
      <div className="flex items-center gap-3 sm:gap-4 justify-center sm:justify-start w-full sm:w-auto">
        <span className="bg-gray-800 border border-gray-600 py-2 px-3 sm:px-4 rounded-full font-mono text-xs sm:text-sm text-gray-300">{shortAddress}</span>
        <button 
          className="bg-gray-800 text-gray-100 border border-gray-600 py-2 px-4 sm:px-5 rounded-full cursor-pointer transition-all hover:bg-gray-700 hover:border-gray-500 text-xs sm:text-sm" 
          onClick={onLogout}
        >
          Logout
        </button>
      </div>
    </div>
  );
}

