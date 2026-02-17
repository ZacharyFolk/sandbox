import { useEffect, useRef, useState, useContext, useCallback } from 'react';
import { TerminalContext } from '../../../context/TerminalContext';

// ── Constants ───────────────────────────────────────────────────
const MAP_W = 50;
const MAP_H = 20;
const FOV_R = 7;
const MAX_FLOOR = 7;

const ENEMY_DEFS = [
  { char: 'r', name: 'Rat',      hp: 4,  atk: 1, def: 0, xp: 3,   color: '#aa8844', min: 1, max: 3 },
  { char: 'g', name: 'Goblin',   hp: 7,  atk: 2, def: 0, xp: 5,   color: '#44cc44', min: 1, max: 4 },
  { char: 's', name: 'Skeleton', hp: 11, atk: 3, def: 1, xp: 8,   color: '#ccccaa', min: 2, max: 5 },
  { char: 'o', name: 'Orc',      hp: 16, atk: 4, def: 2, xp: 12,  color: '#cc4444', min: 3, max: 7 },
  { char: 'T', name: 'Troll',    hp: 22, atk: 6, def: 3, xp: 18,  color: '#8844cc', min: 5, max: 7 },
];
const DRAGON = { char: 'D', name: 'Dragon', hp: 50, atk: 8, def: 4, xp: 100, color: '#ff4422' };

const WEAPON_NAMES = ['Rusty Dagger','Short Sword','Broad Sword','War Axe','Flame Blade','Runic Blade'];
const ARMOR_NAMES  = ['Cloth Tunic','Leather Armor','Chain Mail','Plate Armor','Dragon Scale'];

// ── Dungeon Generation ──────────────────────────────────────────
function generateFloor(floor) {
  const map = Array.from({ length: MAP_H }, () => Array(MAP_W).fill('#'));
  const rooms = [];
  const numRooms = 5 + Math.min(floor, 4);

  for (let t = 0; t < 100 && rooms.length < numRooms; t++) {
    const w = 4 + Math.floor(Math.random() * 5);
    const h = 3 + Math.floor(Math.random() * 4);
    const x = 1 + Math.floor(Math.random() * (MAP_W - w - 2));
    const y = 1 + Math.floor(Math.random() * (MAP_H - h - 2));
    if (rooms.some(r => x < r.x+r.w+1 && x+w+1 > r.x && y < r.y+r.h+1 && y+h+1 > r.y)) continue;
    rooms.push({ x, y, w, h });
    for (let ry = y; ry < y + h; ry++)
      for (let rx = x; rx < x + w; rx++)
        map[ry][rx] = '.';
  }

  // Connect rooms with corridors
  for (let i = 1; i < rooms.length; i++) {
    const a = rooms[i-1], b = rooms[i];
    let cx = Math.floor(a.x + a.w/2), cy = Math.floor(a.y + a.h/2);
    const bx = Math.floor(b.x + b.w/2), by = Math.floor(b.y + b.h/2);
    if (Math.random() < 0.5) {
      while (cx !== bx) { map[cy][cx] = '.'; cx += cx < bx ? 1 : -1; }
      while (cy !== by) { map[cy][cx] = '.'; cy += cy < by ? 1 : -1; }
    } else {
      while (cy !== by) { map[cy][cx] = '.'; cy += cy < by ? 1 : -1; }
      while (cx !== bx) { map[cy][cx] = '.'; cx += cx < bx ? 1 : -1; }
    }
    map[by][bx] = '.';
  }

  const rc = r => ({ x: Math.floor(r.x + r.w/2), y: Math.floor(r.y + r.h/2) });
  const start = rc(rooms[0]);
  const stairsPos = rc(rooms[rooms.length - 1]);

  // Enemies
  const eligible = ENEMY_DEFS.filter(d => floor >= d.min && floor <= d.max);
  const enemies = [];
  const numE = 3 + floor;
  for (let i = 0; i < numE && rooms.length > 1; i++) {
    const room = rooms[1 + Math.floor(Math.random() * (rooms.length - 1))];
    const ex = room.x + 1 + Math.floor(Math.random() * Math.max(1, room.w - 2));
    const ey = room.y + 1 + Math.floor(Math.random() * Math.max(1, room.h - 2));
    if ((ex === stairsPos.x && ey === stairsPos.y) || enemies.some(e => e.x === ex && e.y === ey)) continue;
    const def = eligible[Math.floor(Math.random() * eligible.length)];
    enemies.push({ x: ex, y: ey, hp: def.hp, maxHp: def.hp, atk: def.atk, def: def.def, xp: def.xp, char: def.char, name: def.name, color: def.color, awake: false });
  }
  if (floor === MAX_FLOOR) {
    enemies.push({ x: stairsPos.x, y: stairsPos.y - 1, hp: DRAGON.hp, maxHp: DRAGON.hp, atk: DRAGON.atk, def: DRAGON.def, xp: DRAGON.xp, char: DRAGON.char, name: DRAGON.name, color: DRAGON.color, awake: false });
  }

  // Items
  const items = [];
  const placeItem = (item) => {
    const room = rooms[1 + Math.floor(Math.random() * (rooms.length - 1))];
    const ix = room.x + 1 + Math.floor(Math.random() * Math.max(1, room.w - 2));
    const iy = room.y + 1 + Math.floor(Math.random() * Math.max(1, room.h - 2));
    if (items.some(it => it.x === ix && it.y === iy) || enemies.some(e => e.x === ix && e.y === iy)) return;
    items.push({ ...item, x: ix, y: iy });
  };

  placeItem({ type: 'potion', char: '!', name: 'Health Potion', color: '#44aaff' });
  if (Math.random() < 0.6) placeItem({ type: 'potion', char: '!', name: 'Health Potion', color: '#44aaff' });
  if (Math.random() < 0.4 + floor * 0.05) placeItem({ type: 'weapon', char: '/', name: 'Weapon', color: '#ffaa44' });
  if (Math.random() < 0.3 + floor * 0.05) placeItem({ type: 'armor', char: '[', name: 'Armor', color: '#aaaacc' });
  for (let g = 0; g < 1 + Math.floor(Math.random() * 3); g++) {
    placeItem({ type: 'gold', char: '*', name: 'Gold', color: '#ffdd44', value: 5 + Math.floor(Math.random() * 11) });
  }

  return { map, rooms, enemies, items, stairs: stairsPos, playerStart: start };
}

