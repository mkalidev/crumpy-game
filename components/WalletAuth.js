export default function WalletAuth({ onConnect, loading }) {
  return (
    <div className="flex justify-center items-center min-h-[400px] border-b-2 border-gray-300 bg-">
      <div className="bg-white rounded-3xl p-10 shadow-2xl text-center max-w-md w-full">
        <div className="text-7xl mb-5">🔐</div>
        <h2 className="text-[#333] mb-4 text-3xl font-bold">Connect Your Wallet</h2>
        <p className="text-[#666] mb-8 leading-relaxed">
          Connect your Web3 wallet to play 2405 Game and earn points!
        </p>
        <button 
          className="bg-gradient-to-r from-[#667eea] to-[#764ba2] text-white border-none py-4 px-10 rounded-full text-lg font-bold cursor-pointer transition-all shadow-lg hover:-translate-y-0.5 hover:shadow-xl active:translate-y-0 disabled:opacity-60 disabled:cursor-not-allowed" 
          onClick={onConnect}
          disabled={loading}
        >
          {loading ? 'Connecting...' : 'Connect Wallet'}
        </button>
        <p className="mt-5 text-sm text-[#999] border-b-2 border-gray-300">
          You'll need MetaMask or another Web3 wallet installed in your browser.
        </p>
      </div>
    </div>
  );
}

