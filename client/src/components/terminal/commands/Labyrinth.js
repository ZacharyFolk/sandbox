import { useEffect, useRef, useContext } from 'react';
import { TerminalContext } from '../../../context/TerminalContext';

// ── Cell Types ───────────────────────────────────────────────
const CELL_EMPTY = 0;
const CELL_WALL = 1;
const CELL_SWITCH = 8;
const CELL_GOAL = 9;
const CELL_CAFE = 10;
const CELL_SNAKES = 11;
const CELL_HERMANN = 12;
const CELL_MOIRE = 13;
const CELL_FRASER = 14;
const CELL_SCINTILLATE = 15;
const CELL_ZOLLNER = 16;
const CELL_PLAQUE = 20;
const CELL_LOBBY = 21;

const ILLUSION_CELLS = [CELL_CAFE, CELL_SNAKES, CELL_HERMANN, CELL_MOIRE, CELL_FRASER, CELL_SCINTILLATE, CELL_ZOLLNER];
const MAP_SIZE = 32;
const TEX_SIZE = 64;

// ── Illusion Info (for plaques) ──────────────────────────────
const ILLUSION_INFO = {
  [CELL_CAFE]: {
    name: 'THE CAFÉ WALL ILLUSION',
    description: 'Alternating rows of dark and light tiles with staggered offsets create the appearance of wedge-shaped distortion. The mortar lines between rows appear to converge and diverge — yet they are perfectly parallel.',
    credit: 'Richard Gregory, 1979 — Bristol, England'
  },
  [CELL_SNAKES]: {
    name: 'ROTATING SNAKES',
    description: 'Concentric rings of asymmetric color gradients trigger peripheral drift. Your visual system interprets the luminance transitions as motion. The image is completely static — the movement exists only in your mind.',
    credit: 'Akiyoshi Kitaoka, 2003'
  },
  [CELL_HERMANN]: {
    name: 'THE HERMANN GRID',
    description: 'Phantom gray spots appear at the intersections of the white grid lines — but vanish when you look directly at them. Lateral inhibition in your retinal ganglion cells creates this ghostly effect.',
    credit: 'Ludimar Hermann, 1870'
  },
  [CELL_MOIRE]: {
    name: 'MOIRÉ INTERFERENCE',
    description: 'Two overlapping patterns of parallel lines create wave-like interference fringes that appear to ripple and flow. The effect emerges from the mathematical interaction between the two grids.',
    credit: 'First documented in silk weaving, 17th century'
  },
  [CELL_FRASER]: {
    name: 'THE FRASER SPIRAL',
    description: 'What appears to be a spiral is actually a series of concentric circles. Twisted cord segments on each ring create a false sense of convergence, tricking the brain into perceiving a spiral that does not exist.',
    credit: 'James Fraser, 1908'
  },
  [CELL_SCINTILLATE]: {
    name: 'THE SCINTILLATING GRID',
    description: 'White dots at the intersections of a gray grid appear to flicker and vanish in your peripheral vision. Stare at one dot — it remains. But its neighbors shimmer and disappear. Your brain fills in what it expects to see.',
    credit: 'Elke Lingelbach, 1994'
  },
  [CELL_ZOLLNER]: {
    name: 'THE ZÖLLNER ILLUSION',
    description: 'Long parallel lines crossed by short diagonal hatching appear to tilt and converge. The angles of the hatching lines influence how your brain perceives the orientation of the main lines.',
    credit: 'Johann Karl Friedrich Zöllner, 1860'
  },
};

// ── Minimap Colors ───────────────────────────────────────────
const MINIMAP_COLORS = {
  [CELL_CAFE]: '#ff6666',
  [CELL_SNAKES]: '#66ff66',
  [CELL_HERMANN]: '#6688ff',
  [CELL_MOIRE]: '#ffff66',
  [CELL_FRASER]: '#ff66ff',
  [CELL_SCINTILLATE]: '#66ffff',
  [CELL_ZOLLNER]: '#ffaa66',
  [CELL_PLAQUE]: '#ddbb44',
  [CELL_LOBBY]: '#886622',
};

