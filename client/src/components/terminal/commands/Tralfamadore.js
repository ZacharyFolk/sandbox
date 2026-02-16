import { useEffect, useRef, useState, useContext, useCallback } from 'react';
import { TerminalContext } from '../../../context/TerminalContext';

// ── Vonnegut quotes ─────────────────────────────────────────────
const QUOTES = [
  { text: 'Everything was beautiful and nothing hurt.', src: 'Slaughterhouse-Five' },
  { text: 'So it goes.', src: 'Slaughterhouse-Five' },
  { text: 'We are what we pretend to be, so we must be careful about what we pretend to be.', src: 'Mother Night' },
  { text: 'I was a victim of a series of accidents, as are we all.', src: 'The Sirens of Titan' },
  { text: 'Hello, babies. Welcome to Earth. It\'s hot in the summer and cold in the winter.', src: 'God Bless You, Mr. Rosewater' },
  { text: 'Tiger got to hunt, bird got to fly;\nMan got to sit and wonder "why, why, why?"', src: 'Cat\'s Cradle' },
  { text: 'If this isn\'t nice, I don\'t know what is.', src: 'autobiographical' },
  { text: 'We are here on Earth to fart around, and don\'t let anybody tell you different.', src: 'A Man Without a Country' },
  { text: 'And I asked myself about the present: how wide it was, how deep it was, how much was mine to keep.', src: 'Slaughterhouse-Five' },
  { text: 'Of all the words of mice and men, the saddest are "It might have been."', src: 'Cat\'s Cradle' },
  { text: 'A purpose of human life, no matter who is controlling it, is to love whoever is around to be loved.', src: 'The Sirens of Titan' },
  { text: 'Listen: Billy Pilgrim has come unstuck in time.', src: 'Slaughterhouse-Five' },
  { text: 'True terror is to wake up one morning and discover that your high school class is running the country.', src: 'autobiographical' },
  { text: 'I tell you, we are here on Earth to fart around, and don\'t let anybody tell you different.', src: 'Timequake' },
  { text: 'There is no reason why good cannot triumph as often as evil. The triumph of anything is a matter of organization.', src: 'The Sirens of Titan' },
  { text: 'Peculiar travel suggestions are dancing lessons from God.', src: 'Cat\'s Cradle' },
  { text: 'All this happened, more or less.', src: 'Slaughterhouse-Five' },
  { text: 'Poo-tee-weet?', src: 'Slaughterhouse-Five' },
];

// ── Color palette ───────────────────────────────────────────────
const NEBULA_COLORS = [
  'rgba(88, 28, 135, 0.08)',   // deep purple
  'rgba(30, 64, 175, 0.06)',   // deep blue
  'rgba(6, 95, 70, 0.07)',     // teal
  'rgba(157, 23, 77, 0.05)',   // magenta
];

const CRYSTAL_COLORS = [
  '#c084fc', '#818cf8', '#67e8f9', '#a78bfa',
  '#f0abfc', '#7dd3fc', '#86efac', '#fda4af',
];

