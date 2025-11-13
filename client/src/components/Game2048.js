import React, { useState, useEffect, useCallback } from 'react';
import './Game2048.css';

const GRID_SIZE = 4;
const WINNING_TILE = 2405; // Game goal - reach 2405!

const Game2048 = ({ onScore }) => {
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

  // Get tile color based on value
  const getTileColor = (value) => {
    if (value === 0) return '#cdc1b4';
    
    const colors = {
      2: '#eee4da',
      4: '#ede0c8',
      8: '#f2b179',
      16: '#f59563',
      32: '#f67c5f',
      64: '#f65e3b',
      128: '#edcf72',
      256: '#edcc61',
      512: '#edc850',
      1024: '#edc53f',
      2048: '#edc22e',
      2405: '#ff6b35', // Special color for winning tile
    };
    
    return colors[value] || '#3c3a32';
  };

  // Get text color based on value
  const getTextColor = (value) => {
    return value <= 4 ? '#776e65' : '#f9f6f2';
  };

  return (
    <div className="game-2048">
      <div className="game-header">
        <div className="score-display">
          <div className="score-label">Score</div>
          <div className="score-value">{score.toLocaleString()}</div>
        </div>
        <button className="reset-button" onClick={resetGame}>
          New Game
        </button>
      </div>

      <div className="game-instructions">
        <p>Use arrow keys or swipe to move tiles. When two tiles with the same number touch, they merge into one!</p>
        <p><strong>Goal: Reach 2405!</strong></p>
      </div>

      <div className="game-board">
        <div className="grid-background">
          {Array(GRID_SIZE * GRID_SIZE).fill(null).map((_, index) => (
            <div key={index} className="grid-cell"></div>
          ))}
        </div>
        <div className="tiles-container">
          {grid.map((row, i) =>
            row.map((value, j) =>
              value !== 0 && (
                <div
                  key={`${i}-${j}`}
                  className="tile"
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

      <div className="game-controls">
        <button className="control-button" onClick={() => move('left')}>← Left</button>
        <div className="control-row">
          <button className="control-button" onClick={() => move('up')}>↑ Up</button>
          <button className="control-button" onClick={() => move('down')}>↓ Down</button>
        </div>
        <button className="control-button" onClick={() => move('right')}>Right →</button>
      </div>

      {(gameOver || won) && (
        <div className="game-overlay">
          <div className="game-over-message">
            {won ? (
              <>
                <h2>🎉 You Won!</h2>
                <p>You reached 2405! Amazing!</p>
              </>
            ) : (
              <>
                <h2>Game Over!</h2>
                <p>Final Score: {score.toLocaleString()}</p>
              </>
            )}
            <button className="play-again-button" onClick={resetGame}>
              Play Again
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Game2048;