// ── Maze Generation ──────────────────────────────────────────
function generateMaze() {
  const map = Array.from({ length: MAP_SIZE }, () => Array(MAP_SIZE).fill(CELL_WALL));

  // Room data: { x, y, w, h, cellType, plaqueDir }
  const rooms = [];

  // Place lobby near center
  const lobbyW = 7, lobbyH = 7;
  const lobbyX = Math.floor(MAP_SIZE / 2 - lobbyW / 2);
  const lobbyY = Math.floor(MAP_SIZE / 2 - lobbyH / 2);
  carveRoom(map, lobbyX, lobbyY, lobbyW, lobbyH, CELL_LOBBY);
  rooms.push({ x: lobbyX, y: lobbyY, w: lobbyW, h: lobbyH, cellType: CELL_LOBBY });

  // Place 7 illusion rooms
  const shuffled = [...ILLUSION_CELLS].sort(() => Math.random() - 0.5);
  for (let i = 0; i < 7; i++) {
    let placed = false;
    for (let attempt = 0; attempt < 200 && !placed; attempt++) {
      const rw = 5, rh = 5;
      const rx = 2 + Math.floor(Math.random() * (MAP_SIZE - rw - 4));
      const ry = 2 + Math.floor(Math.random() * (MAP_SIZE - rh - 4));

      // Check no overlap with existing rooms (2-cell gap)
      let ok = true;
      for (const r of rooms) {
        if (rx - 2 < r.x + r.w && rx + rw + 2 > r.x &&
            ry - 2 < r.y + r.h && ry + rh + 2 > r.y) {
          ok = false; break;
        }
      }
      if (ok) {
        carveRoom(map, rx, ry, rw, rh, shuffled[i]);
        rooms.push({ x: rx, y: ry, w: rw, h: rh, cellType: shuffled[i] });
        placed = true;
      }
    }
  }

  // Connect rooms with L-shaped corridors
  for (let i = 1; i < rooms.length; i++) {
    const a = rooms[i - 1], b = rooms[i];
    const ax = Math.floor(a.x + a.w / 2), ay = Math.floor(a.y + a.h / 2);
    const bx = Math.floor(b.x + b.w / 2), by = Math.floor(b.y + b.h / 2);
    carveCorridor(map, ax, ay, bx, by);
  }
  // Connect last room back to lobby for a loop
  const last = rooms[rooms.length - 1];
  const lx = Math.floor(last.x + last.w / 2), ly = Math.floor(last.y + last.h / 2);
  const lbx = Math.floor(lobbyX + lobbyW / 2), lby = Math.floor(lobbyY + lobbyH / 2);
  carveCorridor(map, lx, ly, lbx, lby);

  // Place plaques — try all 4 walls, pick the first available (not carved by corridor)
  for (const r of rooms) {
    if (r.cellType === CELL_LOBBY) continue;
    const cx = Math.floor(r.x + r.w / 2);
    const cy = Math.floor(r.y + r.h / 2);
    const candidates = [
      [cx, r.y - 1],          // north
      [cx, r.y + r.h],        // south
      [r.x - 1, cy],          // west
      [r.x + r.w, cy],        // east
    ];
    for (const [px, py] of candidates) {
      if (px >= 0 && px < MAP_SIZE && py >= 0 && py < MAP_SIZE && isWall(map[py][px])) {
        map[py][px] = CELL_PLAQUE;
        break;
      }
    }
  }

  // BFS from lobby center to find farthest room for goal
  const startX = Math.floor(lobbyX + lobbyW / 2);
  const startY = Math.floor(lobbyY + lobbyH / 2);
  const dist = bfs(map, startX, startY);

  // Find the farthest illusion room center
  let maxDist = 0, goalRoom = rooms[1];
  for (const r of rooms) {
    if (r.cellType === CELL_LOBBY) continue;
    const cx = Math.floor(r.x + r.w / 2);
    const cy = Math.floor(r.y + r.h / 2);
    if (dist[cy][cx] > maxDist) {
      maxDist = dist[cy][cx];
      goalRoom = r;
    }
  }

  // Place goal in the farthest room
  const gx = Math.floor(goalRoom.x + goalRoom.w / 2);
  const gy = Math.floor(goalRoom.y + goalRoom.h / 2);

  // Place light switch at ~30% of max distance in a corridor
  const switchTarget = Math.floor(maxDist * 0.3);
  let bestSwitch = null, bestDiff = Infinity;
  for (let y = 0; y < MAP_SIZE; y++) {
    for (let x = 0; x < MAP_SIZE; x++) {
      if (map[y][x] !== CELL_EMPTY) continue;
      // Only corridors (not inside rooms)
      let inRoom = false;
      for (const r of rooms) {
        if (x >= r.x && x < r.x + r.w && y >= r.y && y < r.y + r.h) {
          inRoom = true; break;
        }
      }
      if (inRoom) continue;
      const d = Math.abs(dist[y][x] - switchTarget);
      if (d < bestDiff && dist[y][x] > 0) { bestDiff = d; bestSwitch = [x, y]; }
    }
  }
  if (bestSwitch) map[bestSwitch[1]][bestSwitch[0]] = CELL_SWITCH;

  return { map, rooms, startX, startY, goalX: gx, goalY: gy };
}

