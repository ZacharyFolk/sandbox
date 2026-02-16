import { useEffect, useRef } from 'react';
import { useScreensaverDismiss } from './useScreensaverDismiss';

const COLORS = [
  '#ff4444', '#ff9900', '#ffee00', '#44ff88',
  '#44aaff', '#aa44ff', '#ff44cc', '#00ffee',
];
const PIPE_W = 10;
const SPEED = PIPE_W;
const NUM_PIPES = 7;
const RESET_AFTER = 4000; // ms before fade+restart

export default function PipesScreensaver() {
  const containerRef = useRef(null);
  const canvasRef = useRef(null);
  useScreensaverDismiss(containerRef);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    canvas.width = containerRef.current.offsetWidth;
    canvas.height = containerRef.current.offsetHeight;
    const W = canvas.width;
    const H = canvas.height;

    // Snap to grid
    const snap = (v) => Math.round(v / PIPE_W) * PIPE_W;

    const makePipe = (i) => ({
      x: snap(Math.random() * W),
      y: snap(Math.random() * H),
      dx: SPEED * (Math.random() < 0.5 ? 1 : -1),
      dy: 0,
      color: COLORS[i % COLORS.length],
      turnCountdown: Math.floor(3 + Math.random() * 12),
      stepsTaken: 0,
    });

    let pipes = Array.from({ length: NUM_PIPES }, (_, i) => makePipe(i));

    ctx.fillStyle = '#000';
    ctx.fillRect(0, 0, W, H);

    let startTime = Date.now();
    let fading = false;
    let fadeAlpha = 0;
    let rafId;

    const drawBall = (x, y, color) => {
      // Shiny ball at junction
      const grad = ctx.createRadialGradient(x - 2, y - 2, 1, x, y, PIPE_W * 0.7);
      grad.addColorStop(0, '#ffffff');
      grad.addColorStop(0.3, color);
      grad.addColorStop(1, '#000');
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(x, y, PIPE_W * 0.7, 0, Math.PI * 2);
      ctx.fill();
    };

    const animate = () => {
      const elapsed = Date.now() - startTime;

      if (!fading && elapsed > RESET_AFTER) {
        fading = true;
        fadeAlpha = 0;
      }

      if (fading) {
        fadeAlpha += 0.015;
        ctx.fillStyle = `rgba(0,0,0,${fadeAlpha})`;
        ctx.fillRect(0, 0, W, H);
        if (fadeAlpha >= 1) {
          ctx.fillStyle = '#000';
          ctx.fillRect(0, 0, W, H);
          pipes = Array.from({ length: NUM_PIPES }, (_, i) => makePipe(i));
          fading = false;
          startTime = Date.now();
        }
        rafId = requestAnimationFrame(animate);
        return;
      }

      for (const p of pipes) {
        const px = p.x;
        const py = p.y;

        // Draw pipe segment
        ctx.strokeStyle = p.color;
        ctx.lineWidth = PIPE_W - 2;
        ctx.lineCap = 'square';
        ctx.shadowBlur = 6;
        ctx.shadowColor = p.color;
        ctx.beginPath();
        ctx.moveTo(px, py);

        p.x = snap(p.x + p.dx);
        p.y = snap(p.y + p.dy);

        // Wrap
        if (p.x < 0) p.x = W;
        if (p.x > W) p.x = 0;
        if (p.y < 0) p.y = H;
        if (p.y > H) p.y = 0;

        ctx.lineTo(p.x, p.y);
        ctx.stroke();
        ctx.shadowBlur = 0;

        p.turnCountdown--;
        p.stepsTaken++;

        if (p.turnCountdown <= 0) {
          drawBall(p.x, p.y, p.color);

          // Pick a new direction (perpendicular or same, but weighted toward turns)
          const dirs = p.dx !== 0
            ? [{ dx: 0, dy: SPEED }, { dx: 0, dy: -SPEED }, { dx: p.dx, dy: 0 }]
            : [{ dx: SPEED, dy: 0 }, { dx: -SPEED, dy: 0 }, { dx: 0, dy: p.dy }];

          const chosen = dirs[Math.floor(Math.random() * dirs.length)];
          p.dx = chosen.dx;
          p.dy = chosen.dy;
          p.turnCountdown = Math.floor(3 + Math.random() * 14);
        }
      }

      rafId = requestAnimationFrame(animate);
    };

    animate();
    return () => cancelAnimationFrame(rafId);
  }, []);

  return (
    <div ref={containerRef} className="dvd-screensaver" style={{ background: '#000' }}>
      <canvas ref={canvasRef} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }} />
      <div className="dvd-hint">press any key or click to exit</div>
    </div>
  );
}
