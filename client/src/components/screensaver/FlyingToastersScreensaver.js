import { useEffect, useRef, useContext } from 'react';
import { TerminalContext } from '../../context/TerminalContext';

// After Dark-inspired flying toasters — canvas-rendered pixel art

const TOAST_COLOR = '#D4A54A';
const TOAST_DARK = '#8B6914';
const TOAST_CRUST = '#A0722A';
const WING_COLOR = '#CCCCCC';
const WING_DARK = '#888888';
const BODY_COLOR = '#C0C0C0';
const BODY_DARK = '#707070';
const BODY_LIGHT = '#E8E8E8';
const SLOT_COLOR = '#333333';

function drawToaster(ctx, x, y, size, wingPhase) {
  const s = size / 32; // scale factor (base sprite = 32px)

  // ── Toaster body ──
  ctx.fillStyle = BODY_COLOR;
  ctx.fillRect(x + 4 * s, y + 14 * s, 24 * s, 16 * s);

  // Body highlight
  ctx.fillStyle = BODY_LIGHT;
  ctx.fillRect(x + 4 * s, y + 14 * s, 24 * s, 3 * s);

  // Body shadow
  ctx.fillStyle = BODY_DARK;
  ctx.fillRect(x + 4 * s, y + 27 * s, 24 * s, 3 * s);

  // Slot
  ctx.fillStyle = SLOT_COLOR;
  ctx.fillRect(x + 8 * s, y + 12 * s, 16 * s, 4 * s);

  // ── Toast popping out ──
  ctx.fillStyle = TOAST_COLOR;
  ctx.fillRect(x + 10 * s, y + 4 * s, 12 * s, 12 * s);

  // Toast crust edge
  ctx.fillStyle = TOAST_CRUST;
  ctx.fillRect(x + 10 * s, y + 4 * s, 12 * s, 2 * s);
  ctx.fillRect(x + 10 * s, y + 4 * s, 2 * s, 12 * s);
  ctx.fillRect(x + 20 * s, y + 4 * s, 2 * s, 12 * s);

  // Toast dark spot (burnt)
  ctx.fillStyle = TOAST_DARK;
  ctx.fillRect(x + 13 * s, y + 8 * s, 3 * s, 3 * s);
  ctx.fillRect(x + 17 * s, y + 10 * s, 2 * s, 2 * s);

  // ── Wings ──
  const wingUp = Math.sin(wingPhase) > 0;
  ctx.fillStyle = WING_COLOR;

  if (wingUp) {
    // Wings up
    // Left wing
    ctx.fillRect(x - 2 * s, y + 6 * s, 8 * s, 3 * s);
    ctx.fillRect(x - 4 * s, y + 3 * s, 6 * s, 3 * s);
    ctx.fillStyle = WING_DARK;
    ctx.fillRect(x - 4 * s, y + 5 * s, 6 * s, 1 * s);

    // Right wing
    ctx.fillStyle = WING_COLOR;
    ctx.fillRect(x + 26 * s, y + 6 * s, 8 * s, 3 * s);
    ctx.fillRect(x + 30 * s, y + 3 * s, 6 * s, 3 * s);
    ctx.fillStyle = WING_DARK;
    ctx.fillRect(x + 30 * s, y + 5 * s, 6 * s, 1 * s);
  } else {
    // Wings down
    // Left wing
    ctx.fillRect(x - 2 * s, y + 18 * s, 8 * s, 3 * s);
    ctx.fillRect(x - 4 * s, y + 21 * s, 6 * s, 3 * s);
    ctx.fillStyle = WING_DARK;
    ctx.fillRect(x - 4 * s, y + 20 * s, 6 * s, 1 * s);

    // Right wing
    ctx.fillStyle = WING_COLOR;
    ctx.fillRect(x + 26 * s, y + 18 * s, 8 * s, 3 * s);
    ctx.fillRect(x + 30 * s, y + 21 * s, 6 * s, 3 * s);
    ctx.fillStyle = WING_DARK;
    ctx.fillRect(x + 30 * s, y + 20 * s, 6 * s, 1 * s);
  }

  // Lever
  ctx.fillStyle = BODY_DARK;
  ctx.fillRect(x + 27 * s, y + 20 * s, 3 * s, 6 * s);
}

export default function FlyingToastersScreensaver() {
  const { setScreensaver, inputRef } = useContext(TerminalContext);
  const containerRef = useRef(null);
  const canvasRef = useRef(null);

  useEffect(() => {
    const container = containerRef.current;
    const canvas = canvasRef.current;
    const cw = container.clientWidth;
    const ch = container.clientHeight;
    canvas.width = cw;
    canvas.height = ch;
    const ctx = canvas.getContext('2d');

    // Spawn toasters
    const count = Math.max(8, Math.floor((cw * ch) / 40000));
    const toasters = [];
    for (let i = 0; i < count; i++) {
      toasters.push({
        x: Math.random() * (cw + 200) - 100,
        y: Math.random() * ch - ch * 0.3,
        size: 28 + Math.random() * 28,
        speed: 0.4 + Math.random() * 0.8,
        wingSpeed: 3 + Math.random() * 3,
        wingPhase: Math.random() * Math.PI * 2,
      });
    }

    let raf;
    const animate = (time) => {
      ctx.fillStyle = '#000000';
      ctx.fillRect(0, 0, cw, ch);

      for (const t of toasters) {
        // Move diagonally — left and down (classic After Dark direction)
        t.x -= t.speed * 0.7;
        t.y += t.speed;
        t.wingPhase += t.wingSpeed * 0.016;

        // Wrap around
        if (t.y > ch + 40) {
          t.y = -50;
          t.x = Math.random() * (cw + 200);
        }
        if (t.x < -60) {
          t.x = cw + 50;
        }

        drawToaster(ctx, t.x, t.y, t.size, t.wingPhase);
      }

      // CRT scanlines
      ctx.fillStyle = 'rgba(0,0,0,0.08)';
      for (let sy = 0; sy < ch; sy += 3) {
        ctx.fillRect(0, sy, cw, 1);
      }

      raf = requestAnimationFrame(animate);
    };
    raf = requestAnimationFrame(animate);

    // Dismiss
    const dismiss = () => {
      setScreensaver(false);
      setTimeout(() => inputRef.current?.focus(), 0);
    };
    document.addEventListener('keydown', dismiss);
    container.addEventListener('click', dismiss);

    return () => {
      cancelAnimationFrame(raf);
      document.removeEventListener('keydown', dismiss);
      container.removeEventListener('click', dismiss);
    };
  }, [setScreensaver, inputRef]);

  return (
    <div ref={containerRef} className="dvd-screensaver">
      <canvas
        ref={canvasRef}
        style={{
          display: 'block',
          width: '100%',
          height: '100%',
          imageRendering: 'pixelated',
        }}
      />
      <div className="dvd-hint">press any key or click to exit</div>
    </div>
  );
}
