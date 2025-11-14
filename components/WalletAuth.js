export default function WalletAuth({ onConnect, loading, isConnected }) {
  return (
    <div className="flex justify-center items-center min-h-[400px] py-8">
      <div className="bg-gray-900 border border-gray-700 rounded-3xl p-10 shadow-2xl text-center max-w-md w-full mx-4">
        <div className="text-7xl mb-6">🔐</div>
        <h2 className="text-gray-100 mb-4 text-3xl font-bold">Connect Your Wallet</h2>
        <p className="text-gray-400 mb-8 leading-relaxed">
          Connect your Web3 wallet to play 2405 Game and earn points!
        </p>
        <button 
          className="bg-gradient-to-r from-cyan-500 to-blue-600 text-white border-none py-4 px-10 rounded-full text-lg font-bold cursor-pointer transition-all shadow-lg hover:-translate-y-0.5 hover:shadow-xl hover:from-cyan-400 hover:to-blue-500 active:translate-y-0 disabled:opacity-60 disabled:cursor-not-allowed w-full sm:w-auto" 
          onClick={onConnect}
          disabled={loading}
        >
          {loading ? 'Signing message...' : isConnected ? 'Sign Message' : 'Connect Wallet'}
        </button>
        <p className="mt-6 text-sm text-gray-500">
          Connect using MetaMask, WalletConnect, or any supported Web3 wallet.
        </p>
      </div>
    </div>
  );
}