// ── FOV ─────────────────────────────────────────────────────────
function computeFOV(map, px, py) {
  const vis = new Set();
  vis.add(`${px},${py}`);
  for (let i = 0; i < 72; i++) {
    const a = (i / 72) * Math.PI * 2;
    const dx = Math.cos(a), dy = Math.sin(a);
    for (let d = 1; d <= FOV_R; d++) {
      const tx = Math.round(px + dx * d), ty = Math.round(py + dy * d);
      if (tx < 0 || tx >= MAP_W || ty < 0 || ty >= MAP_H) break;
      vis.add(`${tx},${ty}`);
      if (map[ty][tx] === '#') break;
    }
  }
  return vis;
}

// ── Game Init ───────────────────────────────────────────────────
function initGame() {
  const { map, enemies, items, stairs, playerStart } = generateFloor(1);
  const explored = Array.from({ length: MAP_H }, () => Array(MAP_W).fill(false));
  const vis = computeFOV(map, playerStart.x, playerStart.y);
  vis.forEach(k => { const [x, y] = k.split(',').map(Number); explored[y][x] = true; });

  return {
    map, explored, visible: vis, enemies, items, stairs, floor: 1,
    player: { x: playerStart.x, y: playerStart.y, hp: 20, maxHp: 20, atk: 3, def: 1, lvl: 1, xp: 0, gold: 0, weaponLvl: 0, armorLvl: 0 },
    log: ['You descend into the dungeon. Find the stairs on each floor.', 'Slay the Dragon on Floor 7 to win!'],
    gameOver: false, won: false, killedBy: '',
  };
}

// ── Helpers ──────────────────────────────────────────────────────
function tryMoveEnemy(e, dx, dy, gs) {
  if (dx === 0 && dy === 0) return false;
  const nx = e.x + dx, ny = e.y + dy;
  if (nx < 0 || nx >= MAP_W || ny < 0 || ny >= MAP_H) return false;
  if (gs.map[ny][nx] === '#') return false;
  if (nx === gs.player.x && ny === gs.player.y) return false;
  if (gs.enemies.some(o => o !== e && o.hp > 0 && o.x === nx && o.y === ny)) return false;
  e.x = nx; e.y = ny;
  return true;
}

