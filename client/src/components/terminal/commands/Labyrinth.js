import { useEffect, useRef, useContext } from 'react';
import { TerminalContext } from '../../../context/TerminalContext';

// ── Maze Generation ─────────────────────────────────────────────
const MAP_SIZE = 16;
const CELL_EMPTY = 0;
const CELL_WALL = 1;
// 2-6 = gallery art textures
const CELL_SWITCH = 8;
const CELL_GOAL = 9;

function generateMaze() {
  const map = Array.from({ length: MAP_SIZE }, () => Array(MAP_SIZE).fill(CELL_WALL));

  function carve(x, y) {
    map[y][x] = CELL_EMPTY;
    const dirs = [[0,-2],[0,2],[-2,0],[2,0]];
    for (let i = dirs.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [dirs[i], dirs[j]] = [dirs[j], dirs[i]];
    }
    for (const [dx, dy] of dirs) {
      const nx = x + dx, ny = y + dy;
      if (nx > 0 && nx < MAP_SIZE - 1 && ny > 0 && ny < MAP_SIZE - 1 && map[ny][nx] === CELL_WALL) {
        map[y + dy / 2][x + dx / 2] = CELL_EMPTY;
        carve(nx, ny);
      }
    }
  }
  carve(1, 1);

  // ── BFS to find distances from start ──
  const dist = Array.from({ length: MAP_SIZE }, () => Array(MAP_SIZE).fill(-1));
  const queue = [[1, 1]];
  dist[1][1] = 0;
  let head = 0;
  while (head < queue.length) {
    const [cx, cy] = queue[head++];
    for (const [dx, dy] of [[0,1],[0,-1],[1,0],[-1,0]]) {
      const nx = cx + dx, ny = cy + dy;
      if (nx >= 0 && nx < MAP_SIZE && ny >= 0 && ny < MAP_SIZE && map[ny][nx] === CELL_EMPTY && dist[ny][nx] === -1) {
        dist[ny][nx] = dist[cy][cx] + 1;
        queue.push([nx, ny]);
      }
    }
  }

  // Find dead ends and the farthest one for goal
  const deadEnds = [];
  let maxDist = 0, goalX = 1, goalY = 1;

  for (let y = 1; y < MAP_SIZE - 1; y++) {
    for (let x = 1; x < MAP_SIZE - 1; x++) {
      if (map[y][x] !== CELL_EMPTY) continue;
      const neighbors = [[x,y-1],[x,y+1],[x-1,y],[x+1,y]];
      const openDirs = neighbors.filter(([nx, ny]) => map[ny][nx] === CELL_EMPTY);
      if (openDirs.length === 1) {
        deadEnds.push({ x, y, dist: dist[y][x], openDir: openDirs[0] });
        if (dist[y][x] > maxDist) {
          maxDist = dist[y][x];
          goalX = x; goalY = y;
        }
      }
    }
  }

  // Mark gallery walls at dead ends (except goal)
  const artTypes = [2, 3, 4, 5, 6];
  let artIdx = 0;
  for (const de of deadEnds) {
    if (de.x === goalX && de.y === goalY) continue;
    const [ox, oy] = de.openDir;
    const wallX = de.x - (ox - de.x);
    const wallY = de.y - (oy - de.y);
    if (wallX >= 0 && wallX < MAP_SIZE && wallY >= 0 && wallY < MAP_SIZE && map[wallY][wallX] === CELL_WALL) {
      map[wallY][wallX] = artTypes[artIdx % artTypes.length];
      artIdx++;
    }
  }

  // Place goal at the farthest dead end
  map[goalY][goalX] = CELL_GOAL;

  // Place light switch at ~40% of max path distance
  const switchTarget = Math.floor(maxDist * 0.4);
  let bestSwitch = null, bestDiff = Infinity;
  for (const [sx, sy] of queue) {
    if (map[sy][sx] !== CELL_EMPTY) continue;
    if (sx === 1 && sy === 1) continue;
    const d = Math.abs(dist[sy][sx] - switchTarget);
    if (d < bestDiff) { bestDiff = d; bestSwitch = [sx, sy]; }
  }
  if (bestSwitch) map[bestSwitch[1]][bestSwitch[0]] = CELL_SWITCH;

  return { map, goalX, goalY };
}