export default function Tralfamadore() {
  const { enterGameMode, exitGameMode } = useContext(TerminalContext);
  const containerRef = useRef(null);
  const canvasRef = useRef(null);
  const stateRef = useRef({
    phase: 'intro',    // intro | observatory
    introText: '',
    introIdx: 0,
    introTimer: 0,
    time: 0,
    quoteIdx: 0,
    quoteFade: 0,      // 0-1 for current quote visibility
    quoteHold: 0,
    warpFlash: 0,
    soItGoesCount: 0,
    crystals: [],
    stars: [],
    shootingStars: [],
    nebulae: [],
  });

  const [ready, setReady] = useState(false);

  useEffect(() => {
    enterGameMode();
    return () => exitGameMode();
  }, []);

  // ── Initialize canvas ──────────────────────────────────────────
  useEffect(() => {
    if (!containerRef.current || !canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const W = containerRef.current.offsetWidth;
    const H = containerRef.current.offsetHeight;
    canvas.width = W;
    canvas.height = H;

    const S = stateRef.current;

    // Stars — three parallax layers
    S.stars = Array.from({ length: 200 }, () => ({
      x: Math.random() * W,
      y: Math.random() * H,
      r: 0.3 + Math.random() * 1.8,
      twinkle: Math.random() * Math.PI * 2,
      speed: 0.3 + Math.random() * 0.7,
      layer: Math.floor(Math.random() * 3),
    }));

    // Nebula blobs
    S.nebulae = Array.from({ length: 5 }, () => ({
      x: Math.random() * W,
      y: Math.random() * H * 0.7,
      r: 80 + Math.random() * 180,
      color: NEBULA_COLORS[Math.floor(Math.random() * NEBULA_COLORS.length)],
      drift: Math.random() * Math.PI * 2,
    }));

    // Time crystals floating around
    S.crystals = Array.from({ length: 12 }, (_, i) => ({
      x: W * 0.15 + Math.random() * W * 0.7,
      y: H * 0.1 + Math.random() * H * 0.6,
      r: 8 + Math.random() * 16,
      color: CRYSTAL_COLORS[i % CRYSTAL_COLORS.length],
      phase: Math.random() * Math.PI * 2,
      orbit: 20 + Math.random() * 40,
      speed: 0.004 + Math.random() * 0.008,
      quoteIdx: i % QUOTES.length,
      alpha: 0.4 + Math.random() * 0.4,
    }));

    const INTRO_LINE = 'Listen: Billy Pilgrim has come unstuck in time.';
    const SURFACE_Y = H * 0.82;

    // ── Drawing functions ─────────────────────────────────────────

    const drawSpace = () => {
      // Deep space gradient
      const bg = ctx.createLinearGradient(0, 0, 0, H);
      bg.addColorStop(0, '#020014');
      bg.addColorStop(0.4, '#06002a');
      bg.addColorStop(0.7, '#0a0030');
      bg.addColorStop(1, '#000810');
      ctx.fillStyle = bg;
      ctx.fillRect(0, 0, W, H);

      // Nebulae
      for (const n of S.nebulae) {
        n.drift += 0.001;
        const nx = n.x + Math.sin(n.drift) * 15;
        const ny = n.y + Math.cos(n.drift * 0.7) * 10;
        const g = ctx.createRadialGradient(nx, ny, 0, nx, ny, n.r);
        g.addColorStop(0, n.color);
        g.addColorStop(1, 'transparent');
        ctx.fillStyle = g;
        ctx.fillRect(nx - n.r, ny - n.r, n.r * 2, n.r * 2);
      }
    };

    const drawStars = () => {
      for (const s of S.stars) {
        s.twinkle += 0.015 * s.speed;
        const alpha = 0.3 + Math.sin(s.twinkle) * 0.4 + 0.3;
        const layerAlpha = [0.5, 0.7, 1][s.layer];

        ctx.globalAlpha = alpha * layerAlpha;
        ctx.fillStyle = s.layer === 2 ? '#e8e0ff' : s.layer === 1 ? '#c8d8ff' : '#8090aa';
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        ctx.fill();

        // Glow on bright stars
        if (s.r > 1.3 && s.layer === 2) {
          const sg = ctx.createRadialGradient(s.x, s.y, 0, s.x, s.y, s.r * 4);
          sg.addColorStop(0, `rgba(200, 180, 255, ${alpha * 0.2})`);
          sg.addColorStop(1, 'transparent');
          ctx.fillStyle = sg;
          ctx.beginPath();
          ctx.arc(s.x, s.y, s.r * 4, 0, Math.PI * 2);
          ctx.fill();
        }
      }
      ctx.globalAlpha = 1;
    };

    const drawShootingStar = () => {
      // Spawn new shooting stars occasionally
      if (Math.random() < 0.003) {
        S.shootingStars.push({
          x: Math.random() * W,
          y: Math.random() * H * 0.4,
          vx: 3 + Math.random() * 4,
          vy: 1.5 + Math.random() * 2,
          life: 40 + Math.random() * 30,
          maxLife: 40 + Math.random() * 30,
        });
      }

      for (let i = S.shootingStars.length - 1; i >= 0; i--) {
        const ss = S.shootingStars[i];
        ss.x += ss.vx;
        ss.y += ss.vy;
        ss.life--;

        const alpha = ss.life / ss.maxLife;
        const tailLen = 30 * alpha;

        const grad = ctx.createLinearGradient(
          ss.x, ss.y, ss.x - ss.vx * tailLen * 0.3, ss.y - ss.vy * tailLen * 0.3
        );
        grad.addColorStop(0, `rgba(255, 255, 255, ${alpha})`);
        grad.addColorStop(1, 'rgba(255, 255, 255, 0)');

        ctx.strokeStyle = grad;
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(ss.x, ss.y);
        ctx.lineTo(ss.x - ss.vx * tailLen * 0.3, ss.y - ss.vy * tailLen * 0.3);
        ctx.stroke();

        // Bright head
        ctx.fillStyle = `rgba(255, 255, 255, ${alpha})`;
        ctx.beginPath();
        ctx.arc(ss.x, ss.y, 1.2, 0, Math.PI * 2);
        ctx.fill();

        if (ss.life <= 0) S.shootingStars.splice(i, 1);
      }
    };

    const drawAlienSurface = () => {
      // Alien terrain
      const sg = ctx.createLinearGradient(0, SURFACE_Y, 0, H);
      sg.addColorStop(0, '#0a1628');
      sg.addColorStop(0.3, '#0d1a2e');
      sg.addColorStop(1, '#060e1a');
      ctx.fillStyle = sg;

      ctx.beginPath();
      ctx.moveTo(0, SURFACE_Y);
      for (let x = 0; x <= W; x += 4) {
        const ridge = Math.sin(x * 0.008) * 12 + Math.sin(x * 0.025) * 5 + Math.sin(x * 0.003) * 20;
        ctx.lineTo(x, SURFACE_Y + ridge);
      }
      ctx.lineTo(W, H);
      ctx.lineTo(0, H);
      ctx.fill();

      // Surface glow line
      ctx.strokeStyle = 'rgba(100, 60, 180, 0.3)';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      for (let x = 0; x <= W; x += 4) {
        const ridge = Math.sin(x * 0.008) * 12 + Math.sin(x * 0.025) * 5 + Math.sin(x * 0.003) * 20;
        if (x === 0) ctx.moveTo(x, SURFACE_Y + ridge);
        else ctx.lineTo(x, SURFACE_Y + ridge);
      }
      ctx.stroke();
    };

    const drawDome = () => {
      const cx = W * 0.5;
      const cy = SURFACE_Y - 8;
      const domeW = 90;
      const domeH = 70;

      // Dome glass
      ctx.globalAlpha = 0.15;
      ctx.fillStyle = '#a78bfa';
      ctx.beginPath();
      ctx.ellipse(cx, cy, domeW, domeH, 0, Math.PI, 0);
      ctx.fill();

      // Dome rim glow
      ctx.globalAlpha = 0.5;
      ctx.strokeStyle = 'rgba(167, 139, 250, 0.6)';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.ellipse(cx, cy, domeW, domeH, 0, Math.PI, 0);
      ctx.stroke();

      // Inner glow
      const ig = ctx.createRadialGradient(cx, cy - 20, 5, cx, cy - 10, domeH * 0.8);
      ig.addColorStop(0, 'rgba(167, 139, 250, 0.12)');
      ig.addColorStop(1, 'transparent');
      ctx.globalAlpha = 1;
      ctx.fillStyle = ig;
      ctx.beginPath();
      ctx.ellipse(cx, cy, domeW, domeH, 0, Math.PI, 0);
      ctx.fill();

      // Billy Pilgrim silhouette (tiny seated figure)
      ctx.fillStyle = '#1a1040';
      ctx.globalAlpha = 0.7;
      // Body
      ctx.fillRect(cx - 4, cy - 18, 8, 12);
      // Head
      ctx.beginPath();
      ctx.arc(cx, cy - 22, 5, 0, Math.PI * 2);
      ctx.fill();
      // Legs
      ctx.fillRect(cx - 6, cy - 6, 5, 4);
      ctx.fillRect(cx + 1, cy - 6, 5, 4);
      ctx.globalAlpha = 1;

      // Dome highlight arc
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.08)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.ellipse(cx - 15, cy - 15, domeW * 0.6, domeH * 0.5, -0.2, Math.PI + 0.5, -0.3);
      ctx.stroke();
    };

    const drawCrystals = () => {
      for (const c of S.crystals) {
        c.phase += c.speed;
        const cx = c.x + Math.sin(c.phase) * c.orbit;
        const cy = c.y + Math.cos(c.phase * 0.7) * c.orbit * 0.5;
        const pulse = 0.7 + Math.sin(c.phase * 2) * 0.3;

        // Outer glow
        const g = ctx.createRadialGradient(cx, cy, 0, cx, cy, c.r * 3);
        g.addColorStop(0, c.color + '40');
        g.addColorStop(1, 'transparent');
        ctx.fillStyle = g;
        ctx.beginPath();
        ctx.arc(cx, cy, c.r * 3, 0, Math.PI * 2);
        ctx.fill();

        // Crystal shape (diamond)
        ctx.globalAlpha = c.alpha * pulse;
        ctx.fillStyle = c.color;
        ctx.beginPath();
        ctx.moveTo(cx, cy - c.r);
        ctx.lineTo(cx + c.r * 0.6, cy);
        ctx.lineTo(cx, cy + c.r * 0.7);
        ctx.lineTo(cx - c.r * 0.6, cy);
        ctx.closePath();
        ctx.fill();

        // Inner bright spot
        ctx.fillStyle = 'rgba(255,255,255,0.4)';
        ctx.beginPath();
        ctx.arc(cx, cy - c.r * 0.2, c.r * 0.15, 0, Math.PI * 2);
        ctx.fill();

        ctx.globalAlpha = 1;
      }
    };

    const drawQuote = () => {
      const q = QUOTES[S.quoteIdx];
      if (!q) return;

      // Quote fading logic
      if (S.quoteHold > 0) {
        S.quoteFade = Math.min(1, S.quoteFade + 0.015);
        S.quoteHold--;
      } else {
        S.quoteFade = Math.max(0, S.quoteFade - 0.008);
        if (S.quoteFade <= 0) {
          S.quoteIdx = (S.quoteIdx + 1) % QUOTES.length;
          S.quoteHold = 280;
        }
      }

      if (S.quoteFade <= 0) return;

      const alpha = S.quoteFade;
      ctx.save();
      ctx.textAlign = 'center';

      // Quote text
      ctx.font = '16px "Courier New", monospace';
      ctx.fillStyle = `rgba(200, 180, 255, ${alpha * 0.95})`;
      ctx.shadowColor = `rgba(167, 139, 250, ${alpha * 0.5})`;
      ctx.shadowBlur = 20;

      // Word wrap
      const maxW = W * 0.65;
      const words = q.text.split(/(\n| )/);
      const lines = [];
      let line = '';
      for (const w of words) {
        if (w === '\n') { lines.push(line); line = ''; continue; }
        const test = line + w;
        if (ctx.measureText(test).width > maxW && line) {
          lines.push(line.trim());
          line = w;
        } else {
          line = test;
        }
      }
      if (line.trim()) lines.push(line.trim());

      const lineH = 24;
      const startY = H * 0.3 - (lines.length * lineH) / 2;

      // Decorative brackets
      ctx.font = '20px "Courier New", monospace';
      ctx.fillStyle = `rgba(167, 139, 250, ${alpha * 0.4})`;
      ctx.fillText('* * *', W / 2, startY - 18);

      ctx.font = '16px "Courier New", monospace';
      ctx.fillStyle = `rgba(200, 180, 255, ${alpha * 0.95})`;
      for (let i = 0; i < lines.length; i++) {
        ctx.fillText(lines[i], W / 2, startY + i * lineH + lineH);
      }

      // Source
      ctx.font = '11px "Courier New", monospace';
      ctx.fillStyle = `rgba(140, 120, 200, ${alpha * 0.5})`;
      ctx.fillText('— ' + q.src, W / 2, startY + lines.length * lineH + lineH + 16);

      ctx.restore();
    };

    const drawWarp = () => {
      if (S.warpFlash <= 0) return;
      S.warpFlash -= 0.02;
      ctx.globalAlpha = S.warpFlash * 0.4;
      ctx.fillStyle = '#c084fc';
      ctx.fillRect(0, 0, W, H);
      ctx.globalAlpha = 1;
    };

    const drawHUD = () => {
      ctx.font = '9px monospace';
      ctx.fillStyle = 'rgba(167, 139, 250, 0.3)';
      ctx.fillText('TRALFAMADORIAN TIME OBSERVATORY', 10, 14);
      ctx.fillText(`TEMPORAL COORDINATE: ${(S.time * 0.01).toFixed(2)}`, 10, 26);
      ctx.fillText(`SO IT GOES: ${S.soItGoesCount}`, 10, 38);

      ctx.textAlign = 'right';
      ctx.fillText('PRESS SPACE — BECOME UNSTUCK', W - 10, 14);
      ctx.fillText('ESC — RETURN TO PRESENT', W - 10, 26);
      ctx.textAlign = 'left';

      // Blinking Tralfamadorian eye at top center
      const eyeX = W / 2;
      const eyeY = 16;
      const blink = Math.sin(S.time * 0.03);
      if (blink > -0.3) {
        ctx.fillStyle = `rgba(167, 139, 250, ${0.3 + blink * 0.2})`;
        ctx.beginPath();
        // Eye shape — a vertical almond like Tralfamadorians have
        ctx.moveTo(eyeX, eyeY - 6);
        ctx.quadraticCurveTo(eyeX + 5, eyeY, eyeX, eyeY + 6);
        ctx.quadraticCurveTo(eyeX - 5, eyeY, eyeX, eyeY - 6);
        ctx.fill();
        // Pupil
        ctx.fillStyle = `rgba(255, 200, 255, ${0.5 + blink * 0.3})`;
        ctx.beginPath();
        ctx.arc(eyeX, eyeY, 1.5, 0, Math.PI * 2);
        ctx.fill();
      }
    };

    const drawIntro = () => {
      // Black background
      ctx.fillStyle = '#020014';
      ctx.fillRect(0, 0, W, H);

      // Draw faint stars even during intro
      drawStars();

      S.introTimer++;
      if (S.introTimer % 3 === 0 && S.introIdx < INTRO_LINE.length) {
        S.introText += INTRO_LINE[S.introIdx];
        S.introIdx++;
      }

      ctx.save();
      ctx.textAlign = 'center';

      // Main intro text
      ctx.font = '18px "Courier New", monospace';
      ctx.fillStyle = 'rgba(200, 180, 255, 0.9)';
      ctx.shadowColor = 'rgba(167, 139, 250, 0.6)';
      ctx.shadowBlur = 15;
      ctx.fillText(S.introText, W / 2, H / 2);

      // Blinking cursor
      if (S.introIdx < INTRO_LINE.length || Math.sin(S.time * 0.06) > 0) {
        const tw = ctx.measureText(S.introText).width;
        ctx.fillStyle = 'rgba(200, 180, 255, 0.8)';
        ctx.fillRect(W / 2 + tw / 2 + 3, H / 2 - 12, 9, 16);
      }

      ctx.restore();

      // After text is complete, wait a beat then transition
      if (S.introIdx >= INTRO_LINE.length) {
        S.introTimer++;
        if (S.introTimer > INTRO_LINE.length * 3 + 120) {
          S.phase = 'observatory';
          S.quoteHold = 200;
          S.soItGoesCount = 1; // "So it goes" — opening
        }
      }
    };

    // ── Main loop ─────────────────────────────────────────────────
    let rafId;
    const animate = () => {
      S.time++;

      if (S.phase === 'intro') {
        drawIntro();
      } else {
        drawSpace();
        drawStars();
        drawShootingStar();
        drawAlienSurface();
        drawDome();
        drawCrystals();
        drawQuote();
        drawWarp();
        drawHUD();
      }

      rafId = requestAnimationFrame(animate);
    };

    animate();
    setReady(true);

    return () => cancelAnimationFrame(rafId);
  }, []);

  // ── Keyboard handler ───────────────────────────────────────────
  const handleKey = useCallback((e) => {
    const S = stateRef.current;
    if (e.key === 'Escape') {
      exitGameMode();
      return;
    }
    if (e.key === ' ' && S.phase === 'observatory') {
      e.preventDefault();
      // Become unstuck — jump to new quote with warp effect
      S.quoteIdx = (S.quoteIdx + 1) % QUOTES.length;
      S.quoteFade = 0;
      S.quoteHold = 300;
      S.warpFlash = 1;
      S.soItGoesCount++;
    }
  }, [exitGameMode]);

  useEffect(() => {
    const el = containerRef.current;
    if (el) el.focus();
  }, [ready]);

  return (
    <div
      ref={containerRef}
      className="tralfamadore-container"
      tabIndex={0}
      onKeyDown={handleKey}
    >
      <canvas
        ref={canvasRef}
        style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}
      />
      <div className="tralfamadore-hint">
        press SPACE to become unstuck in time · ESC to return
      </div>
    </div>
  );
}