function carveRoom(map, rx, ry, rw, rh, wallType) {
  // Carve interior
  for (let y = ry; y < ry + rh; y++) {
    for (let x = rx; x < rx + rw; x++) {
      if (x > 0 && x < MAP_SIZE - 1 && y > 0 && y < MAP_SIZE - 1) {
        map[y][x] = CELL_EMPTY;
      }
    }
  }
  // Mark surrounding walls with room type
  for (let x = rx - 1; x <= rx + rw; x++) {
    if (x >= 0 && x < MAP_SIZE) {
      if (ry - 1 >= 0 && map[ry - 1][x] === CELL_WALL) map[ry - 1][x] = wallType;
      if (ry + rh < MAP_SIZE && map[ry + rh][x] === CELL_WALL) map[ry + rh][x] = wallType;
    }
  }
  for (let y = ry - 1; y <= ry + rh; y++) {
    if (y >= 0 && y < MAP_SIZE) {
      if (rx - 1 >= 0 && map[y][rx - 1] === CELL_WALL) map[y][rx - 1] = wallType;
      if (rx + rw < MAP_SIZE && map[y][rx + rw] === CELL_WALL) map[y][rx + rw] = wallType;
    }
  }
}

function carveCorridor(map, x1, y1, x2, y2) {
  // L-shaped: horizontal then vertical
  // Carve through any solid cell (walls, room walls, lobby walls) to create doorways
  const dx = x2 > x1 ? 1 : -1;
  for (let x = x1; x !== x2; x += dx) {
    if (x > 0 && x < MAP_SIZE - 1 && y1 > 0 && y1 < MAP_SIZE - 1) {
      const v = map[y1][x];
      if (v !== CELL_EMPTY && v !== CELL_SWITCH && v !== CELL_GOAL) map[y1][x] = CELL_EMPTY;
    }
  }
  const dy = y2 > y1 ? 1 : -1;
  for (let y = y1; y !== y2 + dy; y += dy) {
    if (x2 > 0 && x2 < MAP_SIZE - 1 && y > 0 && y < MAP_SIZE - 1) {
      const v = map[y][x2];
      if (v !== CELL_EMPTY && v !== CELL_SWITCH && v !== CELL_GOAL) map[y][x2] = CELL_EMPTY;
    }
  }
}

function bfs(map, sx, sy) {
  const dist = Array.from({ length: MAP_SIZE }, () => Array(MAP_SIZE).fill(-1));
  const queue = [[sx, sy]];
  dist[sy][sx] = 0;
  let head = 0;
  while (head < queue.length) {
    const [cx, cy] = queue[head++];
    for (const [dx, dy] of [[0,1],[0,-1],[1,0],[-1,0]]) {
      const nx = cx + dx, ny = cy + dy;
      if (nx >= 0 && nx < MAP_SIZE && ny >= 0 && ny < MAP_SIZE && dist[ny][nx] === -1 && isOpen(map, nx, ny)) {
        dist[ny][nx] = dist[cy][cx] + 1;
        queue.push([nx, ny]);
      }
    }
  }
  return dist;
}

// ── Is a cell walkable? ──────────────────────────────────────
function isOpen(map, x, y) {
  if (x < 0 || x >= MAP_SIZE || y < 0 || y >= MAP_SIZE) return false;
  const v = map[y][x];
  return v === CELL_EMPTY || v === CELL_SWITCH || v === CELL_GOAL;
}

// ── Is a cell a wall (stops rays)? ───────────────────────────
function isWall(v) {
  return v === CELL_WALL || v === CELL_PLAQUE || v === CELL_LOBBY ||
    (v >= CELL_CAFE && v <= CELL_ZOLLNER);
}

// ── Illusion Renderers ───────────────────────────────────────
// Each: (u, v, t) => [r, g, b] where u,v in [0,1], t in seconds

function illusionCafe(u, v, t) {
  const rows = 8;
  const row = Math.floor(v * rows);
  const offset = (row % 2) * 0.5 * (1 / 8) + Math.sin(t * 0.4) * 0.02;
  const tileW = 1 / 8;
  const tile = Math.floor((u + offset) / tileW) % 2;
  // Mortar lines
  const mortar = Math.abs(v * rows - Math.round(v * rows));
  if (mortar < 0.04) return [140, 140, 140];
  return tile ? [35, 35, 35] : [220, 220, 220];
}

function illusionSnakes(u, v, t) {
  const cx = u - 0.5, cy = v - 0.5;
  const dist = Math.sqrt(cx * cx + cy * cy);
  const angle = Math.atan2(cy, cx) + t * 1.5;
  const ring = Math.floor(dist * 10);
  const seg = ((angle + ring * 0.8) % (Math.PI * 2) + Math.PI * 2) % (Math.PI * 2);
  const phase = seg / (Math.PI * 2);
  // 4-color cycle per segment creating asymmetric luminance
  if (phase < 0.25) return [20, 20, 20];       // black
  if (phase < 0.5) return [0, 120, 60];         // dark green
  if (phase < 0.75) return [240, 240, 240];     // white
  return [140, 220, 140];                        // light green
}

