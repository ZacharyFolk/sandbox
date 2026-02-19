import { useEffect, useRef, useState } from 'react';

export default function Stardate() {
  const canvasRef = useRef(null);
  const [fadeIn, setFadeIn] = useState(false);

  const now = new Date();
  const earth = now.toLocaleString('en-US', { dateStyle: 'medium', timeStyle: 'short' });
  const sd = Math.floor(Date.now() / 86400000) + '.' + Math.floor(Math.random() * 9);
  const epoch = String(Math.floor(Date.now() / 1000));

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const W = canvas.width = 400;
    const H = canvas.height = 200;

    const stars = Array.from({ length: 80 }, () => ({
      x: (Math.random() - 0.5) * W * 2,
      y: (Math.random() - 0.5) * H * 2,
      z: Math.random() * W,
    }));

    let raf;
    const draw = () => {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
      ctx.fillRect(0, 0, W, H);

      for (const star of stars) {
        star.z -= 6;
        if (star.z <= 0) {
          star.z = W;
          star.x = (Math.random() - 0.5) * W * 2;
          star.y = (Math.random() - 0.5) * H * 2;
        }

        const sx = (star.x / star.z) * W / 2 + W / 2;
        const sy = (star.y / star.z) * H / 2 + H / 2;

        const prevZ = star.z + 6;
        const px = (star.x / prevZ) * W / 2 + W / 2;
        const py = (star.y / prevZ) * H / 2 + H / 2;

        const brightness = Math.min(1, (1 - star.z / W) * 1.5);
        const r = Math.floor(200 + 55 * brightness);
        const g = Math.floor(180 + 75 * brightness);
        const b = Math.floor(100 + 155 * brightness);

        ctx.strokeStyle = `rgba(${r},${g},${b},${brightness})`;
        ctx.lineWidth = brightness * 2;
        ctx.beginPath();
        ctx.moveTo(px, py);
        ctx.lineTo(sx, sy);
        ctx.stroke();
      }

      raf = requestAnimationFrame(draw);
    };
    draw();

    setTimeout(() => setFadeIn(true), 100);

    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <div className="stardate-container">
      <canvas ref={canvasRef} className="stardate-canvas" />
      <div className={`stardate-readout ${fadeIn ? 'stardate-readout--visible' : ''}`}>
        <div className="stardate-label">EARTH TIME</div>
        <div className="stardate-value">{earth}</div>
        <div className="stardate-divider" />
        <div className="stardate-label">STARDATE</div>
        <div className="stardate-value stardate-value--big">{sd}</div>
        <div className="stardate-divider" />
        <div className="stardate-row">
          <div>
            <div className="stardate-label">UNIX EPOCH</div>
            <div className="stardate-value">{epoch}</div>
          </div>
          <div>
            <div className="stardate-label">COSMIC AGE</div>
            <div className="stardate-value">13.8B YRS</div>
          </div>
        </div>
        <div className="stardate-divider" />
        <div className="stardate-quote">
          TIME IS AN ILLUSION.<br />
          LUNCHTIME DOUBLY SO.<br />
          <span className="stardate-attr">-- FORD PREFECT</span>
        </div>
      </div>
    </div>
  );
}