function processEnemyTurns(gs) {
  for (const e of gs.enemies) {
    if (e.hp <= 0) continue;
    const dist = Math.abs(e.x - gs.player.x) + Math.abs(e.y - gs.player.y);
    if (dist <= FOV_R + 2) e.awake = true;
    if (!e.awake) continue;

    if (dist === 1) {
      const dmg = Math.max(0, e.atk - gs.player.def + Math.floor(Math.random() * 2));
      gs.player.hp -= dmg;
      if (dmg > 0) gs.log.push(`${e.name} hits you for ${dmg}!`);
      else gs.log.push(`${e.name} attacks but misses!`);
      if (gs.player.hp <= 0) {
        gs.player.hp = 0;
        gs.gameOver = true;
        gs.killedBy = e.name;
        gs.log.push('You have been slain...');
      }
      continue;
    }

    const adx = Math.abs(gs.player.x - e.x), ady = Math.abs(gs.player.y - e.y);
    const sx = Math.sign(gs.player.x - e.x), sy = Math.sign(gs.player.y - e.y);
    if (adx >= ady) {
      tryMoveEnemy(e, sx, 0, gs) || tryMoveEnemy(e, 0, sy, gs);
    } else {
      tryMoveEnemy(e, 0, sy, gs) || tryMoveEnemy(e, sx, 0, gs);
    }
  }
}

function checkLevelUp(gs) {
  let needed = gs.player.lvl * 15;
  while (gs.player.xp >= needed) {
    gs.player.xp -= needed;
    gs.player.lvl++;
    gs.player.maxHp += 5;
    gs.player.hp = Math.min(gs.player.hp + 5, gs.player.maxHp);
    gs.player.atk++;
    if (gs.player.lvl % 2 === 0) gs.player.def++;
    gs.log.push(`LEVEL UP! You are now level ${gs.player.lvl}!`);
    needed = gs.player.lvl * 15;
  }
}

function processMove(gs, dx, dy) {
  const nx = gs.player.x + dx, ny = gs.player.y + dy;
  if (nx < 0 || nx >= MAP_W || ny < 0 || ny >= MAP_H || gs.map[ny][nx] === '#') return false;

  const enemy = gs.enemies.find(e => e.x === nx && e.y === ny && e.hp > 0);
  if (enemy) {
    const dmg = Math.max(1, gs.player.atk - enemy.def + Math.floor(Math.random() * 3));
    enemy.hp -= dmg;
    gs.log.push(`You hit ${enemy.name} for ${dmg}! ${enemy.hp > 0 ? `(${enemy.hp}/${enemy.maxHp})` : ''}`);
    if (enemy.hp <= 0) {
      gs.log.push(`${enemy.name} defeated! +${enemy.xp} XP`);
      gs.player.xp += enemy.xp;
      if (Math.random() < 0.2) {
        const g = 3 + Math.floor(Math.random() * 8);
        gs.player.gold += g;
        gs.log.push(`It dropped ${g} gold!`);
      }
      if (enemy.char === 'D') {
        gs.won = true;
        gs.log.push('THE DRAGON IS SLAIN! YOU ARE VICTORIOUS!');
      }
      checkLevelUp(gs);
    }
    return true;
  }

  gs.player.x = nx;
  gs.player.y = ny;

  // Pick up items
  const itemIdx = gs.items.findIndex(it => it.x === nx && it.y === ny);
  if (itemIdx >= 0) {
    const item = gs.items[itemIdx];
    gs.items.splice(itemIdx, 1);
    switch (item.type) {
      case 'potion': {
        const heal = 8 + Math.floor(Math.random() * 5);
        const actual = Math.min(heal, gs.player.maxHp - gs.player.hp);
        gs.player.hp += actual;
        gs.log.push(`Health Potion! +${actual} HP`);
        break;
      }
      case 'weapon':
        gs.player.atk++;
        gs.player.weaponLvl = Math.min(gs.player.weaponLvl + 1, WEAPON_NAMES.length - 1);
        gs.log.push(`Found ${WEAPON_NAMES[gs.player.weaponLvl]}! ATK +1`);
        break;
      case 'armor':
        gs.player.def++;
        gs.player.armorLvl = Math.min(gs.player.armorLvl + 1, ARMOR_NAMES.length - 1);
        gs.log.push(`Found ${ARMOR_NAMES[gs.player.armorLvl]}! DEF +1`);
        break;
      case 'gold':
        gs.player.gold += item.value;
        gs.log.push(`Picked up ${item.value} gold.`);
        break;
      default: break;
    }
  }
  return true;
}