// ── Pre-render art textures ─────────────────────────────────────
const TEX_SIZE = 64;

function buildTexture(artFn) {
  const c = document.createElement('canvas');
  c.width = TEX_SIZE; c.height = TEX_SIZE;
  const cx = c.getContext('2d');
  const img = cx.createImageData(TEX_SIZE, TEX_SIZE);
  const d = img.data;
  const margin = 0.08, frameW = 0.04;
  const inner = 1 - 2 * margin - 2 * frameW;

  for (let py = 0; py < TEX_SIZE; py++) {
    for (let px = 0; px < TEX_SIZE; px++) {
      const u = px / TEX_SIZE, v = py / TEX_SIZE;
      const idx = (py * TEX_SIZE + px) * 4;
      const inFrame = u > margin && u < 1 - margin && v > margin && v < 1 - margin;
      const inArt = u > margin + frameW && u < 1 - margin - frameW &&
                    v > margin + frameW && v < 1 - margin - frameW;
      if (inArt) {
        const au = (u - margin - frameW) / inner;
        const av = (v - margin - frameW) / inner;
        const b = artFn(au, av);
        d[idx] = Math.floor(255 * b); d[idx+1] = Math.floor(200 * b); d[idx+2] = Math.floor(80 * b);
      } else if (inFrame) {
        d[idx] = 180; d[idx+1] = 140; d[idx+2] = 30;
      } else {
        d[idx] = 128; d[idx+1] = 88; d[idx+2] = 0;
      }
      d[idx+3] = 255;
    }
  }
  cx.putImageData(img, 0, 0);
  return c;
}

function artSierpinski(u, v) {
  let x = Math.floor(u * 32), y = Math.floor(v * 32);
  while (x > 0 || y > 0) {
    if (x % 3 === 1 && y % 3 === 1) return 0;
    x = Math.floor(x / 3); y = Math.floor(y / 3);
  }
  return 1;
}
function artSpiral(u, v) {
  const cx = u - 0.5, cy = v - 0.5;
  return Math.sin(Math.atan2(cy, cx) * 3 + Math.sqrt(cx * cx + cy * cy) * 48) > 0 ? 1 : 0.2;
}
function artCheckerboard(u, v) {
  return (Math.floor(u * 6) + Math.floor(v * 6)) % 2 === 0 ? 1 : 0.15;
}
function artDiamond(u, v) {
  return Math.sin((Math.abs(u - 0.5) * 2 + Math.abs(v - 0.5) * 2) * 12) > 0 ? 1 : 0.2;
}
function artCircles(u, v) {
  const cx = u - 0.5, cy = v - 0.5;
  return Math.sin(Math.sqrt(cx * cx + cy * cy) * 30) > 0 ? 1 : 0.15;
}

let ART_TEXTURES = null;
function getArtTextures() {
  if (!ART_TEXTURES) {
    ART_TEXTURES = {
      2: buildTexture(artSierpinski),
      3: buildTexture(artSpiral),
      4: buildTexture(artCheckerboard),
      5: buildTexture(artDiamond),
      6: buildTexture(artCircles),
    };
  }
  return ART_TEXTURES;
}

