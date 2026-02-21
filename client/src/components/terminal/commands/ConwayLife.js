import { useEffect, useRef, useState, useContext, useCallback } from 'react';
import { TerminalContext } from '../../../context/TerminalContext';

// ── Classic patterns ─────────────────────────────────────────────
const PATTERNS = {
  gliderGun: {
    name: 'GOSPER GLIDER GUN',
    cells: [
      [1,5],[1,6],[2,5],[2,6],
      [11,5],[11,6],[11,7],[12,4],[12,8],[13,3],[13,9],[14,3],[14,9],
      [15,6],[16,4],[16,8],[17,5],[17,6],[17,7],[18,6],
      [21,3],[21,4],[21,5],[22,3],[22,4],[22,5],[23,2],[23,6],
      [25,1],[25,2],[25,6],[25,7],
      [35,3],[35,4],[36,3],[36,4],
    ],
  },
  pulsar: {
    name: 'PULSAR',
    cells: (() => {
      const q = [[2,1],[3,1],[4,1],[1,2],[1,3],[1,4],[6,2],[6,3],[6,4],[2,6],[3,6],[4,6]];
      const c = [];
      for (const [x, y] of q) {
        c.push([x, y], [-x, y], [x, -y], [-x, -y]);
      }
      return c;
    })(),
    cx: 0, cy: 0,
  },
  acorn: {
    name: 'ACORN',
    cells: [[0,0],[1,0],[1,-2],[3,-1],[4,0],[5,0],[6,0]],
  },
  rPentomino: {
    name: 'R-PENTOMINO',
    cells: [[0,0],[1,0],[-1,1],[0,1],[0,-1]],
  },
  spaceshipFleet: {
    name: 'LWSS FLEET',
    cells: (() => {
      const ship = [[0,0],[3,0],[4,1],[0,2],[4,2],[1,3],[2,3],[3,3],[4,3]];
      const c = [];
      for (let i = 0; i < 4; i++) {
        const ox = i * 8;
        const oy = i * 3;
        for (const [x, y] of ship) c.push([x + ox, y + oy]);
      }
      return c;
    })(),
  },
};

const CELL_SIZE = 4;
const GRID_COLOR = 'rgba(var(--t-primary-rgb), 0.06)';

