import { useEffect, useRef } from 'react';
import { useScreensaverDismiss } from './useScreensaverDismiss';

const NUM_STARS = 300;

export default function StarfieldScreensaver() {
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
    const cx = W / 2;
    const cy = H / 2;

    const stars = Array.from({ length: NUM_STARS }, () => ({
      x: (Math.random() - 0.5) * W * 2,
      y: (Math.random() - 0.5) * H * 2,
      z: Math.random() * W,
      pz: W,
    }));

    // Occasionally show a streaking comet
    let cometTimer = 0;
    let comet = null;

    let speed = 5;
    let rafId;

    const animate = () => {
      // Gradually accelerate
      speed = Math.min(18, speed + 0.02);

      ctx.fillStyle = 'rgba(0,0,0,0.25)';
      ctx.fillRect(0, 0, W, H);

      for (const s of stars) {
        s.pz = s.z;
        s.z -= speed;

        if (s.z <= 0) {
          s.x = (Math.random() - 0.5) * W * 2;
          s.y = (Math.random() - 0.5) * H * 2;
          s.z = W;
          s.pz = W;
        }

        const sx = (s.x / s.z) * W + cx;
        const sy = (s.y / s.z) * H + cy;
        const px = (s.x / s.pz) * W + cx;
        const py = (s.y / s.pz) * H + cy;

        const depth = 1 - s.z / W;
        const r = Math.floor(180 + depth * 75);
        const g = Math.floor(180 + depth * 75);
        const b = Math.min(255, Math.floor(220 + depth * 35));
        const alpha = depth * 0.9;

        ctx.beginPath();
        ctx.strokeStyle = `rgba(${r},${g},${b},${alpha})`;
        ctx.lineWidth = depth * 2.5;
        ctx.moveTo(px, py);
        ctx.lineTo(sx, sy);
        ctx.stroke();
      }

      // Comet
      cometTimer--;
      if (cometTimer <= 0) {
        cometTimer = 120 + Math.floor(Math.random() * 200);
        comet = {
          x: Math.random() * W,
          y: Math.random() * H * 0.4,
          vx: 4 + Math.random() * 5,
          vy: 2 + Math.random() * 3,
          life: 60,
        };
      }
      if (comet) {
        const t = comet.life / 60;
        ctx.beginPath();
        ctx.strokeStyle = `rgba(180,230,255,${t * 0.8})`;
        ctx.lineWidth = t * 3;
        ctx.moveTo(comet.x, comet.y);
        ctx.lineTo(comet.x - comet.vx * 8, comet.y - comet.vy * 8);
        ctx.stroke();
        comet.x += comet.vx;
        comet.y += comet.vy;
        comet.life--;
        if (comet.life <= 0 || comet.x > W || comet.y > H) comet = null;
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