// ── Helper: is a cell walkable? ─────────────────────────────────
function isOpen(map, x, y) {
  if (x < 0 || x >= MAP_SIZE || y < 0 || y >= MAP_SIZE) return false;
  const v = map[y][x];
  return v === CELL_EMPTY || v === CELL_SWITCH || v === CELL_GOAL;
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

    const { map, goalX, goalY } = generateMaze();
    const textures = getArtTextures();

    // Player state
    let posX = 1.5, posY = 1.5;
    let dirX = 1, dirY = 0;
    let planeX = 0, planeY = 0.66;

    // Lighting state — starts dark
    let lightsOn = false;
    let lightLevel = 0; // 0 = dark, 1 = fully lit — animates on switch
    let switchFlash = 0; // brief white flash on switch activation

    // Victory state
    let victory = false;
    let victoryTimer = 0;

    const keys = {};
    let exited = false;

    const onKeyDown = (e) => {
      if (e.key === 'Escape') {
        try { if (document.pointerLockElement === canvas) document.exitPointerLock(); } catch (_) {}
        exited = true; exitGameMode(); return;
      }
      keys[e.key] = true;
      e.preventDefault();
    };
    const onKeyUp = (e) => { keys[e.key] = false; };

    container.addEventListener('keydown', onKeyDown);
    container.addEventListener('keyup', onKeyUp);
    container.focus();

    // ── Mouse look (Pointer Lock) ───────────────────────────────
    const MOUSE_SENSITIVITY = 0.003;

    const onMouseMove = (e) => {
      if (document.pointerLockElement !== canvas) return;
      rotate(e.movementX * MOUSE_SENSITIVITY);
    };

    const onClick = () => {
      try { if (document.pointerLockElement !== canvas) canvas.requestPointerLock(); } catch (_) {}
    };

    document.addEventListener('mousemove', onMouseMove);
    canvas.addEventListener('click', onClick);

    const MOVE_SPEED = 0.06;
    const ROT_SPEED = 0.045;
    const M = 0.1; // collision radius — small enough to not jam in corridors

    // ── Movement with wall-slide collision ──────────────────────
    const canMove = (x, y) =>
      isOpen(map, Math.floor(x - M), Math.floor(y - M)) &&
      isOpen(map, Math.floor(x + M), Math.floor(y - M)) &&
      isOpen(map, Math.floor(x - M), Math.floor(y + M)) &&
      isOpen(map, Math.floor(x + M), Math.floor(y + M));

    const move = (dx, dy) => {
      const nx = posX + dx * MOVE_SPEED;
      const ny = posY + dy * MOVE_SPEED;

      // Try both axes
      if (canMove(nx, ny)) { posX = nx; posY = ny; return; }
      // Wall slide — try each axis independently
      if (canMove(nx, posY)) posX = nx;
      else if (canMove(posX, ny)) posY = ny;
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
      if (victory) { victoryTimer++; return; }

      if (keys['w'] || keys['ArrowUp'])    move(dirX, dirY);
      if (keys['s'] || keys['ArrowDown'])  move(-dirX, -dirY);
      if (keys['a'])                       move(dirY, -dirX);
      if (keys['d'])                       move(-dirY, dirX);
      if (keys['ArrowLeft'])               rotate(ROT_SPEED);
      if (keys['ArrowRight'])              rotate(-ROT_SPEED);

      // Check if standing on switch
      const cellX = Math.floor(posX), cellY = Math.floor(posY);
      if (!lightsOn && map[cellY] && map[cellY][cellX] === CELL_SWITCH) {
        lightsOn = true;
        switchFlash = 1;
        map[cellY][cellX] = CELL_EMPTY; // consume the switch
      }

      // Check if reached goal
      if (map[cellY] && map[cellY][cellX] === CELL_GOAL) {
        victory = true;
        victoryTimer = 0;
      }

      // Animate light level
      if (lightsOn && lightLevel < 1) {
        lightLevel = Math.min(1, lightLevel + 0.02);
      }
      if (switchFlash > 0) switchFlash *= 0.92;
    };

    // ── Rendering ─────────────────────────────────────────────────
    const render = () => {
      // Brightness calculation based on light state
      // Dark mode: very steep falloff. Lit mode: gentle falloff.
      const distMult = 0.25 + 1.2 * (1 - lightLevel); // dark=1.45, lit=0.25

      // Ceiling
      const ceilBright = Math.floor(5 + 8 * lightLevel);
      ctx.fillStyle = `rgb(${ceilBright},${Math.floor(ceilBright * 0.6)},0)`;
      ctx.fillRect(0, 0, W, H / 2);

      // Floor
      const floorDark = Math.floor(10 + 16 * lightLevel);
      const floorLight = Math.floor(26 + 20 * lightLevel);
      const fg = ctx.createLinearGradient(0, H / 2, 0, H);
      fg.addColorStop(0, `rgb(${floorDark},${Math.floor(floorDark * 0.6)},0)`);
      fg.addColorStop(1, `rgb(${floorLight},${Math.floor(floorLight * 0.55)},${Math.floor(floorLight * 0.08)})`);
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
          if (mapX >= 0 && mapX < MAP_SIZE && mapY >= 0 && mapY < MAP_SIZE) {
            const v = map[mapY][mapX];
            if (v === CELL_WALL || (v >= 2 && v <= 6)) hit = true;
          }
        }
        if (!hit) continue;

        const wallType = map[mapY][mapX];
        const perpDist = side === 0
          ? (mapX - posX + (1 - stepX) / 2) / rayDirX
          : (mapY - posY + (1 - stepY) / 2) / rayDirY;

        const lineH = Math.floor(H / perpDist);
        const ds = Math.max(0, Math.floor(-lineH / 2 + H / 2));
        const de = Math.min(H - 1, Math.floor(lineH / 2 + H / 2));

        const bright = Math.min(1, 1.2 / (1 + perpDist * distMult));
        const dim = side === 1 ? 0.6 : 1;
        const b = bright * dim;

        if (wallType >= 2 && wallType <= 6 && textures[wallType]) {
          // Gallery wall — texture-mapped
          let wallX_uv;
          if (side === 0) wallX_uv = posY + perpDist * rayDirY;
          else wallX_uv = posX + perpDist * rayDirX;
          wallX_uv -= Math.floor(wallX_uv);

          const tex = textures[wallType];
          const srcX = Math.floor(wallX_uv * TEX_SIZE);
          ctx.drawImage(tex, srcX, 0, 1, TEX_SIZE, x, ds, 1, de - ds + 1);

          const darkness = 1 - b;
          if (darkness > 0.01) {
            ctx.fillStyle = `rgba(0,0,0,${darkness})`;
            ctx.fillRect(x, ds, 1, de - ds + 1);
          }
        } else {
          // Normal amber wall
          ctx.fillStyle = `rgb(${Math.floor(255 * b)},${Math.floor(176 * b)},0)`;
          ctx.fillRect(x, ds, 1, de - ds + 1);
        }
      }

      // ── Goal beacon (pulsing column of light) ──
      // Project goal position into screen space
      const gdx = (goalX + 0.5) - posX, gdy = (goalY + 0.5) - posY;
      const goalDist = Math.sqrt(gdx * gdx + gdy * gdy);
      if (goalDist < 12 && !victory) {
        const invDet = 1 / (planeX * dirY - dirX * planeY);
        const tx = invDet * (dirY * gdx - dirX * gdy);
        const tz = invDet * (-planeY * gdx + planeX * gdy);
        if (tz > 0.1) {
          const screenX = Math.floor((1 + tx / tz) * W / 2);
          const pulseAlpha = (0.15 + 0.1 * Math.sin(Date.now() / 300)) / (1 + tz * 0.3);
          if (screenX > -20 && screenX < W + 20) {
            const grad = ctx.createLinearGradient(screenX - 15, 0, screenX + 15, 0);
            grad.addColorStop(0, 'rgba(255,220,100,0)');
            grad.addColorStop(0.5, `rgba(255,220,100,${pulseAlpha})`);
            grad.addColorStop(1, 'rgba(255,220,100,0)');
            ctx.fillStyle = grad;
            ctx.fillRect(screenX - 15, 0, 30, H);
          }
        }
      }

      // ── Switch glow (visible beacon in the dark) ──
      // Find switch on map and render glow if still present
      for (let sy = 0; sy < MAP_SIZE; sy++) {
        for (let sx = 0; sx < MAP_SIZE; sx++) {
          if (map[sy][sx] !== CELL_SWITCH) continue;
          const sdx2 = (sx + 0.5) - posX, sdy2 = (sy + 0.5) - posY;
          const sDist = Math.sqrt(sdx2 * sdx2 + sdy2 * sdy2);
          if (sDist > 8) continue;
          const invDet = 1 / (planeX * dirY - dirX * planeY);
          const tx = invDet * (dirY * sdx2 - dirX * sdy2);
          const tz = invDet * (-planeY * sdx2 + planeX * sdy2);
          if (tz > 0.1) {
            const screenX = Math.floor((1 + tx / tz) * W / 2);
            const flicker = 0.2 + 0.1 * Math.sin(Date.now() / 200);
            const alpha = flicker / (1 + tz * 0.5);
            if (screenX > -30 && screenX < W + 30) {
              const grad = ctx.createRadialGradient(screenX, H / 2, 0, screenX, H / 2, 30 / tz);
              grad.addColorStop(0, `rgba(255,200,50,${alpha})`);
              grad.addColorStop(1, 'rgba(255,200,50,0)');
              ctx.fillStyle = grad;
              ctx.fillRect(screenX - 40, H / 2 - 40, 80, 80);
            }
          }
        }
      }

      // ── Scanlines ──
      ctx.fillStyle = 'rgba(0,0,0,0.05)';
      for (let y = 0; y < H; y += 3) ctx.fillRect(0, y, W, 1);

      // ── Vignette ──
      const glow = ctx.createRadialGradient(W / 2, H / 2, H * 0.2, W / 2, H / 2, W * 0.75);
      glow.addColorStop(0, 'rgba(255,176,0,0.02)');
      glow.addColorStop(1, 'rgba(0,0,0,0.25)');
      ctx.fillStyle = glow;
      ctx.fillRect(0, 0, W, H);

      // ── Switch flash overlay ──
      if (switchFlash > 0.01) {
        ctx.fillStyle = `rgba(255,240,200,${switchFlash * 0.6})`;
        ctx.fillRect(0, 0, W, H);
      }

      // ── Minimap ──
      const ms = 6;
      const mapPx = MAP_SIZE * ms;
      const mx = W - mapPx - 14;
      const my = 14;

      ctx.globalAlpha = 0.7;
      ctx.fillStyle = '#000';
      ctx.fillRect(mx - 4, my - 4, mapPx + 8, mapPx + 8);
      ctx.strokeStyle = 'rgba(255,176,0,0.5)';
      ctx.lineWidth = 1;
      ctx.strokeRect(mx - 4, my - 4, mapPx + 8, mapPx + 8);

      for (let y = 0; y < MAP_SIZE; y++) {
        for (let x = 0; x < MAP_SIZE; x++) {
          const v = map[y][x];
          if (v === CELL_EMPTY) {
            ctx.fillStyle = '#1a0e00';
          } else if (v === CELL_GOAL) {
            // Pulsing gold for goal
            const pulse = 0.6 + 0.4 * Math.sin(Date.now() / 400);
            ctx.fillStyle = `rgba(255,220,80,${pulse})`;
          } else if (v === CELL_SWITCH) {
            ctx.fillStyle = '#aa8800';
          } else if (v >= 2 && v <= 6) {
            ctx.fillStyle = '#5a3a00';
          } else {
            ctx.fillStyle = '#3a2200';
          }
          ctx.fillRect(mx + x * ms, my + y * ms, ms, ms);
        }
      }

      // Player dot + direction
      ctx.globalAlpha = 1;
      ctx.fillStyle = '#ffcc00';
      ctx.beginPath();
      ctx.arc(mx + posX * ms, my + posY * ms, 3, 0, Math.PI * 2);
      ctx.fill();

      ctx.strokeStyle = '#ffcc00';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(mx + posX * ms, my + posY * ms);
      ctx.lineTo(mx + (posX + dirX * 2.5) * ms, my + (posY + dirY * 2.5) * ms);
      ctx.stroke();

      // FOV cone
      ctx.globalAlpha = 0.12;
      ctx.fillStyle = '#ffb000';
      ctx.beginPath();
      ctx.moveTo(mx + posX * ms, my + posY * ms);
      ctx.lineTo(mx + (posX + (dirX + planeX) * 4) * ms, my + (posY + (dirY + planeY) * 4) * ms);
      ctx.lineTo(mx + (posX + (dirX - planeX) * 4) * ms, my + (posY + (dirY - planeY) * 4) * ms);
      ctx.fill();
      ctx.globalAlpha = 1;

      // ── HUD ──
      ctx.font = '11px monospace';
      ctx.fillStyle = 'rgba(255,176,0,0.5)';

      const angle = Math.atan2(dirY, dirX) * 180 / Math.PI;
      let compass = 'E';
      if (angle > 45 && angle <= 135) compass = 'S';
      else if (angle > 135 || angle <= -135) compass = 'W';
      else if (angle > -135 && angle <= -45) compass = 'N';

      ctx.fillText(`SECTOR ${Math.floor(posX)}-${Math.floor(posY)}`, 10, 18);
      ctx.fillText(`BEARING: ${compass}  ${((angle + 360) % 360).toFixed(0)}\u00B0`, 10, 32);

      if (!lightsOn) {
        ctx.fillStyle = 'rgba(255,200,50,0.4)';
        ctx.fillText('FIND THE LIGHT SWITCH', 10, 48);
      }

      ctx.fillStyle = 'rgba(255,176,0,0.4)';
      ctx.fillText('GALLERY OF ILLUSIONS', 10, H - 16);

      // Crosshair
      ctx.strokeStyle = `rgba(255,176,0,${lightsOn ? 0.2 : 0.1})`;
      ctx.lineWidth = 1;
      const cxH = W / 2, cyH = H / 2;
      ctx.beginPath();
      ctx.moveTo(cxH - 8, cyH); ctx.lineTo(cxH - 3, cyH);
      ctx.moveTo(cxH + 3, cyH); ctx.lineTo(cxH + 8, cyH);
      ctx.moveTo(cxH, cyH - 8); ctx.lineTo(cxH, cyH - 3);
      ctx.moveTo(cxH, cyH + 3); ctx.lineTo(cxH, cyH + 8);
      ctx.stroke();

      // ── Victory overlay ──
      if (victory) {
        const fade = Math.min(1, victoryTimer / 90);
        ctx.fillStyle = `rgba(0,0,0,${fade * 0.7})`;
        ctx.fillRect(0, 0, W, H);

        ctx.globalAlpha = fade;
        ctx.textAlign = 'center';

        ctx.font = 'bold 28px monospace';
        ctx.fillStyle = '#ffcc00';
        ctx.shadowColor = '#ffaa00';
        ctx.shadowBlur = 20;
        ctx.fillText('YOU FOUND IT', W / 2, H / 2 - 40);

        ctx.font = '14px monospace';
        ctx.fillStyle = '#ffdd88';
        ctx.shadowBlur = 10;
        ctx.fillText('THE GALLERY OF ILLUSIONS REVEALS ITS FINAL SECRET', W / 2, H / 2 + 10);

        ctx.font = '12px monospace';
        ctx.fillStyle = 'rgba(255,176,0,0.6)';
        ctx.shadowBlur = 0;
        ctx.fillText('"NOT ALL WHO WANDER ARE LOST... BUT YOU WERE."', W / 2, H / 2 + 50);

        if (victoryTimer > 120) {
          const blink = Math.sin(Date.now() / 500) > 0 ? 0.7 : 0.3;
          ctx.fillStyle = `rgba(255,220,100,${blink})`;
          ctx.fillText('[ ESC TO EXIT ]', W / 2, H / 2 + 90);
        }

        ctx.textAlign = 'start';
        ctx.globalAlpha = 1;
        ctx.shadowBlur = 0;
      }
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
      document.removeEventListener('mousemove', onMouseMove);
      canvas.removeEventListener('click', onClick);
      try { if (document.pointerLockElement === canvas) document.exitPointerLock(); } catch (_) {}
    };
  }, [exitGameMode]);

  return (
    <div ref={containerRef} className="labyrinth-container" tabIndex={0}>
      <canvas
        ref={canvasRef}
        style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}
      />
      <div className="labyrinth-hint">WASD move &middot; mouse look (click to capture) &middot; &larr;&rarr; turn &middot; ESC exit</div>
    </div>
  );
}