function descendStairs(gs) {
  if (gs.player.x !== gs.stairs.x || gs.player.y !== gs.stairs.y) {
    gs.log.push('There are no stairs here.');
    return;
  }
  if (gs.floor >= MAX_FLOOR) {
    gs.log.push('This is the deepest floor.');
    return;
  }
  gs.floor++;
  const { map, enemies, items, stairs, playerStart } = generateFloor(gs.floor);
  gs.map = map;
  gs.enemies = enemies;
  gs.items = items;
  gs.stairs = stairs;
  gs.player.x = playerStart.x;
  gs.player.y = playerStart.y;
  gs.explored = Array.from({ length: MAP_H }, () => Array(MAP_W).fill(false));
  gs.visible = computeFOV(gs.map, gs.player.x, gs.player.y);
  gs.visible.forEach(k => { const [x, y] = k.split(',').map(Number); gs.explored[y][x] = true; });
  gs.log.push(`You descend to Floor ${gs.floor}...`);
  if (gs.floor === MAX_FLOOR) gs.log.push('A terrible roar echoes through the darkness...');
}

// ── Rendering ───────────────────────────────────────────────────
function getCell(gs, x, y) {
  const key = `${x},${y}`;
  const isVis = gs.visible.has(key);
  const isExp = gs.explored[y][x];
  if (!isExp) return { ch: ' ', fg: '#000' };

  if (isVis) {
    if (gs.player.x === x && gs.player.y === y) return { ch: '@', fg: '#5bf870' };
    const enemy = gs.enemies.find(e => e.x === x && e.y === y && e.hp > 0);
    if (enemy) return { ch: enemy.char, fg: enemy.color };
    const item = gs.items.find(i => i.x === x && i.y === y);
    if (item) return { ch: item.char, fg: item.color };
    if (x === gs.stairs.x && y === gs.stairs.y) return { ch: '>', fg: '#ffffff' };
  }

  const tile = gs.map[y][x];
  if (isVis) {
    return tile === '#' ? { ch: '#', fg: '#2e5a2e' } : { ch: '.', fg: '#1a3a1a' };
  }
  // Explored but not visible — dim
  if (x === gs.stairs.x && y === gs.stairs.y) return { ch: '>', fg: '#333' };
  return tile === '#' ? { ch: '#', fg: '#152215' } : { ch: '.', fg: '#0a150a' };
}

function renderMapLine(gs, y) {
  const spans = [];
  let cur = { ch: '', fg: '' };
  for (let x = 0; x < MAP_W; x++) {
    const cell = getCell(gs, x, y);
    if (cell.fg === cur.fg) { cur.ch += cell.ch; }
    else {
      if (cur.ch) spans.push(<span key={spans.length} style={{ color: cur.fg }}>{cur.ch}</span>);
      cur = { ch: cell.ch, fg: cell.fg };
    }
  }
  if (cur.ch) spans.push(<span key={spans.length} style={{ color: cur.fg }}>{cur.ch}</span>);
  return <div key={y}>{spans}</div>;
}

function hpBar(hp, maxHp) {
  const w = 12;
  const filled = Math.max(0, Math.round((hp / maxHp) * w));
  return '\u2588'.repeat(filled) + '\u2591'.repeat(w - filled);
}

function hpColor(hp, maxHp) {
  const pct = hp / maxHp;
  if (pct > 0.5) return '#5bf870';
  if (pct > 0.25) return '#ffaa44';
  return '#ff4444';
}

