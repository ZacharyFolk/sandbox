import { useEffect, useRef, useContext } from 'react';
import Tetris from 'react-tetris';
import { TerminalContext } from '../../context/TerminalContext';

const TerminalTetris = () => {
  const gameRef = useRef(null);
  const { enterGameMode, exitGameMode, updateCommand } =
    useContext(TerminalContext);

  // Enter game mode on mount, exit on unmount
  useEffect(() => {
    enterGameMode();

    // Focus the game container
    if (gameRef.current) {
      gameRef.current.focus();
    }

    // Cleanup - exit game mode when component unmounts
    return () => {
      exitGameMode();
    };
  }, [enterGameMode, exitGameMode]);

  // Handle keyboard - ESC to exit
  const handleKeyDown = (e) => {
    if (e.key === 'Escape') {
      e.preventDefault();
      exitGameMode();
      updateCommand('clear');
      return;
    }
  };

  // Re-focus game if clicked
  const handleClick = () => {
    if (gameRef.current) {
      gameRef.current.focus();
    }
  };

  return (
    <div
      className="terminal-game-container"
      ref={gameRef}
      tabIndex={0}
      onKeyDown={handleKeyDown}
      onClick={handleClick}
    >
      <div className="game-header">
        <span className="game-title">TETRIS</span>
        <span className="game-exit-hint">Press ESC to exit</span>
      </div>
      <Tetris
        keyboardControls={{
          down: 'MOVE_DOWN',
          left: 'MOVE_LEFT',
          right: 'MOVE_RIGHT',
          space: 'HARD_DROP',
          z: 'FLIP_COUNTERCLOCKWISE',
          x: 'FLIP_CLOCKWISE',
          up: 'FLIP_CLOCKWISE',
          p: 'TOGGLE_PAUSE',
          c: 'HOLD',
          shift: 'HOLD',
        }}
      >
        {({
          HeldPiece,
          Gameboard,
          PieceQueue,
          points,
          linesCleared,
          state,
          controller,
        }) => (
          <div className="tetris-layout">
            <div className="tetris-left">
              <p className="tetris-label">HOLD</p>
              <HeldPiece />
            </div>
            <div className="tetris-center">
              <Gameboard />
              {state === 'LOST' && (
                <div className="tetris-game-over">
                  <p>GAME OVER</p>
                  <button onClick={controller.restart}>NEW GAME</button>
                </div>
              )}
            </div>
            <div className="tetris-right">
              <div>
                <p className="tetris-label">NEXT</p>
                <PieceQueue />
              </div>
              <div className="tetris-stats">
                <p>PTS: {points}</p>
                <p>LNS: {linesCleared}</p>
              </div>
              <div className="tetris-controls">
                <p>←→ Move | ↑ Rotate</p>
                <p>↓ Drop | Space Fast</p>
                <p>C Hold | P Pause</p>
              </div>
            </div>
          </div>
        )}
      </Tetris>
    </div>
  );
};

export default TerminalTetris;