function illusionHermann(u, v, t) {
  const gridSize = 0.2;
  const gap = 0.04 + Math.sin(t * 2) * 0.005;
  const inSquare = (u % gridSize > gap) && (v % gridSize > gap);
  if (inSquare) return [220, 220, 220];
  return [100, 100, 100];
}

function illusionMoire(u, v, t) {
  const angle = t * 0.3;
  const p1 = Math.sin(u * 50) > 0 ? 1 : 0;
  const u2 = u * Math.cos(angle) + v * Math.sin(angle);
  const p2 = Math.sin(u2 * 50) > 0 ? 1 : 0;
  const combined = p1 + p2;
  if (combined === 0) return [20, 20, 20];
  if (combined === 1) return [120, 120, 120];
  return [235, 235, 235];
}

function illusionFraser(u, v, t) {
  const cx = u - 0.5, cy = v - 0.5;
  const dist = Math.sqrt(cx * cx + cy * cy);
  const angle = Math.atan2(cy, cx);
  const track = Math.sin(dist * 35);
  const cordAngle = angle + dist * 10 + t * 0.5;
  const seg = Math.sin(cordAngle * 6);
  if (Math.abs(track) < 0.3) {
    return seg > 0 ? [200, 170, 40] : [40, 40, 130];
  }
  return [55, 55, 55];
}

function illusionScintillate(u, v, t) {
  const gridSize = 0.2;
  const gap = 0.05;
  const inSquare = (u % gridSize > gap) && (v % gridSize > gap);
  if (inSquare) return [40, 40, 40]; // dark squares

  // Check proximity to nearest intersection
  const nearU = Math.round(u / gridSize) * gridSize;
  const nearV = Math.round(v / gridSize) * gridSize;
  const du = u - nearU, dv = v - nearV;
  const distSq = du * du + dv * dv;
  const dotR = 0.012 + Math.sin(t * 3) * 0.003;
  if (distSq < dotR * dotR) return [255, 255, 255]; // white dots

  return [150, 150, 150]; // gray grid lines
}

function illusionZollner(u, v, t) {
  const numLines = 8;
  const lineW = 0.012;
  const bg = [225, 218, 195]; // cream

  for (let i = 0; i < numLines; i++) {
    const lineY = (i + 0.5) / numLines;
    const distToLine = Math.abs(v - lineY);
    if (distToLine < lineW) return [25, 25, 25]; // main line

    // Diagonal hatching
    const hatchAngle = (i % 2 === 0 ? 0.35 : -0.35) + Math.sin(t * 0.4) * 0.05;
    const hatchV = v - lineY;
    if (Math.abs(hatchV) < 0.04) {
      const hatchPhase = (u * 30 + hatchV / hatchAngle) % 1;
      if (Math.abs(hatchPhase - 0.5) > 0.35) return [25, 25, 25];
    }
  }
  return bg;
}

const ILLUSION_RENDERERS = {
  [CELL_CAFE]: illusionCafe,
  [CELL_SNAKES]: illusionSnakes,
  [CELL_HERMANN]: illusionHermann,
  [CELL_MOIRE]: illusionMoire,
  [CELL_FRASER]: illusionFraser,
  [CELL_SCINTILLATE]: illusionScintillate,
  [CELL_ZOLLNER]: illusionZollner,
};

// ── Texture System ───────────────────────────────────────────
// Persistent offscreen canvases per illusion
const illusionCanvases = {};
function getIllusionCanvas(cellType) {
  if (!illusionCanvases[cellType]) {
    const c = document.createElement('canvas');
    c.width = TEX_SIZE; c.height = TEX_SIZE;
    illusionCanvases[cellType] = { canvas: c, ctx: c.getContext('2d') };
  }
  return illusionCanvases[cellType];
}

function updateIllusionTexture(cellType, time) {
  const { canvas, ctx } = getIllusionCanvas(cellType);
  const renderer = ILLUSION_RENDERERS[cellType];
  if (!renderer) return canvas;

  const img = ctx.createImageData(TEX_SIZE, TEX_SIZE);
  const d = img.data;
  for (let py = 0; py < TEX_SIZE; py++) {
    for (let px = 0; px < TEX_SIZE; px++) {
      const u = px / TEX_SIZE, v = py / TEX_SIZE;
      const idx = (py * TEX_SIZE + px) * 4;
      const [r, g, b] = renderer(u, v, time);
      d[idx] = r; d[idx + 1] = g; d[idx + 2] = b; d[idx + 3] = 255;
    }
  }
  ctx.putImageData(img, 0, 0);
  return canvas;
}

