import { useEffect, useRef, useState, useCallback, useContext } from 'react';
import { TerminalContext } from '../../context/TerminalContext';
import { checkIfScoreIsBetter, writeNewScore } from './utils';
import SnakeLeaderBoard from './SnakeLeaderBoard';
import './snake.css';

const GRID  = 20;
const COLS  = 24;
const ROWS  = 18;
const W     = GRID * COLS;
const H     = GRID * ROWS;
const TICK  = 110;

const GREEN      = '#5bf870';
const GREEN_GLOW = 'rgba(91,248,112,0.25)';
const BG         = '#050505';
const GRID_DOT   = 'rgba(91,248,112,0.04)';

const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

const randomCell = (snake) => {
  let cell;
  do {
    cell = { x: Math.floor(Math.random() * COLS), y: Math.floor(Math.random() * ROWS) };
  } while (snake.some((s) => s.x === cell.x && s.y === cell.y));
  return cell;
};

const initState = () => {
  const snake = [{ x: 12, y: 9 }];
  return { snake, dir: { x: 1, y: 0 }, nextDir: { x: 1, y: 0 }, food: randomCell(snake), score: 0 };
};

// ─── Initials picker (same mechanic as CageMatch) ────────────────────────────
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
const TerminalSnake = () => {
  const { enterGameMode, exitGameMode, updateCommand } = useContext(TerminalContext);

  const canvasRef     = useRef(null);
  const wrapperRef    = useRef(null);
  const gs            = useRef(initState());
  const runningRef    = useRef(false);

  const [score,     setScore]     = useState(0);
  const [hiScore,   setHiScore]   = useState(() => parseInt(localStorage.getItem('snake-hi') || '0'));
  // idle → playing → scoring → idle
  const [gameState, setGameState] = useState('idle');
  const [showScores, setShowScores] = useState(false);

  // Scoring flow state
  const [scoreChecking,  setScoreChecking]  = useState(false);
  const [qualifiedBoard, setQualifiedBoard] = useState(false);
  const [initials,       setInitials]       = useState(['A', 'A', 'A']);
  const [submitted,      setSubmitted]      = useState(false);

  // ─── Game mode ──────────────────────────────────────────────────────────────
  useEffect(() => {
    enterGameMode();
    if (wrapperRef.current) wrapperRef.current.focus();
    return () => exitGameMode();
  }, [enterGameMode, exitGameMode]);

  // ─── API check when scoring screen appears ──────────────────────────────────
  useEffect(() => {
    if (gameState !== 'scoring') return;

    setScoreChecking(true);
    setQualifiedBoard(false);
    setSubmitted(false);
    setInitials(['A', 'A', 'A']);

    checkIfScoreIsBetter(gs.current.score)
      .then((qualifies) => {
        setQualifiedBoard(qualifies);
        setScoreChecking(false);
      })
      .catch(() => setScoreChecking(false));
  }, [gameState]);

  // ─── Start ───────────────────────────────────────────────────────────────────
  const startGame = useCallback(() => {
    gs.current = initState();
    setScore(0);
    setShowScores(false);
    setGameState('playing');
    runningRef.current = true;
    if (wrapperRef.current) wrapperRef.current.focus();
  }, []);

  // ─── End game (RAF loop — only refs + stable setters) ───────────────────────
  const endGame = useCallback(() => {
    runningRef.current = false;
    const s = gs.current.score;

    setHiScore((prev) => {
      const next = Math.max(prev, s);
      localStorage.setItem('snake-hi', String(next));
      return next;
    });

    setGameState('scoring');
  }, []);

  // ─── Submit to leaderboard ──────────────────────────────────────────────────
  const submitScore = useCallback(async () => {
    await writeNewScore(initials.join(''), gs.current.score);
    setSubmitted(true);
  }, [initials]);

  // ─── Draw ────────────────────────────────────────────────────────────────────
  const draw = useCallback((ctx, timestamp) => {
    const { snake, food } = gs.current;

    ctx.fillStyle = BG;
    ctx.fillRect(0, 0, W, H);

    ctx.fillStyle = GRID_DOT;
    for (let x = 0; x < COLS; x++) {
      for (let y = 0; y < ROWS; y++) {
        ctx.fillRect(x * GRID + GRID / 2 - 1, y * GRID + GRID / 2 - 1, 2, 2);
      }
    }

    const pulse = 0.5 + 0.5 * Math.sin(timestamp / 300);
    ctx.shadowBlur  = 6 + pulse * 10;
    ctx.shadowColor = GREEN;
    ctx.fillStyle   = GREEN;
    ctx.fillRect(food.x * GRID + 3, food.y * GRID + 3, GRID - 6, GRID - 6);
    ctx.shadowBlur  = 0;

    snake.forEach((seg, i) => {
      const fade = 1 - (i / snake.length) * 0.6;
      ctx.fillStyle   = i === 0 ? GREEN : `rgba(46,121,56,${fade})`;
      ctx.shadowBlur  = i === 0 ? 8 : 0;
      ctx.shadowColor = GREEN_GLOW;
      ctx.fillRect(seg.x * GRID + 1, seg.y * GRID + 1, GRID - 2, GRID - 2);
      ctx.shadowBlur  = 0;
    });
  }, []);

  // ─── Game loop ───────────────────────────────────────────────────────────────
  useEffect(() => {
    if (gameState !== 'playing') return;

    const canvas = canvasRef.current;
    const ctx    = canvas.getContext('2d');
    let lastTick = 0;
    let rafId;

    const tick = (ts) => {
      if (!runningRef.current) return;

      if (ts - lastTick >= TICK) {
        lastTick = ts;
        const { snake, nextDir, food, score } = gs.current;
        gs.current.dir = nextDir;

        const head    = snake[0];
        const newHead = { x: head.x + nextDir.x, y: head.y + nextDir.y };

        if (newHead.x < 0 || newHead.x >= COLS || newHead.y < 0 || newHead.y >= ROWS) {
          endGame(); draw(ctx, ts); return;
        }
        if (snake.some((s) => s.x === newHead.x && s.y === newHead.y)) {
          endGame(); draw(ctx, ts); return;
        }

        const newSnake = [newHead, ...snake];
        if (newHead.x === food.x && newHead.y === food.y) {
          gs.current.score = score + 10;
          gs.current.food  = randomCell(newSnake);
          setScore(gs.current.score);
        } else {
          newSnake.pop();
        }
        gs.current.snake = newSnake;
      }

      draw(ctx, ts);
      rafId = requestAnimationFrame(tick);
    };

    rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
  }, [gameState, draw, endGame]);

  // ─── Keyboard ────────────────────────────────────────────────────────────────
  const handleKeyDown = useCallback((e) => {
    if (e.key === 'Escape') {
      e.preventDefault();
      exitGameMode();
      updateCommand('clear');
      return;
    }

    const moveKeys = ['ArrowUp','ArrowDown','ArrowLeft','ArrowRight','w','a','s','d','W','A','S','D',' ','Enter'];

    if (gameState === 'idle' && moveKeys.includes(e.key)) {
      startGame();
      return;
    }

    if (gameState !== 'playing') return;

    const { dir } = gs.current;
    switch (e.key) {
      case 'ArrowUp':   case 'w': case 'W': if (dir.y !==  1) gs.current.nextDir = { x:  0, y: -1 }; break;
      case 'ArrowDown': case 's': case 'S': if (dir.y !== -1) gs.current.nextDir = { x:  0, y:  1 }; break;
      case 'ArrowLeft': case 'a': case 'A': if (dir.x !==  1) gs.current.nextDir = { x: -1, y:  0 }; break;
      case 'ArrowRight':case 'd': case 'D': if (dir.x !== -1) gs.current.nextDir = { x:  1, y:  0 }; break;
      default: return;
    }
    e.preventDefault();
  }, [gameState, startGame, exitGameMode, updateCommand]);

  // ─── Render ──────────────────────────────────────────────────────────────────
  const showOverlay = gameState !== 'playing';

  return (
    <div className="snake-container" ref={wrapperRef} tabIndex={0} onKeyDown={handleKeyDown}>
      <div className="snake-header">
        <span className="snake-title">SNAKE</span>
        <span className="snake-stat">SCORE: {score}</span>
        <span className="snake-stat">BEST: {hiScore}</span>
        <span className="snake-exit-hint">ESC to exit</span>
      </div>

      <div className="snake-canvas-area">
        <canvas ref={canvasRef} width={W} height={H} className="snake-canvas" />

        {showOverlay && (
          <div className="snake-overlay">

            {/* ── Idle / title screen ── */}
            {gameState === 'idle' && (
              <>
                <p className="snake-overlay-title">SNAKE</p>
                {showScores ? (
                  <SnakeLeaderBoard />
                ) : (
                  <p className="snake-overlay-hint">Press any arrow key to start</p>
                )}
                <div className="snake-title-buttons">
                  <button className="snake-submit-btn" onClick={startGame}>[ START GAME ]</button>
                  <button className="snake-submit-btn" onClick={() => setShowScores((s) => !s)}>
                    {showScores ? '[ HIDE SCORES ]' : '[ HIGH SCORES ]'}
                  </button>
                </div>
              </>
            )}

            {/* ── Scoring — API check + optional initials entry ── */}
            {gameState === 'scoring' && (
              <>
                <p className="snake-overlay-title">GAME OVER</p>
                <p className="snake-overlay-score">Score: {score}</p>

                {scoreChecking && (
                  <p className="snake-overlay-hint">Checking scores...</p>
                )}

                {!scoreChecking && qualifiedBoard && !submitted && (
                  <div className="snake-score-form">
                    <p className="snake-new-hi">✦ TOP 10 ✦</p>
                    <p className="snake-overlay-hint">Enter your initials</p>
                    <InitialsPicker initials={initials} onChange={setInitials} />
                    <button className="snake-submit-btn" onClick={submitScore}>ENTER</button>
                  </div>
                )}

                {!scoreChecking && (!qualifiedBoard || submitted) && (
                  <button
                    className="snake-submit-btn"
                    onClick={() => setGameState('idle')}
                  >
                    CONTINUE
                  </button>
                )}
              </>
            )}

          </div>
        )}
      </div>

      <div className="snake-footer">↑↓←→ or WASD to move</div>
    </div>
  );
};

export default TerminalSnake;
