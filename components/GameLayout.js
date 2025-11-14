import Game2048 from './Game2048';
import Leaderboard from './Leaderboard';

export default function GameLayout({ onGameScore }) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-[1fr_350px] gap-6 lg:gap-8">
      <Game2048 onScore={onGameScore} />
      <Leaderboard />
    </div>
  );
}