// Static textures (lobby walls, plaque)
let STATIC_TEXTURES = null;
function getStaticTextures() {
  if (!STATIC_TEXTURES) {
    STATIC_TEXTURES = {};
    // Lobby: subtle brick pattern
    const lobbyC = document.createElement('canvas');
    lobbyC.width = TEX_SIZE; lobbyC.height = TEX_SIZE;
    const lctx = lobbyC.getContext('2d');
    const limg = lctx.createImageData(TEX_SIZE, TEX_SIZE);
    const ld = limg.data;
    for (let py = 0; py < TEX_SIZE; py++) {
      for (let px = 0; px < TEX_SIZE; px++) {
        const idx = (py * TEX_SIZE + px) * 4;
        const row = Math.floor(py / 8);
        const offset = (row % 2) * 4;
        const brick = ((px + offset) % 16 < 1) || (py % 8 < 1);
        const base = brick ? 60 : 90;
        ld[idx] = base; ld[idx + 1] = Math.floor(base * 0.6); ld[idx + 2] = 0; ld[idx + 3] = 255;
      }
    }
    lctx.putImageData(limg, 0, 0);
    STATIC_TEXTURES[CELL_LOBBY] = lobbyC;

    // Plaque: brass plate with engraved text lines and eye symbol
    const plaqueC = document.createElement('canvas');
    plaqueC.width = TEX_SIZE; plaqueC.height = TEX_SIZE;
    const pctx = plaqueC.getContext('2d');
    const pimg = pctx.createImageData(TEX_SIZE, TEX_SIZE);
    const pd = pimg.data;
    for (let py = 0; py < TEX_SIZE; py++) {
      for (let px = 0; px < TEX_SIZE; px++) {
        const idx = (py * TEX_SIZE + px) * 4;
        const u = px / TEX_SIZE, v = py / TEX_SIZE;

        // Wall background (dark amber)
        let r = 80, g = 55, b = 0;

        // Plaque area (centered rectangle, ~60% of wall)
        const inPlaque = u > 0.18 && u < 0.82 && v > 0.15 && v < 0.85;
        const border1 = u > 0.16 && u < 0.84 && v > 0.13 && v < 0.87;
        const border2 = u > 0.17 && u < 0.83 && v > 0.14 && v < 0.86;

        if (!border1) {
          // Wall around plaque
          r = 80; g = 55; b = 0;
        } else if (!border2) {
          // Outer beveled edge (dark)
          r = 90; g = 70; b = 10;
        } else if (!inPlaque) {
          // Inner beveled edge (bright highlight)
          r = 220; g = 185; b = 60;
        } else {
          // Plaque face — brushed brass
          const grain = ((px * 7 + py * 3) % 5) < 1 ? -8 : 0;
          r = 175 + grain; g = 145 + grain; b = 35;

          // Eye symbol at top (simple oval + dot)
          const eyeCx = 0.5, eyeCy = 0.28;
          const edx = (u - eyeCx) * 2.5, edy = (v - eyeCy) * 6;
          const eyeDist = edx * edx + edy * edy;
          if (eyeDist < 0.12 && eyeDist > 0.06) {
            r = 60; g = 45; b = 10; // eye outline
          } else if (edx * edx + (v - eyeCy) * (v - eyeCy) * 16 < 0.02) {
            r = 40; g = 30; b = 5; // pupil
          }

          // Title line (thick bar suggesting text)
          if (v > 0.38 && v < 0.42 && u > 0.28 && u < 0.72) {
            r = 120; g = 95; b = 20;
          }

          // Divider line
          if (v > 0.46 && v < 0.47 && u > 0.25 && u < 0.75) {
            r = 140; g = 110; b = 25;
          }

          // Text lines (thin bars)
          const textLines = [0.53, 0.58, 0.63, 0.68, 0.73];
          const textWidths = [0.38, 0.42, 0.40, 0.36, 0.28];
          for (let li = 0; li < textLines.length; li++) {
            const ly = textLines[li];
            const lw = textWidths[li];
            if (v > ly && v < ly + 0.025 && u > 0.5 - lw / 2 && u < 0.5 + lw / 2) {
              r = 135; g = 108; b = 22;
            }
          }
        }

        pd[idx] = r; pd[idx + 1] = g; pd[idx + 2] = b; pd[idx + 3] = 255;
      }
    }
    pctx.putImageData(pimg, 0, 0);
    STATIC_TEXTURES[CELL_PLAQUE] = plaqueC;
  }
  return STATIC_TEXTURES;
}

