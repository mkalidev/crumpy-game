import Head from 'next/head';
import useAuthHandler from '../components/AuthHandler';
import GameContainer from '../components/GameContainer';

export default function Home() {
  const {
    token,
    points,
    highScore,
    loading,
    address,
    isConnected,
    handleWalletConnect,
    handleLogout,
    handleGameScore,
  } = useAuthHandler();

  const isAuthenticated = !!token && isConnected;

  return (
    <>
      <Head>
        <title>2405 Game - Play & Earn Points</title>
        <meta
          name="description"
          content="Play 2405 Game with Web3 wallet authentication and earn points!"
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <GameContainer
        isAuthenticated={isAuthenticated}
        address={address}
        points={points}
        highScore={highScore}
        loading={loading}
        isConnected={isConnected}
        onWalletConnect={handleWalletConnect}
        onLogout={handleLogout}
        onGameScore={handleGameScore}
      />
    </>
  );
}
