import { useEffect, useRef, useState, useCallback, useContext } from 'react';
import Tetris from 'react-tetris';
import { TerminalContext } from '../../context/TerminalContext';
import { checkIfScoreIsBetter, writeNewScore } from './tetrisUtils';
import TetrisLeaderBoard from './TetrisLeaderBoard';
import './tetris.css';

const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

// ─── Fires once when react-tetris transitions to LOST ────────────────────────
const GameOverDetector = ({ state, points, linesCleared, onGameOver }) => {
  const firedRef = useRef(false);
  useEffect(() => {
    if (state === 'LOST' && !firedRef.current) {
      firedRef.current = true;
      onGameOver(points, linesCleared);
    }
    if (state !== 'LOST') {
      firedRef.current = false;
    }
  }, [state, points, linesCleared, onGameOver]);
  return null;
};

// ─── Initials picker ─────────────────────────────────────────────────────────
const InitialsPicker = ({ initials, onChange }) => {
  const cycle = (index, delta) => {
    const cur  = alphabet.indexOf(initials[index]);
    const next = (cur + delta + alphabet.length) % alphabet.length;
    const arr  = [...initials];
    arr[index] = alphabet[next];
    onChange(arr);
  };
  return (
    <div className="letter-pickers">
      {initials.map((letter, i) => (
        <div key={i} className="letter">
          <button onClick={() => cycle(i, -1)}>▲</button>
          <span>{letter}</span>
          <button onClick={() => cycle(i, 1)}>▼</button>
        </div>
      ))}
    </div>
  );
};

// ─── Component ────────────────────────────────────────────────────────────────
const TerminalTetris = () => {
  const gameRef       = useRef(null);
  const controllerRef = useRef(null);
  const finalScoreRef = useRef({ points: 0, linesCleared: 0 });

  const { enterGameMode, exitGameMode, updateCommand } = useContext(TerminalContext);

  // idle → playing → scoring → idle
  const [appState,   setAppState]   = useState('idle');
  const [showScores, setShowScores] = useState(false);

  // Scoring flow
  const [scoreChecking,  setScoreChecking]  = useState(false);
  const [qualifiedBoard, setQualifiedBoard] = useState(false);
  const [initials,       setInitials]       = useState(['A', 'A', 'A']);
  const [submitted,      setSubmitted]      = useState(false);

  useEffect(() => {
    enterGameMode();
    if (gameRef.current) gameRef.current.focus();
    return () => exitGameMode();
  }, [enterGameMode, exitGameMode]);

  const handleKeyDown = (e) => {
    if (e.key === 'Escape') {
      e.preventDefault();
      exitGameMode();
      updateCommand('clear');
    }
  };

  // ─── Start game ─────────────────────────────────────────────────────────────
  const startGame = useCallback(() => {
    if (controllerRef.current) controllerRef.current.restart();
    setShowScores(false);
    setAppState('playing');
    if (gameRef.current) gameRef.current.focus();
  }, []);

  // ─── Game over from react-tetris ─────────────────────────────────────────────
  const handleGameOver = useCallback((points, linesCleared) => {
    finalScoreRef.current = { points, linesCleared };
    setAppState('scoring');
    setScoreChecking(true);
    setQualifiedBoard(false);
    setSubmitted(false);
    setInitials(['A', 'A', 'A']);

    checkIfScoreIsBetter(points, linesCleared)
      .then((q) => { setQualifiedBoard(q); setScoreChecking(false); })
      .catch(() => setScoreChecking(false));
  }, []);

  // ─── Submit score ────────────────────────────────────────────────────────────
  const submitScore = useCallback(async () => {
    const { points, linesCleared } = finalScoreRef.current;
    await writeNewScore(initials.join(''), points, linesCleared);
    setSubmitted(true);
  }, [initials]);

  return (
    <div
      className="terminal-game-container"
      ref={gameRef}
      tabIndex={0}
      onKeyDown={handleKeyDown}
      onClick={() => gameRef.current && gameRef.current.focus()}
    >
      <div className="game-header">
        <span className="game-title">TETRIS</span>
        <span className="game-exit-hint">Press ESC to exit</span>
      </div>

      <Tetris
        keyboardControls={{
          down:  'MOVE_DOWN',
          left:  'MOVE_LEFT',
          right: 'MOVE_RIGHT',
          space: 'HARD_DROP',
          z:     'FLIP_COUNTERCLOCKWISE',
          x:     'FLIP_CLOCKWISE',
          up:    'FLIP_CLOCKWISE',
          p:     'TOGGLE_PAUSE',
          c:     'HOLD',
          shift: 'HOLD',
        }}
      >
        {({ HeldPiece, Gameboard, PieceQueue, points, linesCleared, state, controller }) => {
          controllerRef.current = controller;
          return (
            <div className="tetris-layout">
              <GameOverDetector
                state={state}
                points={points}
                linesCleared={linesCleared}
                onGameOver={handleGameOver}
              />
              <div className="tetris-left">
                <p className="tetris-label">HOLD</p>
                <HeldPiece />
              </div>
              <div className="tetris-center">
                <Gameboard />
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
          );
        }}
      </Tetris>

      {/* ── Idle / title screen ── */}
      {appState === 'idle' && (
        <div className="tetris-overlay">
          <p className="tetris-overlay-title">TETRIS</p>
          {showScores
            ? <TetrisLeaderBoard />
            : <p className="tetris-overlay-hint">Use arrow keys to play</p>
          }
          <div className="tetris-title-buttons">
            <button className="tetris-overlay-btn" onClick={startGame}>[ START GAME ]</button>
            <button className="tetris-overlay-btn" onClick={() => setShowScores((s) => !s)}>
              {showScores ? '[ HIDE SCORES ]' : '[ HIGH SCORES ]'}
            </button>
          </div>
        </div>
      )}

      {/* ── Scoring screen ── */}
      {appState === 'scoring' && (
        <div className="tetris-overlay">
          <p className="tetris-overlay-title">GAME OVER</p>
          <p className="tetris-overlay-score">Score: {finalScoreRef.current.points}</p>
          <p className="tetris-overlay-score">Lines: {finalScoreRef.current.linesCleared}</p>

          {scoreChecking && (
            <p className="tetris-overlay-hint">Checking scores...</p>
          )}

          {!scoreChecking && qualifiedBoard && !submitted && (
            <div className="tetris-score-form">
              <p className="tetris-overlay-new-hi">✦ TOP 10 ✦</p>
              <p className="tetris-overlay-hint">Enter your initials</p>
              <InitialsPicker initials={initials} onChange={setInitials} />
              <button className="tetris-overlay-btn" onClick={submitScore}>ENTER</button>
            </div>
          )}

          {!scoreChecking && (!qualifiedBoard || submitted) && (
            <button className="tetris-overlay-btn" onClick={() => setAppState('idle')}>
              CONTINUE
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default TerminalTetris;
