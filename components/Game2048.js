import { useState, useEffect, useCallback } from 'react';

const GRID_SIZE = 4;
const WINNING_TILE = 2405; // Game goal - reach 2405!

export default function Game2048({ onScore }) {
  const [grid, setGrid] = useState([]);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [won, setWon] = useState(false);

  // Initialize empty grid
  const initializeGrid = () => {
    const newGrid = Array(GRID_SIZE).fill(null).map(() => Array(GRID_SIZE).fill(0));
    addRandomTile(newGrid);
    addRandomTile(newGrid);
    return newGrid;
  };

  // Add random tile (2 or 4)
  const addRandomTile = (gridToUpdate) => {
    const emptyCells = [];
    for (let i = 0; i < GRID_SIZE; i++) {
      for (let j = 0; j < GRID_SIZE; j++) {
        if (gridToUpdate[i][j] === 0) {
          emptyCells.push({ row: i, col: j });
        }
      }
    }
    
    if (emptyCells.length > 0) {
      const randomCell = emptyCells[Math.floor(Math.random() * emptyCells.length)];
      gridToUpdate[randomCell.row][randomCell.col] = Math.random() < 0.9 ? 2 : 4;
    }
  };

  // Move tiles left
  const moveLeft = (gridToMove) => {
    const newGrid = gridToMove.map(row => {
      const filtered = row.filter(val => val !== 0);
      const merged = [];
      
      for (let i = 0; i < filtered.length; i++) {
        if (i < filtered.length - 1 && filtered[i] === filtered[i + 1]) {
          merged.push(filtered[i] * 2);
          i++; // Skip next tile
        } else {
          merged.push(filtered[i]);
        }
      }
      
      while (merged.length < GRID_SIZE) {
        merged.push(0);
      }
      
      return merged;
    });
    
    return newGrid;
  };

  // Rotate grid 90 degrees clockwise
  const rotateGrid = (gridToRotate) => {
    const rotated = Array(GRID_SIZE).fill(null).map(() => Array(GRID_SIZE).fill(0));
    for (let i = 0; i < GRID_SIZE; i++) {
      for (let j = 0; j < GRID_SIZE; j++) {
        rotated[j][GRID_SIZE - 1 - i] = gridToRotate[i][j];
      }
    }
    return rotated;
  };

  // Check if game is over
  const isGameOver = (gridToCheck) => {
    // Check for empty cells
    for (let i = 0; i < GRID_SIZE; i++) {
      for (let j = 0; j < GRID_SIZE; j++) {
        if (gridToCheck[i][j] === 0) return false;
      }
    }
    
    // Check for possible merges
    for (let i = 0; i < GRID_SIZE; i++) {
      for (let j = 0; j < GRID_SIZE; j++) {
        const current = gridToCheck[i][j];
        if (
          (i < GRID_SIZE - 1 && gridToCheck[i + 1][j] === current) ||
          (j < GRID_SIZE - 1 && gridToCheck[i][j + 1] === current)
        ) {
          return false;
        }
      }
    }
    
    return true;
  };

  // Move function for all directions
  const move = useCallback((direction) => {
    if (gameOver) return;

    let newGrid = grid.map(row => [...row]);
    
    switch (direction) {
      case 'left':
        newGrid = moveLeft(newGrid);
        break;
      case 'right':
        newGrid = rotateGrid(rotateGrid(moveLeft(rotateGrid(rotateGrid(newGrid)))));
        break;
      case 'up':
        newGrid = rotateGrid(rotateGrid(rotateGrid(moveLeft(rotateGrid(newGrid)))));
        break;
      case 'down':
        newGrid = rotateGrid(moveLeft(rotateGrid(rotateGrid(rotateGrid(newGrid)))));
        break;
      default:
        return;
    }

    // Check if grid changed
    const gridChanged = JSON.stringify(grid) !== JSON.stringify(newGrid);
    
    if (gridChanged) {
      addRandomTile(newGrid);
      setGrid(newGrid);
      
      // Calculate new score
      let newScore = 0;
      for (let i = 0; i < GRID_SIZE; i++) {
        for (let j = 0; j < GRID_SIZE; j++) {
          if (newGrid[i][j] >= 2405) {
            setWon(true);
          }
          newScore += newGrid[i][j];
        }
      }
      
      setScore(newScore);
      
      // Check for game over
      if (isGameOver(newGrid)) {
        setGameOver(true);
      }
    }
  }, [grid, gameOver]);

  // Handle keyboard input
  useEffect(() => {
    const handleKeyPress = (e) => {
      if (gameOver) return;
      
      switch (e.key) {
        case 'ArrowLeft':
          e.preventDefault();
          move('left');
          break;
        case 'ArrowRight':
          e.preventDefault();
          move('right');
          break;
        case 'ArrowUp':
          e.preventDefault();
          move('up');
          break;
        case 'ArrowDown':
          e.preventDefault();
          move('down');
          break;
        default:
          break;
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [move, gameOver]);

  // Initialize game
  useEffect(() => {
    setGrid(initializeGrid());
    setScore(0);
    setGameOver(false);
    setWon(false);
  }, []);

  // Reset game
  const resetGame = () => {
    if (onScore && score > 0) {
      onScore(score);
    }
    setGrid(initializeGrid());
    setScore(0);
    setGameOver(false);
    setWon(false);
  };

  // Get tile color based on value - Dark theme colors
  const getTileColor = (value) => {
    if (value === 0) return '#2d3748';
    
    const colors = {
      2: '#374151',
      4: '#4b5563',
      8: '#6366f1',
      16: '#8b5cf6',
      32: '#a855f7',
      64: '#c084fc',
      128: '#06b6d4',
      256: '#22d3ee',
      512: '#38bdf8',
      1024: '#60a5fa',
      2048: '#3b82f6',
      2405: '#fbbf24', // Special golden color for winning tile
    };
    
    return colors[value] || '#1e293b';
  };

  // Get text color based on value - Dark theme
  const getTextColor = (value) => {
    if (value === 0) return 'transparent';
    if (value <= 4) return '#e2e8f0';
    return '#ffffff';
  };

  return (
    <div className="bg-gray-900 rounded-3xl p-6 sm:p-8 shadow-2xl border border-gray-700">
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-6">
        <div className="bg-gradient-to-br from-cyan-600 to-blue-600 rounded-xl py-4 px-6 text-center text-white w-full sm:w-auto shadow-lg">
          <div className="text-xs uppercase opacity-90">Score</div>
          <div className="text-2xl sm:text-3xl font-bold">{score.toLocaleString()}</div>
        </div>
        <button 
          className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white border-none py-3 px-6 rounded-xl text-base font-bold cursor-pointer transition-all hover:from-purple-500 hover:to-indigo-500 hover:shadow-lg w-full sm:w-auto" 
          onClick={resetGame}
        >
          New Game
        </button>
      </div>

      <div className="text-center mb-6 text-gray-300 text-sm px-2">
        <p className="mb-2">Use arrow keys or swipe to move tiles. When two tiles with the same number touch, they merge into one!</p>
        <p className="text-cyan-400 font-semibold"><strong>Goal: Reach 2405!</strong></p>
      </div>

      <div className="relative w-full max-w-[500px] mx-auto mb-6 aspect-square bg-gray-800 rounded-xl p-2.5 border border-gray-700">
        <div className="grid grid-cols-4 grid-rows-4 gap-2.5 w-full h-full">
          {Array(GRID_SIZE * GRID_SIZE).fill(null).map((_, index) => (
            <div key={index} className="bg-gray-700/50 rounded-md border border-gray-600"></div>
          ))}
        </div>
        <div className="absolute top-2.5 left-2.5 right-2.5 bottom-2.5">
          {grid.map((row, i) =>
            row.map((value, j) =>
              value !== 0 && (
                <div
                  key={`${i}-${j}`}
                  className="absolute w-[calc(25%-7.5px)] h-[calc(25%-7.5px)] rounded-md text-xl sm:text-2xl lg:text-3xl font-bold flex items-center justify-center transition-all duration-150 z-10"
                  style={{
                    left: `${j * (100 / GRID_SIZE)}%`,
                    top: `${i * (100 / GRID_SIZE)}%`,
                    backgroundColor: getTileColor(value),
                    color: getTextColor(value),
                  }}
                >
                  {value}
                </div>
              )
            )
          )}
        </div>
      </div>

      <div className="flex justify-center items-center gap-2 flex-wrap">
        <button 
          className="bg-gray-700 text-white border border-gray-600 py-2.5 px-4 rounded-lg text-sm font-bold cursor-pointer transition-all hover:bg-gray-600 hover:border-gray-500 hover:shadow-lg min-w-[70px] sm:min-w-[80px]" 
          onClick={() => move('left')}
        >
          ← Left
        </button>
        <div className="flex flex-col gap-2">
          <button 
            className="bg-gray-700 text-white border border-gray-600 py-2.5 px-4 rounded-lg text-sm font-bold cursor-pointer transition-all hover:bg-gray-600 hover:border-gray-500 hover:shadow-lg min-w-[70px] sm:min-w-[80px]" 
            onClick={() => move('up')}
          >
            ↑ Up
          </button>
          <button 
            className="bg-gray-700 text-white border border-gray-600 py-2.5 px-4 rounded-lg text-sm font-bold cursor-pointer transition-all hover:bg-gray-600 hover:border-gray-500 hover:shadow-lg min-w-[70px] sm:min-w-[80px]" 
            onClick={() => move('down')}
          >
            ↓ Down
          </button>
        </div>
        <button 
          className="bg-gray-700 text-white border border-gray-600 py-2.5 px-4 rounded-lg text-sm font-bold cursor-pointer transition-all hover:bg-gray-600 hover:border-gray-500 hover:shadow-lg min-w-[70px] sm:min-w-[80px]" 
          onClick={() => move('right')}
        >
          Right →
        </button>
      </div>

      {(gameOver || won) && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-[1000]">
          <div className="bg-white rounded-3xl p-10 text-center max-w-md shadow-2xl">
            {won ? (
              <>
                <h2 className="text-[#776e65] mb-4 text-4xl font-bold">🎉 You Won!</h2>
                <p className="text-[#776e65] mb-6 text-lg">You reached 2405! Amazing!</p>
              </>
            ) : (
              <>
                <h2 className="text-[#776e65] mb-4 text-4xl font-bold">Game Over!</h2>
                <p className="text-[#776e65] mb-6 text-lg">Final Score: {score.toLocaleString()}</p>
              </>
            )}
            <button 
              className="bg-[#8f7a66] text-white border-none py-4 px-10 rounded-xl text-lg font-bold cursor-pointer transition-colors hover:bg-[#9f8a76]" 
              onClick={resetGame}
            >
              Play Again
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