export default function ConwayLife() {
  const { enterGameMode, exitGameMode } = useContext(TerminalContext);
  const [quit, setQuit] = useState(false);
  const canvasRef = useRef(null);
  const gridRef = useRef(null);
  const runningRef = useRef(true);
  const genRef = useRef(0);
  const populationRef = useRef(0);
  const speedRef = useRef(60);
  const drawingRef = useRef(false);
  const drawValueRef = useRef(1);
  const patternNamesRef = useRef(Object.keys(PATTERNS));
  const patternIdxRef = useRef(0);
  const overlayRef = useRef(true);
  const [showInfo, setShowInfo] = useState(false);
  const animRef = useRef(null);
  const lastTickRef = useRef(0);

  const makeGrid = useCallback((w, h) => {
    return Array.from({ length: h }, () => new Uint8Array(w));
  }, []);

  const loadPattern = useCallback((grid, name) => {
    const W = grid[0].length;
    const H = grid.length;
    // Clear
    for (let y = 0; y < H; y++) grid[y].fill(0);
    const p = PATTERNS[name];
    const cx = p.cx !== undefined ? Math.floor(W / 3) + p.cx : Math.floor(W / 3);
    const cy = p.cy !== undefined ? Math.floor(H / 2) + p.cy : Math.floor(H / 2);
    for (const [dx, dy] of p.cells) {
      const x = cx + dx;
      const y = cy + dy;
      if (x >= 0 && x < W && y >= 0 && y < H) grid[y][x] = 1;
    }
    genRef.current = 0;
  }, []);

  const step = useCallback((grid) => {
    const H = grid.length;
    const W = grid[0].length;
    const next = Array.from({ length: H }, () => new Uint8Array(W));
    let pop = 0;
    for (let y = 0; y < H; y++) {
      for (let x = 0; x < W; x++) {
        let n = 0;
        for (let dy = -1; dy <= 1; dy++) {
          for (let dx = -1; dx <= 1; dx++) {
            if (dx === 0 && dy === 0) continue;
            const ny = (y + dy + H) % H;
            const nx = (x + dx + W) % W;
            n += grid[ny][nx];
          }
        }
        if (grid[y][x]) {
          next[y][x] = (n === 2 || n === 3) ? 1 : 0;
        } else {
          next[y][x] = (n === 3) ? 1 : 0;
        }
        pop += next[y][x];
      }
    }
    populationRef.current = pop;
    return next;
  }, []);

  useEffect(() => {
    if (quit) {
      exitGameMode();
      return;
    }
    enterGameMode();
    const canvas = canvasRef.current;
    const container = canvas.parentElement;
    const W = Math.floor(container.clientWidth / CELL_SIZE);
    const H = Math.floor(container.clientHeight / CELL_SIZE);
    canvas.width = W * CELL_SIZE;
    canvas.height = H * CELL_SIZE;

    let grid = makeGrid(W, H);
    gridRef.current = grid;
    loadPattern(grid, patternNamesRef.current[0]);

    const ctx = canvas.getContext('2d');

    // Get theme color from CSS
    const style = getComputedStyle(canvas);
    const primaryRgb = style.getPropertyValue('--t-primary-rgb').trim() || '91, 248, 112';
    const primary = style.getPropertyValue('--t-primary').trim() || '#5bf870';
    const bg = style.getPropertyValue('--t-bg').trim() || '#041b11';
    const text = style.getPropertyValue('--t-text').trim() || '#c7e4cb';

    const draw = () => {
      ctx.fillStyle = bg;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Grid lines
      ctx.strokeStyle = `rgba(${primaryRgb}, 0.04)`;
      ctx.lineWidth = 0.5;
      for (let x = 0; x <= W; x++) {
        ctx.beginPath();
        ctx.moveTo(x * CELL_SIZE, 0);
        ctx.lineTo(x * CELL_SIZE, canvas.height);
        ctx.stroke();
      }
      for (let y = 0; y <= H; y++) {
        ctx.beginPath();
        ctx.moveTo(0, y * CELL_SIZE);
        ctx.lineTo(canvas.width, y * CELL_SIZE);
        ctx.stroke();
      }

      // Cells
      for (let y = 0; y < H; y++) {
        for (let x = 0; x < W; x++) {
          if (gridRef.current[y][x]) {
            ctx.fillStyle = primary;
            ctx.shadowColor = primary;
            ctx.shadowBlur = 4;
            ctx.fillRect(x * CELL_SIZE + 0.5, y * CELL_SIZE + 0.5, CELL_SIZE - 1, CELL_SIZE - 1);
          }
        }
      }
      ctx.shadowBlur = 0;

      // CRT scanlines
      ctx.fillStyle = 'rgba(0,0,0,0.1)';
      for (let sy = 0; sy < canvas.height; sy += 3) {
        ctx.fillRect(0, sy, canvas.width, 1);
      }

      // HUD overlay
      if (overlayRef.current) {
        const pName = PATTERNS[patternNamesRef.current[patternIdxRef.current]].name;
        ctx.font = '14px "VT323", monospace';
        ctx.textBaseline = 'top';

        // Top bar
        ctx.fillStyle = `rgba(0,0,0,0.82)`;
        ctx.fillRect(0, 0, canvas.width, 24);
        ctx.shadowColor = primary; ctx.shadowBlur = 6;
        ctx.fillStyle = primary;
        ctx.fillText(`CONWAY'S GAME OF LIFE`, 8, 5);
        ctx.fillStyle = text;
        ctx.textAlign = 'right';
        ctx.fillText(`GEN: ${genRef.current}  POP: ${populationRef.current}  SPD: ${speedRef.current}ms`, canvas.width - 8, 5);
        ctx.textAlign = 'left';
        ctx.shadowBlur = 0;

        // Bottom bar
        ctx.fillStyle = `rgba(0,0,0,0.82)`;
        ctx.fillRect(0, canvas.height - 44, canvas.width, 44);
        ctx.shadowColor = primary; ctx.shadowBlur = 5;
        ctx.fillStyle = primary;
        ctx.fillText(`PATTERN: ${pName}`, 8, canvas.height - 38);
        ctx.shadowBlur = 0;
        ctx.fillStyle = `rgba(${primaryRgb}, 0.75)`;
        ctx.fillText(`[SPACE] PAUSE  [N] NEXT  [R] RANDOM  [C] CLEAR  [+/-] SPEED  [CLICK] DRAW  [I] INFO  [H] HUD  [ESC] EXIT`, 8, canvas.height - 22);
      }

    };

    const loop = (timestamp) => {
      animRef.current = requestAnimationFrame(loop);
      if (runningRef.current && timestamp - lastTickRef.current >= speedRef.current) {
        gridRef.current = step(gridRef.current);
        genRef.current++;
        lastTickRef.current = timestamp;
      }
      draw();
    };
    animRef.current = requestAnimationFrame(loop);

    // Mouse drawing
    const getCell = (e) => {
      const rect = canvas.getBoundingClientRect();
      const x = Math.floor((e.clientX - rect.left) / CELL_SIZE);
      const y = Math.floor((e.clientY - rect.top) / CELL_SIZE);
      return { x, y };
    };

    const onMouseDown = (e) => {
      drawingRef.current = true;
      const { x, y } = getCell(e);
      if (x >= 0 && x < W && y >= 0 && y < H) {
        drawValueRef.current = gridRef.current[y][x] ? 0 : 1;
        gridRef.current[y][x] = drawValueRef.current;
      }
    };
    const onMouseMove = (e) => {
      if (!drawingRef.current) return;
      const { x, y } = getCell(e);
      if (x >= 0 && x < W && y >= 0 && y < H) {
        gridRef.current[y][x] = drawValueRef.current;
      }
    };
    const onMouseUp = () => { drawingRef.current = false; };

    canvas.addEventListener('mousedown', onMouseDown);
    canvas.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);

    // Keyboard controls
    const onKey = (e) => {
      const key = e.key.toLowerCase();
      if (key === 'escape') {
        cancelAnimationFrame(animRef.current);
        setQuit(true);
        return;
      }
      if (key === ' ') {
        e.preventDefault();
        runningRef.current = !runningRef.current;
      }
      if (key === 'n') {
        patternIdxRef.current = (patternIdxRef.current + 1) % patternNamesRef.current.length;
        gridRef.current = makeGrid(W, H);
        loadPattern(gridRef.current, patternNamesRef.current[patternIdxRef.current]);
      }
      if (key === 'r') {
        for (let y = 0; y < H; y++)
          for (let x = 0; x < W; x++)
            gridRef.current[y][x] = Math.random() < 0.2 ? 1 : 0;
        genRef.current = 0;
      }
      if (key === 'c') {
        for (let y = 0; y < H; y++) gridRef.current[y].fill(0);
        genRef.current = 0;
        populationRef.current = 0;
      }
      if (key === 'h') {
        overlayRef.current = !overlayRef.current;
      }
      if (key === 'i' || key === '?') {
        setShowInfo(prev => !prev);
      }
      if (key === '+' || key === '=') {
        speedRef.current = Math.max(10, speedRef.current - 10);
      }
      if (key === '-' || key === '_') {
        speedRef.current = Math.min(500, speedRef.current + 10);
      }
      // Step forward when paused
      if (key === '.' && !runningRef.current) {
        gridRef.current = step(gridRef.current);
        genRef.current++;
      }
    };
    window.addEventListener('keydown', onKey);

    return () => {
      cancelAnimationFrame(animRef.current);
      canvas.removeEventListener('mousedown', onMouseDown);
      canvas.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
      window.removeEventListener('keydown', onKey);
      exitGameMode();
    };
  }, [quit, enterGameMode, exitGameMode, makeGrid, loadPattern, step]);

  if (quit) return null;

  return (
    <div style={{ width: '100%', height: '100%', position: 'relative' }}>
      <canvas
        ref={canvasRef}
        style={{
          display: 'block',
          width: '100%',
          height: '100%',
          cursor: 'crosshair',
          imageRendering: 'pixelated',
        }}
      />
      {showInfo && (
        <div className="conway-info-overlay" onClick={() => setShowInfo(false)}>
          <div className="conway-info-panel new-scroll" onClick={e => e.stopPropagation()}>
            <div className="conway-info-text">{`
  Conway's Game of Life
  ─────────────────────

  Devised by mathematician John Conway in 1970.
  A zero-player game — you set the initial state,
  then watch the universe unfold.

  The world is a grid. Each cell is alive or dead.
  Every generation, all cells update at once based
  on their eight neighbors. Three rules govern
  everything:


  The Rules
  ─────────

  1. Underpopulation
     A live cell with fewer than 2 neighbors dies.
     It perishes from isolation — alone in the void.

  2. Survival
     A live cell with 2 or 3 neighbors persists.
     The narrow band of equilibrium.

  3. Overcrowding
     A live cell with more than 3 neighbors dies.
     Consumed by the density around it.

  4. Reproduction
     A dead cell with exactly 3 living neighbors
     comes alive. Three parents, one offspring.

  That's it. From these rules, everything emerges.


  What Emerges
  ────────────

  Still lifes — small clusters that found perfect
  balance. Every cell has 2 or 3 neighbors, no dead
  cell nearby has exactly 3. They sit forever, frozen.
  The Block (2x2), Beehive, Loaf. The debris left
  behind after chaos burns itself out.

  Oscillators — patterns caught in a loop, pulsing
  between states. The Blinker flips every tick. The
  Pulsar breathes with period-3 symmetry. Trapped in
  time but never still.

  Spaceships — structures that walk. The Glider,
  five cells that tumble diagonally across infinity.
  Lightweight Spaceships cruise horizontally. They
  are not moving — they are rebuilding themselves
  one cell ahead, over and over.

  Guns — stationary factories that fire streams of
  gliders into the void. The Gosper Glider Gun was
  the first discovered, producing a new glider every
  30 generations. An engine with no fuel.

  Methuselahs — tiny seeds that explode into chaos.
  The R-Pentomino is just 5 cells. It takes 1,103
  generations to settle. The Acorn (7 cells) burns
  for 5,206. Eventually entropy wins and everything
  crystallizes into stable debris — still lifes and
  blinkers, the ash of spent complexity.


  Computation
  ───────────

  The Game of Life is Turing complete. Anything a
  computer can calculate, a sufficiently large Life
  pattern can too. Logic gates built from glider
  collisions. Memory stored in stable structures.
  In 2010, a universal Turing machine was constructed
  entirely within the game. A computer made of light
  and absence, running on three rules.


  Controls
  ────────

  Space ........ pause / resume
  N ............ next preset pattern
  R ............ randomize (20% density)
  C ............ clear all cells
  +/- .......... adjust speed
  . ............ step one generation (paused)
  H ............ toggle HUD
  I or ? ....... toggle this panel
  Click/drag ... draw or erase cells
  Esc .......... exit to terminal

  The grid wraps — edges connect to opposite sides.

`}</div>
          </div>
        </div>
      )}
    </div>
  );
}
