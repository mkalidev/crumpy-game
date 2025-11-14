import Game2048 from './Game2048';
import Leaderboard from './Leaderboard';

export default function GameLayout({ onGameScore }) {
  return (
    <div className="flex flex-col gap-6 lg:gap-8">
      <Game2048 onScore={onGameScore} />
      <div className="max-w-[500px] mx-auto w-full">
        <Leaderboard />
      </div>
    </div>
  );
}
