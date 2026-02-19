import { useEffect, useRef, useContext } from 'react';
import { TerminalContext } from '../../../context/TerminalContext';

const ABBEY_QUOTES = [
  'Wilderness is not a luxury but a\nnecessity of the human spirit.',
  'May your trails be crooked, winding,\nlonesome, dangerous, leading to the\nmost amazing view.',
  'The idea of wilderness needs no defense,\nit only needs defenders.',
  'Growth for the sake of growth is the\nideology of the cancer cell.',
  'Sentiment without action is the\nruin of the soul.',
  'A patriot must always be ready to\ndefend his country against his government.',
  'One final paragraph of advice:\nDo not burn yourselves out.',
  'I would rather kill a man than a snake.',
  'In the first place you can\'t see anything\nfrom a car; you\'ve got to get out of the\ngodddamned contraption and walk.',
  'The missionaries go forth to Christianize\nthe savages — as if the savages weren\'t\nsufficiently Christianized already.',
];

const HAYDUKE_LINES = [
  'SCANNING INFRASTRUCTURE . . .',
  'BILLBOARD DETECTED — REMOVING . . .',
  'SURVEY STAKES FOUND — PULLING . . .',
  'BRIDGE TO NOWHERE — DECOMMISSIONING . . .',
  'BULLDOZER LOCATED — INTRODUCING SUGAR . . .',
  'DAM IDENTIFIED — FILING OBJECTION . . .',
  'ROAD THROUGH WILDERNESS — REROUTING . . .',
  'CORPORATE PIPELINE — MISPLACING BLUEPRINTS . . .',
];

