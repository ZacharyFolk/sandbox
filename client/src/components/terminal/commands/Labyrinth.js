import { useEffect, useRef, useContext } from 'react';
import { TerminalContext } from '../../../context/TerminalContext';

// ── Maze Generation (recursive backtracking) ────────────────────
const MAP_SIZE = 16;

function generateMaze() {
  const map = Array.from({ length: MAP_SIZE }, () => Array(MAP_SIZE).fill(1));

  function carve(x, y) {
    map[y][x] = 0;
    const dirs = [[0,-2],[0,2],[-2,0],[2,0]];
    for (let i = dirs.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [dirs[i], dirs[j]] = [dirs[j], dirs[i]];
    }
    for (const [dx, dy] of dirs) {
      const nx = x + dx, ny = y + dy;
      if (nx > 0 && nx < MAP_SIZE - 1 && ny > 0 && ny < MAP_SIZE - 1 && map[ny][nx] === 1) {
        map[y + dy / 2][x + dx / 2] = 0;
        carve(nx, ny);
      }
    }
  }

  carve(1, 1);
  return map;
}

// ── Component ───────────────────────────────────────────────────
export default function Labyrinth() {
  const { enterGameMode, exitGameMode } = useContext(TerminalContext);
  const containerRef = useRef(null);
  const canvasRef = useRef(null);

  useEffect(() => {
    enterGameMode();
    return () => exitGameMode();
  }, []);

  useEffect(() => {
    const container = containerRef.current;
    const canvas = canvasRef.current;
    if (!container || !canvas) return;

    const ctx = canvas.getContext('2d');
    const W = container.offsetWidth;
    const H = container.offsetHeight;
    canvas.width = W;
    canvas.height = H;

    const map = generateMaze();

    // Player state
    let posX = 1.5, posY = 1.5;
    let dirX = 1, dirY = 0;
    let planeX = 0, planeY = 0.66;

    const keys = {};
    let exited = false;

    const onKeyDown = (e) => {
      if (e.key === 'Escape') { exited = true; exitGameMode(); return; }
      keys[e.key] = true;
      e.preventDefault();
    };
    const onKeyUp = (e) => { keys[e.key] = false; };

    container.addEventListener('keydown', onKeyDown);
    container.addEventListener('keyup', onKeyUp);
    container.focus();

    const MOVE_SPEED = 0.045;
    const ROT_SPEED = 0.035;

    // ── Movement ──────────────────────────────────────────────────
    const canStep = (x, y) => {
      const mx = Math.floor(x), my = Math.floor(y);
      return mx >= 0 && mx < MAP_SIZE && my >= 0 && my < MAP_SIZE && map[my][mx] === 0;
    };

    const move = (dx, dy) => {
      const nx = posX + dx * MOVE_SPEED;
      const ny = posY + dy * MOVE_SPEED;
      if (canStep(nx, posY)) posX = nx;
      if (canStep(posX, ny)) posY = ny;
    };

    const rotate = (angle) => {
      const c = Math.cos(angle), s = Math.sin(angle);
      const od = dirX, op = planeX;
      dirX = dirX * c - dirY * s;
      dirY = od * s + dirY * c;
      planeX = planeX * c - planeY * s;
      planeY = op * s + planeY * c;
    };

    const update = () => {
      if (keys['w'] || keys['ArrowUp'])    move(dirX, dirY);
      if (keys['s'] || keys['ArrowDown'])  move(-dirX, -dirY);
      if (keys['a'])                       move(dirY, -dirX);
      if (keys['d'])                       move(-dirY, dirX);
      if (keys['ArrowLeft'])               rotate(ROT_SPEED);
      if (keys['ArrowRight'])              rotate(-ROT_SPEED);
    };

    // ── Rendering ─────────────────────────────────────────────────
    const render = () => {
      // Ceiling
      const cg = ctx.createLinearGradient(0, 0, 0, H / 2);
      cg.addColorStop(0, '#010503');
      cg.addColorStop(1, '#020a05');
      ctx.fillStyle = cg;
      ctx.fillRect(0, 0, W, H / 2);

      // Floor
      const fg = ctx.createLinearGradient(0, H / 2, 0, H);
      fg.addColorStop(0, '#020a05');
      fg.addColorStop(1, '#081a0c');
      ctx.fillStyle = fg;
      ctx.fillRect(0, H / 2, W, H / 2);

      // ── Raycast walls ──
      for (let x = 0; x < W; x++) {
        const cameraX = 2 * x / W - 1;
        const rayDirX = dirX + planeX * cameraX;
        const rayDirY = dirY + planeY * cameraX;

        let mapX = Math.floor(posX), mapY = Math.floor(posY);
        const ddx = Math.abs(1 / rayDirX);
        const ddy = Math.abs(1 / rayDirY);

        let stepX, stepY, sdx, sdy;
        if (rayDirX < 0) { stepX = -1; sdx = (posX - mapX) * ddx; }
        else              { stepX = 1;  sdx = (mapX + 1 - posX) * ddx; }
        if (rayDirY < 0) { stepY = -1; sdy = (posY - mapY) * ddy; }
        else              { stepY = 1;  sdy = (mapY + 1 - posY) * ddy; }

        let hit = false, side = 0;
        for (let i = 0; i < 30 && !hit; i++) {
          if (sdx < sdy) { sdx += ddx; mapX += stepX; side = 0; }
          else            { sdy += ddy; mapY += stepY; side = 1; }
          if (mapX >= 0 && mapX < MAP_SIZE && mapY >= 0 && mapY < MAP_SIZE && map[mapY][mapX] > 0) hit = true;
        }
        if (!hit) continue;

        const perpDist = side === 0
          ? (mapX - posX + (1 - stepX) / 2) / rayDirX
          : (mapY - posY + (1 - stepY) / 2) / rayDirY;

        const lineH = Math.floor(H / perpDist);
        const ds = Math.max(0, Math.floor(-lineH / 2 + H / 2));
        const de = Math.min(H - 1, Math.floor(lineH / 2 + H / 2));

        const bright = Math.min(1, 1.2 / (1 + perpDist * 0.25));
        const dim = side === 1 ? 0.6 : 1;
        const b = bright * dim;

        ctx.fillStyle = `rgb(${Math.floor(12 * b)},${Math.floor(248 * b)},${Math.floor(35 * b)})`;
        ctx.fillRect(x, ds, 1, de - ds + 1);
      }

      // ── Scanlines ──
      ctx.fillStyle = 'rgba(0,0,0,0.05)';
      for (let y = 0; y < H; y += 3) ctx.fillRect(0, y, W, 1);

      // ── Phosphor vignette ──
      const glow = ctx.createRadialGradient(W / 2, H / 2, H * 0.2, W / 2, H / 2, W * 0.75);
      glow.addColorStop(0, 'rgba(91,248,112,0.02)');
      glow.addColorStop(1, 'rgba(0,0,0,0.2)');
      ctx.fillStyle = glow;
      ctx.fillRect(0, 0, W, H);

      // ── Minimap ──
      const ms = 4;
      const mx = W - MAP_SIZE * ms - 12;
      const my = 12;

      ctx.globalAlpha = 0.35;
      ctx.fillStyle = '#000';
      ctx.fillRect(mx - 3, my - 3, MAP_SIZE * ms + 6, MAP_SIZE * ms + 6);
      ctx.strokeStyle = 'rgba(91,248,112,0.3)';
      ctx.lineWidth = 1;
      ctx.strokeRect(mx - 3, my - 3, MAP_SIZE * ms + 6, MAP_SIZE * ms + 6);

      for (let y = 0; y < MAP_SIZE; y++) {
        for (let x = 0; x < MAP_SIZE; x++) {
          ctx.fillStyle = map[y][x] ? '#1a3a1a' : '#060e06';
          ctx.fillRect(mx + x * ms, my + y * ms, ms, ms);
        }
      }

      // Player dot + direction
      ctx.globalAlpha = 0.9;
      ctx.fillStyle = '#5bf870';
      ctx.beginPath();
      ctx.arc(mx + posX * ms, my + posY * ms, 2, 0, Math.PI * 2);
      ctx.fill();

      ctx.strokeStyle = '#5bf870';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(mx + posX * ms, my + posY * ms);
      ctx.lineTo(mx + (posX + dirX * 2) * ms, my + (posY + dirY * 2) * ms);
      ctx.stroke();
      ctx.globalAlpha = 1;

      // ── FOV cone on minimap ──
      ctx.globalAlpha = 0.08;
      ctx.fillStyle = '#5bf870';
      ctx.beginPath();
      ctx.moveTo(mx + posX * ms, my + posY * ms);
      ctx.lineTo(mx + (posX + (dirX + planeX) * 4) * ms, my + (posY + (dirY + planeY) * 4) * ms);
      ctx.lineTo(mx + (posX + (dirX - planeX) * 4) * ms, my + (posY + (dirY - planeY) * 4) * ms);
      ctx.fill();
      ctx.globalAlpha = 1;

      // ── HUD ──
      ctx.font = '10px monospace';
      ctx.fillStyle = 'rgba(91,248,112,0.3)';

      const angle = Math.atan2(dirY, dirX) * 180 / Math.PI;
      let compass = 'E';
      if (angle > 45 && angle <= 135) compass = 'S';
      else if (angle > 135 || angle <= -135) compass = 'W';
      else if (angle > -135 && angle <= -45) compass = 'N';

      ctx.fillText(`SECTOR ${Math.floor(posX)}-${Math.floor(posY)}`, 10, 16);
      ctx.fillText(`BEARING: ${compass}  ${((angle + 360) % 360).toFixed(0)}\u00B0`, 10, 28);

      // Crosshair
      ctx.strokeStyle = 'rgba(91,248,112,0.15)';
      ctx.lineWidth = 1;
      const cx = W / 2, cy = H / 2;
      ctx.beginPath();
      ctx.moveTo(cx - 8, cy); ctx.lineTo(cx - 3, cy);
      ctx.moveTo(cx + 3, cy); ctx.lineTo(cx + 8, cy);
      ctx.moveTo(cx, cy - 8); ctx.lineTo(cx, cy - 3);
      ctx.moveTo(cx, cy + 3); ctx.lineTo(cx, cy + 8);
      ctx.stroke();
    };

    // ── Main loop ─────────────────────────────────────────────────
    let rafId;
    const loop = () => {
      if (exited) return;
      update();
      render();
      rafId = requestAnimationFrame(loop);
    };
    loop();

    return () => {
      exited = true;
      cancelAnimationFrame(rafId);
      container.removeEventListener('keydown', onKeyDown);
      container.removeEventListener('keyup', onKeyUp);
    };
  }, [exitGameMode]);

  return (
    <div ref={containerRef} className="labyrinth-container" tabIndex={0}>
      <canvas
        ref={canvasRef}
        style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}
      />
      <div className="labyrinth-hint">WASD move &middot; &larr; &rarr; turn &middot; ESC exit</div>
    </div>
  );
}
