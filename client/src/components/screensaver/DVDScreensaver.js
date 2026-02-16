import { useEffect, useRef, useState, useContext } from 'react';
import { TerminalContext } from '../../context/TerminalContext';

const COLORS = [
  '#ff4444', '#ff9900', '#ffee00',
  '#44ff66', '#44ddff', '#9944ff', '#ff44cc',
];

export default function DVDScreensaver() {
  const { setScreensaver, inputRef } = useContext(TerminalContext);
  const containerRef = useRef(null);
  const logoRef = useRef(null);
  const posRef = useRef({ x: 80, y: 60 });
  const velRef = useRef({ x: 1.1, y: 0.75 });
  const colorIdxRef = useRef(0);
  const rafRef = useRef(null);
  const [color, setColor] = useState(COLORS[0]);

  useEffect(() => {
    const container = containerRef.current;
    const logo = logoRef.current;

    const animate = () => {
      const cw = container.offsetWidth;
      const ch = container.offsetHeight;
      const lw = logo.offsetWidth;
      const lh = logo.offsetHeight;

      let { x, y } = posRef.current;
      let { x: vx, y: vy } = velRef.current;

      x += vx;
      y += vy;

      let bounced = false;
      if (x <= 0)        { x = 0;       vx =  Math.abs(vx); bounced = true; }
      if (x + lw >= cw)  { x = cw - lw; vx = -Math.abs(vx); bounced = true; }
      if (y <= 0)        { y = 0;       vy =  Math.abs(vy); bounced = true; }
      if (y + lh >= ch)  { y = ch - lh; vy = -Math.abs(vy); bounced = true; }

      if (bounced) {
        colorIdxRef.current = (colorIdxRef.current + 1) % COLORS.length;
        setColor(COLORS[colorIdxRef.current]);
      }

      posRef.current = { x, y };
      velRef.current = { x: vx, y: vy };
      logo.style.transform = `translate(${x}px, ${y}px)`;

      rafRef.current = requestAnimationFrame(animate);
    };

    rafRef.current = requestAnimationFrame(animate);

    const dismiss = () => {
      setScreensaver(false);
      setTimeout(() => inputRef.current?.focus(), 0);
    };
    document.addEventListener('keydown', dismiss);
    container.addEventListener('click', dismiss);

    return () => {
      cancelAnimationFrame(rafRef.current);
      document.removeEventListener('keydown', dismiss);
      container.removeEventListener('click', dismiss);
    };
  }, [setScreensaver, inputRef]);

  return (
    <div ref={containerRef} className="dvd-screensaver">
      <div ref={logoRef} className="dvd-logo" style={{ color }}>
        <div className="dvd-wordmark">
          <span className="dvd-d">D</span>
          <span className="dvd-v">V</span>
          <span className="dvd-d2">D</span>
        </div>
        <div className="dvd-swoosh" />
        <div className="dvd-video">VIDEO</div>
      </div>
      <div className="dvd-hint">press any key or click to exit</div>
    </div>
  );
}