export default function DesertSolitaire({ mode }) {
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

    let exited = false;
    const onKeyDown = (e) => {
      if (e.key === 'Escape') { exited = true; exitGameMode(); }
    };
    container.addEventListener('keydown', onKeyDown);
    container.focus();

    // ── Sky colors for sunset cycle ──
    const horizon = H * 0.62;

    // Stars
    const stars = Array.from({ length: 120 }, () => ({
      x: Math.random() * W,
      y: Math.random() * horizon * 0.85,
      r: Math.random() * 1.5 + 0.3,
      twinkle: Math.random() * Math.PI * 2,
      speed: Math.random() * 0.02 + 0.005,
    }));

    // Saguaro cacti
    const cacti = [
      { x: W * 0.12, h: 90, arms: [{ side: 1, y: 0.4, h: 30 }] },
      { x: W * 0.28, h: 60, arms: [] },
      { x: W * 0.72, h: 105, arms: [{ side: -1, y: 0.35, h: 35 }, { side: 1, y: 0.55, h: 22 }] },
      { x: W * 0.88, h: 70, arms: [{ side: -1, y: 0.45, h: 28 }] },
      { x: W * 0.5, h: 45, arms: [] },
    ];

    // Mesas
    const mesas = [
      { x: W * 0.15, w: W * 0.18, h: 45, top: 0.7 },
      { x: W * 0.55, w: W * 0.25, h: 60, top: 0.6 },
      { x: W * 0.85, w: W * 0.12, h: 35, top: 0.8 },
    ];

    // Quote state
    let quoteIdx = 0;
    let quoteAlpha = 0;
    let quotePhase = 'fadein'; // fadein, hold, fadeout
    let quoteTimer = 0;
    const FADE_DUR = 90;
    const HOLD_DUR = 240;

    // Hayduke mode state
    const isHayduke = mode === 'hayduke';
    let haydukePhase = 0; // 0=peaceful, 1=glitch, 2=sabotage, 3=graffiti
    let haydukeTimer = 0;
    let glitchIntensity = 0;
    let haydukeLineIdx = 0;
    let haydukeLineAlpha = 0;

    let t = 0;

    const drawCactus = (cx, baseY, h, arms) => {
      ctx.fillStyle = '#0a0a08';
      // Trunk
      const tw = 8;
      ctx.fillRect(cx - tw / 2, baseY - h, tw, h);
      ctx.beginPath();
      ctx.arc(cx, baseY - h, tw / 2, Math.PI, 0);
      ctx.fill();

      // Arms
      for (const arm of arms) {
        const ay = baseY - h * arm.y;
        const ax = cx + arm.side * tw / 2;
        const aw = arm.side * 18;
        ctx.fillRect(ax, ay - 5, aw, 5);
        ctx.fillRect(ax + aw - (arm.side > 0 ? 5 : 0), ay - arm.h, 5, arm.h);
        ctx.beginPath();
        ctx.arc(ax + aw - (arm.side > 0 ? 2.5 : -2.5), ay - arm.h, 2.5, Math.PI, 0);
        ctx.fill();
      }
    };

    const render = () => {
      t++;

      // ── Sky gradient ──
      const skyGrad = ctx.createLinearGradient(0, 0, 0, horizon);
      skyGrad.addColorStop(0, '#0a0a2e');
      skyGrad.addColorStop(0.4, '#1a1040');
      skyGrad.addColorStop(0.7, '#4a1535');
      skyGrad.addColorStop(0.85, '#8a3020');
      skyGrad.addColorStop(1, '#cc6622');
      ctx.fillStyle = skyGrad;
      ctx.fillRect(0, 0, W, horizon);

      // Horizon glow
      const hGlow = ctx.createRadialGradient(W * 0.4, horizon, 0, W * 0.4, horizon, W * 0.5);
      hGlow.addColorStop(0, 'rgba(255,120,30,0.3)');
      hGlow.addColorStop(1, 'rgba(255,120,30,0)');
      ctx.fillStyle = hGlow;
      ctx.fillRect(0, horizon - 80, W, 160);

      // ── Stars ──
      for (const star of stars) {
        const alpha = 0.3 + 0.7 * (0.5 + 0.5 * Math.sin(star.twinkle + t * star.speed));
        ctx.globalAlpha = alpha;
        ctx.fillStyle = '#fff';
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.r, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalAlpha = 1;

      // ── Desert floor ──
      const floorGrad = ctx.createLinearGradient(0, horizon, 0, H);
      floorGrad.addColorStop(0, '#3a1a08');
      floorGrad.addColorStop(0.3, '#2a1206');
      floorGrad.addColorStop(1, '#1a0a04');
      ctx.fillStyle = floorGrad;
      ctx.fillRect(0, horizon, W, H - horizon);

      // ── Mesas ──
      ctx.fillStyle = '#1a0e08';
      for (const mesa of mesas) {
        const my = horizon - mesa.h;
        ctx.beginPath();
        ctx.moveTo(mesa.x - mesa.w * 0.6, horizon);
        ctx.lineTo(mesa.x - mesa.w * mesa.top / 2, my);
        ctx.lineTo(mesa.x + mesa.w * mesa.top / 2, my);
        ctx.lineTo(mesa.x + mesa.w * 0.6, horizon);
        ctx.fill();
      }

      // ── Cacti ──
      for (const c of cacti) {
        drawCactus(c.x, horizon, c.h, c.arms);
      }

      // ── Quote rendering ──
      quoteTimer++;
      if (quotePhase === 'fadein') {
        quoteAlpha = Math.min(1, quoteTimer / FADE_DUR);
        if (quoteTimer >= FADE_DUR) { quotePhase = 'hold'; quoteTimer = 0; }
      } else if (quotePhase === 'hold') {
        quoteAlpha = 1;
        if (quoteTimer >= HOLD_DUR) { quotePhase = 'fadeout'; quoteTimer = 0; }
      } else {
        quoteAlpha = Math.max(0, 1 - quoteTimer / FADE_DUR);
        if (quoteTimer >= FADE_DUR) {
          quotePhase = 'fadein';
          quoteTimer = 0;
          quoteIdx = (quoteIdx + 1) % ABBEY_QUOTES.length;
        }
      }

      if (quoteAlpha > 0) {
        ctx.globalAlpha = quoteAlpha * 0.85;
        ctx.font = '15px monospace';
        ctx.fillStyle = '#ffcc88';
        ctx.textAlign = 'center';
        ctx.shadowColor = 'rgba(255,150,50,0.4)';
        ctx.shadowBlur = 15;

        const lines = ABBEY_QUOTES[quoteIdx].split('\n');
        const baseY = H * 0.3;
        for (let i = 0; i < lines.length; i++) {
          ctx.fillText(lines[i], W / 2, baseY + i * 22);
        }

        ctx.shadowBlur = 0;
        ctx.textAlign = 'start';
        ctx.globalAlpha = 1;
      }

      // Attribution
      ctx.globalAlpha = 0.25;
      ctx.font = '11px monospace';
      ctx.fillStyle = '#cc8844';
      ctx.textAlign = 'center';
      ctx.fillText('— EDWARD ABBEY, 1927–1989 —', W / 2, H - 40);
      ctx.fillText('"DESERT SOLITAIRE"', W / 2, H - 24);
      ctx.textAlign = 'start';
      ctx.globalAlpha = 1;

      // ── Hayduke mode ──
      if (isHayduke) {
        haydukeTimer++;

        // After 8 seconds of peace, Hayduke arrives
        if (haydukePhase === 0 && haydukeTimer > 480) {
          haydukePhase = 1;
          haydukeTimer = 0;
        }

        // Glitch phase — screen starts flickering
        if (haydukePhase === 1) {
          glitchIntensity = Math.min(0.6, haydukeTimer / 180);

          if (Math.random() < glitchIntensity * 0.3) {
            ctx.fillStyle = `rgba(255,50,20,${Math.random() * glitchIntensity * 0.3})`;
            const gy = Math.random() * H;
            ctx.fillRect(0, gy, W, 2 + Math.random() * 4);
          }

          if (haydukeTimer > 180) {
            haydukePhase = 2;
            haydukeTimer = 0;
          }
        }

        // Sabotage phase — Hayduke's work scrolls
        if (haydukePhase === 2) {
          if (haydukeTimer % 80 === 1 && haydukeLineIdx < HAYDUKE_LINES.length) {
            haydukeLineIdx++;
          }
          haydukeLineAlpha = Math.min(1, haydukeTimer / 60);

          // Scanline glitches continue
          if (Math.random() < 0.15) {
            ctx.fillStyle = `rgba(255,50,20,${Math.random() * 0.15})`;
            ctx.fillRect(0, Math.random() * H, W, 2);
          }

          ctx.globalAlpha = haydukeLineAlpha * 0.8;
          ctx.font = '11px monospace';
          ctx.fillStyle = '#ff4422';
          ctx.shadowColor = '#ff2200';
          ctx.shadowBlur = 8;

          for (let i = 0; i < haydukeLineIdx && i < HAYDUKE_LINES.length; i++) {
            ctx.fillText(`> ${HAYDUKE_LINES[i]}`, 20, H * 0.5 + i * 18);
            if (haydukeTimer > (i + 1) * 80 - 40) {
              ctx.fillStyle = '#44ff44';
              ctx.fillText('  DONE.', 340, H * 0.5 + i * 18);
              ctx.fillStyle = '#ff4422';
            }
          }

          ctx.shadowBlur = 0;
          ctx.globalAlpha = 1;

          if (haydukeTimer > HAYDUKE_LINES.length * 80 + 60) {
            haydukePhase = 3;
            haydukeTimer = 0;
          }
        }

        // Graffiti phase — HAYDUKE LIVES!
        if (haydukePhase === 3) {
          const grafAlpha = Math.min(1, haydukeTimer / 60);
          ctx.globalAlpha = grafAlpha;

          ctx.save();
          ctx.translate(W / 2, H * 0.4);
          ctx.rotate(-0.08);

          ctx.font = 'bold 42px monospace';
          ctx.fillStyle = '#ff3311';
          ctx.shadowColor = '#ff0000';
          ctx.shadowBlur = 30;
          ctx.textAlign = 'center';
          ctx.fillText('HAYDUKE LIVES!', 0, 0);

          ctx.font = '13px monospace';
          ctx.fillStyle = '#ff8866';
          ctx.shadowBlur = 10;
          ctx.fillText('"Always pull up survey stakes."', 0, 40);

          ctx.restore();
          ctx.textAlign = 'start';
          ctx.shadowBlur = 0;
          ctx.globalAlpha = 1;

          // Subtle spray paint drips
          if (haydukeTimer < 120) {
            for (let i = 0; i < 3; i++) {
              ctx.fillStyle = `rgba(255,50,20,${Math.random() * 0.1})`;
              ctx.fillRect(
                W / 2 - 150 + Math.random() * 300,
                H * 0.4 + Math.random() * 40,
                1, Math.random() * 20
              );
            }
          }
        }
      }

      // ESC hint
      ctx.globalAlpha = 0.2;
      ctx.font = '10px monospace';
      ctx.fillStyle = '#aa8866';
      ctx.fillText('ESC to return', 10, H - 10);
      ctx.globalAlpha = 1;
    };

    let rafId;
    const loop = () => {
      if (exited) return;
      render();
      rafId = requestAnimationFrame(loop);
    };
    loop();

    return () => {
      exited = true;
      cancelAnimationFrame(rafId);
      container.removeEventListener('keydown', onKeyDown);
    };
  }, [exitGameMode, mode]);

  return (
    <div ref={containerRef} className="labyrinth-container" tabIndex={0}>
      <canvas
        ref={canvasRef}
        style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}
      />
    </div>
  );
}