// ── Component ────────────────────────────────────────────────
export default function Labyrinth() {
  const { enterGameMode, exitGameMode } = useContext(TerminalContext);
  const containerRef = useRef(null);
  const canvasRef = useRef(null);
  const plaqueRef = useRef(null);

  useEffect(() => {
    enterGameMode();
    return () => exitGameMode();
  }, []);

  useEffect(() => {
    const container = containerRef.current;
    const canvas = canvasRef.current;
    const plaqueEl = plaqueRef.current;
    if (!container || !canvas || !plaqueEl) return;

    const ctx = canvas.getContext('2d');
    const W = container.offsetWidth;
    const H = container.offsetHeight;
    canvas.width = W;
    canvas.height = H;

    const { map, rooms, startX, startY, goalX, goalY } = generateMaze();
    const staticTex = getStaticTextures();

    // Player state
    let posX = startX + 0.5, posY = startY + 0.5;
    let dirX = 1, dirY = 0;
    let planeX = 0, planeY = 0.66;

    // Lighting
    let lightsOn = false;
    let lightLevel = 0;
    let switchFlash = 0;

    // Progression
    let victory = false;
    let victoryTimer = 0;
    const visitedRooms = new Set();
    let goalUnlocked = false;
    let currentRoomType = null;

    const keys = {};
    let exited = false;

    const doExit = () => {
      if (exited) return;
      exited = true;
      try { if (document.pointerLockElement === canvas) document.exitPointerLock(); } catch (_) {}
      exitGameMode();
    };

    const onKeyDown = (e) => {
      if (e.key === 'Escape') { doExit(); return; }
      keys[e.key] = true;
      e.preventDefault();
    };
    const onKeyUp = (e) => { keys[e.key] = false; };
    container.addEventListener('keydown', onKeyDown);
    container.addEventListener('keyup', onKeyUp);
    container.focus();

    // Mouse look
    const MOUSE_SENSITIVITY = 0.003;
    const onMouseMove = (e) => {
      if (document.pointerLockElement !== canvas) return;
      rotate(e.movementX * MOUSE_SENSITIVITY);
    };
    const onClick = () => {
      if (exited) return;
      try { if (document.pointerLockElement !== canvas) canvas.requestPointerLock(); } catch (_) {}
    };
    // When browser releases pointer lock (ESC), exit game too
    const onPointerLockChange = () => {
      if (document.pointerLockElement !== canvas && !exited) {
        doExit();
      }
    };
    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('pointerlockchange', onPointerLockChange);
    canvas.addEventListener('click', onClick);

    const MOVE_SPEED = 0.06;
    const ROT_SPEED = 0.045;
    const M = 0.1;

    const canMove = (x, y) =>
      isOpen(map, Math.floor(x - M), Math.floor(y - M)) &&
      isOpen(map, Math.floor(x + M), Math.floor(y - M)) &&
      isOpen(map, Math.floor(x - M), Math.floor(y + M)) &&
      isOpen(map, Math.floor(x + M), Math.floor(y + M));

    const move = (dx, dy) => {
      const nx = posX + dx * MOVE_SPEED;
      const ny = posY + dy * MOVE_SPEED;
      if (canMove(nx, ny)) { posX = nx; posY = ny; return; }
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

    // ── Detect which room player is in ──
    function detectRoom() {
      const px = Math.floor(posX), py = Math.floor(posY);
      for (const r of rooms) {
        if (px >= r.x && px < r.x + r.w && py >= r.y && py < r.y + r.h) {
          return r.cellType;
        }
      }
      return null;
    }

    // ── Update ───────────────────────────────────────────────
    const update = () => {
      if (victory) { victoryTimer++; return; }

      if (keys['w'] || keys['ArrowUp'])    move(dirX, dirY);
      if (keys['s'] || keys['ArrowDown'])  move(-dirX, -dirY);
      if (keys['a'])                       move(dirY, -dirX);
      if (keys['d'])                       move(-dirY, dirX);
      if (keys['ArrowLeft'])               rotate(ROT_SPEED);
      if (keys['ArrowRight'])              rotate(-ROT_SPEED);

      const cellX = Math.floor(posX), cellY = Math.floor(posY);

      // Light switch
      if (!lightsOn && map[cellY] && map[cellY][cellX] === CELL_SWITCH) {
        lightsOn = true;
        switchFlash = 1;
        map[cellY][cellX] = CELL_EMPTY;
      }

      // Room detection + visitation
      currentRoomType = detectRoom();
      if (currentRoomType && currentRoomType !== CELL_LOBBY && ILLUSION_CELLS.includes(currentRoomType)) {
        visitedRooms.add(currentRoomType);
      }

      // Unlock goal when all 7 visited
      if (!goalUnlocked && visitedRooms.size >= 7) {
        goalUnlocked = true;
        map[goalY][goalX] = CELL_GOAL;
      }

      // Victory check
      if (goalUnlocked && map[cellY] && map[cellY][cellX] === CELL_GOAL) {
        victory = true;
        victoryTimer = 0;
      }

      // Animate light
      if (lightsOn && lightLevel < 1) lightLevel = Math.min(1, lightLevel + 0.02);
      if (switchFlash > 0) switchFlash *= 0.92;
    };

    // ── Render ───────────────────────────────────────────────
    const render = () => {
      const time = performance.now() / 1000;
      const distMult = 0.25 + 1.2 * (1 - lightLevel);

      // Update active room's texture
      if (currentRoomType && ILLUSION_RENDERERS[currentRoomType]) {
        updateIllusionTexture(currentRoomType, time);
      }

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

      // Track center ray for plaque detection
      let plaqueHit = false;
      let plaqueType = null;

      // ── Raycast ──
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
        for (let i = 0; i < 50 && !hit; i++) {
          if (sdx < sdy) { sdx += ddx; mapX += stepX; side = 0; }
          else            { sdy += ddy; mapY += stepY; side = 1; }
          if (mapX >= 0 && mapX < MAP_SIZE && mapY >= 0 && mapY < MAP_SIZE) {
            const v = map[mapY][mapX];
            if (isWall(v)) hit = true;
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

        // Center ray plaque detection
        if (x === Math.floor(W / 2) && wallType === CELL_PLAQUE && perpDist < 2.0) {
          plaqueHit = true;
          // Find which room this plaque belongs to (check adjacency)
          for (const r of rooms) {
            if (r.cellType === CELL_LOBBY) continue;
            // Plaque is on the room's border — check if mapX,mapY is adjacent to room
            if (mapX >= r.x - 1 && mapX <= r.x + r.w &&
                mapY >= r.y - 1 && mapY <= r.y + r.h) {
              plaqueType = r.cellType;
              break;
            }
          }
        }

        // Determine texture
        let tex = null;
        if (wallType >= CELL_CAFE && wallType <= CELL_ZOLLNER) {
          const ic = getIllusionCanvas(wallType);
          tex = ic.canvas;
        } else if (wallType === CELL_PLAQUE && staticTex[CELL_PLAQUE]) {
          tex = staticTex[CELL_PLAQUE];
        } else if (wallType === CELL_LOBBY && staticTex[CELL_LOBBY]) {
          tex = staticTex[CELL_LOBBY];
        }

        if (tex) {
          let wallX_uv;
          if (side === 0) wallX_uv = posY + perpDist * rayDirY;
          else wallX_uv = posX + perpDist * rayDirX;
          wallX_uv -= Math.floor(wallX_uv);

          const srcX = Math.floor(wallX_uv * TEX_SIZE);
          ctx.drawImage(tex, srcX, 0, 1, TEX_SIZE, x, ds, 1, de - ds + 1);

          const darkness = 1 - b;
          if (darkness > 0.01) {
            ctx.fillStyle = `rgba(0,0,0,${darkness})`;
            ctx.fillRect(x, ds, 1, de - ds + 1);
          }
        } else {
          // Plain amber wall
          ctx.fillStyle = `rgb(${Math.floor(255 * b)},${Math.floor(176 * b)},0)`;
          ctx.fillRect(x, ds, 1, de - ds + 1);
        }
      }

      // ── Goal beacon ──
      if (goalUnlocked && !victory) {
        const gdx = (goalX + 0.5) - posX, gdy = (goalY + 0.5) - posY;
        const goalDist = Math.sqrt(gdx * gdx + gdy * gdy);
        if (goalDist < 15) {
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
      }

      // ── Switch glow ──
      for (let sy = 0; sy < MAP_SIZE; sy++) {
        for (let sx = 0; sx < MAP_SIZE; sx++) {
          if (map[sy][sx] !== CELL_SWITCH) continue;
          const sdx2 = (sx + 0.5) - posX, sdy2 = (sy + 0.5) - posY;
          const sDist = Math.sqrt(sdx2 * sdx2 + sdy2 * sdy2);
          if (sDist > 10) continue;
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

      // ── Switch flash ──
      if (switchFlash > 0.01) {
        ctx.fillStyle = `rgba(255,240,200,${switchFlash * 0.6})`;
        ctx.fillRect(0, 0, W, H);
      }

      // ── Plaque overlay ──
      if (plaqueHit && plaqueType && ILLUSION_INFO[plaqueType]) {
        const info = ILLUSION_INFO[plaqueType];
        plaqueEl.style.display = 'block';
        plaqueEl.querySelector('.plaque-title').textContent = info.name;
        plaqueEl.querySelector('.plaque-text').textContent = info.description;
        plaqueEl.querySelector('.plaque-credit').textContent = '— ' + info.credit;
      } else {
        plaqueEl.style.display = 'none';
      }

      // ── Minimap ──
      const ms = 3;
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
            const pulse = 0.6 + 0.4 * Math.sin(Date.now() / 400);
            ctx.fillStyle = `rgba(255,220,80,${pulse})`;
          } else if (v === CELL_SWITCH) {
            ctx.fillStyle = '#aa8800';
          } else if (MINIMAP_COLORS[v]) {
            ctx.fillStyle = MINIMAP_COLORS[v];
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
      ctx.arc(mx + posX * ms, my + posY * ms, 2.5, 0, Math.PI * 2);
      ctx.fill();

      ctx.strokeStyle = '#ffcc00';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(mx + posX * ms, my + posY * ms);
      ctx.lineTo(mx + (posX + dirX * 2) * ms, my + (posY + dirY * 2) * ms);
      ctx.stroke();

      // FOV cone
      ctx.globalAlpha = 0.12;
      ctx.fillStyle = '#ffb000';
      ctx.beginPath();
      ctx.moveTo(mx + posX * ms, my + posY * ms);
      ctx.lineTo(mx + (posX + (dirX + planeX) * 3) * ms, my + (posY + (dirY + planeY) * 3) * ms);
      ctx.lineTo(mx + (posX + (dirX - planeX) * 3) * ms, my + (posY + (dirY - planeY) * 3) * ms);
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

      // Current room name
      if (currentRoomType && ILLUSION_INFO[currentRoomType]) {
        ctx.fillStyle = 'rgba(255,220,100,0.6)';
        ctx.font = 'bold 12px monospace';
        ctx.fillText(ILLUSION_INFO[currentRoomType].name, 10, 50);
        ctx.font = '11px monospace';
      }

      // Light switch hint
      if (!lightsOn) {
        ctx.fillStyle = 'rgba(255,200,50,0.4)';
        ctx.fillText('FIND THE LIGHT SWITCH', 10, currentRoomType ? 66 : 48);
      }

      // Exhibit counter
      ctx.fillStyle = 'rgba(255,176,0,0.5)';
      ctx.fillText(`EXHIBITS: ${visitedRooms.size}/7`, 10, H - 32);

      if (!goalUnlocked && visitedRooms.size < 7) {
        ctx.fillStyle = 'rgba(255,176,0,0.3)';
        ctx.fillText('VISIT ALL EXHIBITS TO UNLOCK THE EXIT', 10, H - 48);
      } else if (goalUnlocked && !victory) {
        ctx.fillStyle = 'rgba(255,220,100,0.5)';
        ctx.fillText('EXIT UNLOCKED — FIND THE GOLDEN BEACON', 10, H - 48);
      }

      ctx.fillStyle = 'rgba(255,176,0,0.4)';
      ctx.fillText('OPTICAL ILLUSION MUSEUM', 10, H - 16);

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
        ctx.fillText('MUSEUM TOUR COMPLETE', W / 2, H / 2 - 50);

        ctx.font = '14px monospace';
        ctx.fillStyle = '#ffdd88';
        ctx.shadowBlur = 10;
        ctx.fillText('YOU HAVE WITNESSED ALL SEVEN', W / 2, H / 2);
        ctx.fillText('WONDERS OF PERCEPTION', W / 2, H / 2 + 20);

        ctx.font = '12px monospace';
        ctx.fillStyle = 'rgba(255,176,0,0.6)';
        ctx.shadowBlur = 0;
        ctx.fillText('"THE MIND SEES WHAT IT WANTS TO SEE"', W / 2, H / 2 + 60);

        if (victoryTimer > 120) {
          const blink = Math.sin(Date.now() / 500) > 0 ? 0.7 : 0.3;
          ctx.fillStyle = `rgba(255,220,100,${blink})`;
          ctx.fillText('[ ESC TO EXIT ]', W / 2, H / 2 + 100);
        }

        ctx.textAlign = 'start';
        ctx.globalAlpha = 1;
        ctx.shadowBlur = 0;
      }
    };

    // ── Main loop ──
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
      document.removeEventListener('pointerlockchange', onPointerLockChange);
      canvas.removeEventListener('click', onClick);
      try { if (document.pointerLockElement === canvas) document.exitPointerLock(); } catch (_) {}
      if (plaqueEl) plaqueEl.style.display = 'none';
    };
  }, [exitGameMode]);

  return (
    <div ref={containerRef} className="labyrinth-container" tabIndex={0}>
      <canvas
        ref={canvasRef}
        style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}
      />
      <div ref={plaqueRef} className="illusion-plaque" style={{ display: 'none' }}>
        <div className="plaque-title"></div>
        <div className="plaque-text"></div>
        <div className="plaque-credit"></div>
      </div>
      <div className="labyrinth-hint">WASD move &middot; mouse look (click to capture) &middot; &larr;&rarr; turn &middot; ESC exit</div>
    </div>
  );
}