// ── Component ───────────────────────────────────────────────────
export default function Roguelike() {
  const { enterGameMode, exitGameMode } = useContext(TerminalContext);
  const containerRef = useRef(null);
  const gameRef = useRef(null);
  const [tick, setTick] = useState(0);

  useEffect(() => {
    enterGameMode();
    gameRef.current = initGame();
    setTick(1);
    return () => exitGameMode();
  }, []);

  const handleKey = useCallback((e) => {
    const gs = gameRef.current;
    if (!gs) return;

    if (gs.gameOver || gs.won) {
      exitGameMode();
      return;
    }

    let dx = 0, dy = 0, acted = false;
    switch (e.key) {
      case 'ArrowLeft':  case 'h': dx = -1; break;
      case 'ArrowRight': case 'l': dx = 1; break;
      case 'ArrowUp':    case 'k': dy = -1; break;
      case 'ArrowDown':  case 'j': dy = 1; break;
      case '.': case '5': acted = true; break;
      case '>': descendStairs(gs); acted = true; break;
      case 'Escape': exitGameMode(); return;
      default: return;
    }
    e.preventDefault();

    if (dx !== 0 || dy !== 0) acted = processMove(gs, dx, dy);
    if (acted && !gs.gameOver && !gs.won) {
      processEnemyTurns(gs);
      gs.visible = computeFOV(gs.map, gs.player.x, gs.player.y);
      gs.visible.forEach(k => { const [x, y] = k.split(',').map(Number); gs.explored[y][x] = true; });
    }
    setTick(t => t + 1);
  }, [exitGameMode]);

  useEffect(() => { containerRef.current?.focus(); }, [tick]);

  if (!gameRef.current) return null;
  const gs = gameRef.current;
  const p = gs.player;

  // ── Death Screen ──────────────────────────────────────────────
  if (gs.gameOver) {
    return (
      <div ref={containerRef} className="rogue-container" tabIndex={0} onKeyDown={() => exitGameMode()}>
        <pre className="rogue-end-screen">{`


          ___________________
         /                   \\
        /       R . I . P .   \\
       /                       \\
      |      Adventurer         |
      |                         |
      |    Slain by ${(gs.killedBy || 'Unknown').padEnd(10)}  |
      |    on Floor ${String(gs.floor).padEnd(12)}  |
      |                         |
      |    LVL ${String(p.lvl).padEnd(4)} GOLD ${String(p.gold).padEnd(5)} |
      |                         |
      |     * * *   * * *       |
      |_________________________|


         Press any key to exit
`}</pre>
      </div>
    );
  }

  // ── Victory Screen ────────────────────────────────────────────
  if (gs.won) {
    return (
      <div ref={containerRef} className="rogue-container" tabIndex={0} onKeyDown={() => exitGameMode()}>
        <pre className="rogue-end-screen rogue-victory">{`


     ╔═══════════════════════════════════╗
     ║                                   ║
     ║    THE DRAGON HAS BEEN SLAIN!     ║
     ║                                   ║
     ║   You emerge victorious from the  ║
     ║   dungeon, treasures in hand and  ║
     ║   glory in your heart.            ║
     ║                                   ║
     ║   LVL: ${String(p.lvl).padEnd(4)}  ATK: ${String(p.atk).padEnd(4)}  DEF: ${String(p.def).padEnd(3)}║
     ║   GOLD: ${String(p.gold).padEnd(27)}║
     ║                                   ║
     ║     Press any key to exit...      ║
     ║                                   ║
     ╚═══════════════════════════════════╝
`}</pre>
      </div>
    );
  }

  // ── Game Screen ───────────────────────────────────────────────
  return (
    <div ref={containerRef} className="rogue-container" tabIndex={0} onKeyDown={handleKey}>
      <div className="rogue-body">
        <pre className="rogue-map">
          {Array.from({ length: MAP_H }, (_, y) => renderMapLine(gs, y))}
        </pre>
        <div className="rogue-stats">
          <div className="rogue-stats-title">DUNGEON</div>
          <div className="rogue-stats-sep" />
          <div className="rogue-stats-row"><span style={{ color: '#5bf870' }}>@</span> ADVENTURER</div>
          <div className="rogue-stats-row">
            HP <span style={{ color: hpColor(p.hp, p.maxHp) }}>{hpBar(p.hp, p.maxHp)}</span>
          </div>
          <div className="rogue-stats-row rogue-stats-dim">{`   ${p.hp} / ${p.maxHp}`}</div>
          <div className="rogue-stats-row">{`ATK ${String(p.atk).padStart(2)}   DEF ${String(p.def).padStart(2)}`}</div>
          <div className="rogue-stats-row">{`LVL ${String(p.lvl).padStart(2)}   FLR ${String(gs.floor).padStart(2)}`}</div>
          <div className="rogue-stats-row">{`XP  ${p.xp} / ${p.lvl * 15}`}</div>
          <div className="rogue-stats-row">{`GOLD ${p.gold}`}</div>
          <div className="rogue-stats-sep" />
          <div className="rogue-stats-label">EQUIPMENT</div>
          <div className="rogue-stats-row"><span style={{ color: '#ffaa44' }}>/</span> {WEAPON_NAMES[p.weaponLvl]}</div>
          <div className="rogue-stats-row"><span style={{ color: '#aaaacc' }}>[</span> {ARMOR_NAMES[p.armorLvl]}</div>
          <div className="rogue-stats-sep" />
          <div className="rogue-stats-dim">HJKL/ARROWS Move</div>
          <div className="rogue-stats-dim">&gt; Descend stairs</div>
          <div className="rogue-stats-dim">. Wait a turn</div>
          <div className="rogue-stats-dim">ESC Quit</div>
        </div>
      </div>
      <div className="rogue-log">
        {gs.log.slice(-3).map((msg, i) => (
          <div key={`${tick}-${i}`} className="rogue-log-line" style={{ opacity: 0.4 + i * 0.3 }}>{msg}</div>
        ))}
      </div>
    </div>
  );
}
