import { useEffect, useRef } from 'react';
import { useScreensaverDismiss } from './useScreensaverDismiss';

// ── Fish & creature ASCII art ──────────────────────────────────
const FISH = [
  { r: '><(((°>',  l: '<°)))<',   color: '#ff9944', fs: 13 },
  { r: '><>',      l: '<><',       color: '#44ffcc', fs: 11 },
  { r: '><{{{{°>', l: '<°}}}}>< ', color: '#ff44ff', fs: 13 },
  { r: '=>>>~>',   l: '<~<<<=',    color: '#88ff44', fs: 12 },
  { r: '><(°>',    l: '<°)><',     color: '#44aaff', fs: 12 },
  { r: '.·:*><>',  l: '<>*:·.',    color: '#ffff66', fs: 11 },
  { r: '><((((((°>', l: '<°))))))><', color: '#ff6688', fs: 14 },
];

const SHARK_R = ']-·····{><';
const SHARK_L = '><}·····-[';

const WEED_COLORS = ['#1a7a2a', '#22aa44', '#44cc55', '#55dd66'];
const WEED_CHARS  = ['§', '¦', '|', '¡', '¦'];

// Rare submarine easter egg
const SUB_R = ']≡≡≡≡[O';
const SUB_L = 'O]≡≡≡≡[';

export default function AquariumScreensaver() {
  const containerRef = useRef(null);
  const canvasRef = useRef(null);
  useScreensaverDismiss(containerRef);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    canvas.width  = containerRef.current.offsetWidth;
    canvas.height = containerRef.current.offsetHeight;
    const W = canvas.width;
    const H = canvas.height;
    const FLOOR = Math.floor(H * 0.82);

    // ── Seaweed ────────────────────────────────────────────────
    const weedCount = Math.max(6, Math.floor(W / 75));
    const weeds = Array.from({ length: weedCount }, () => ({
      x:      40 + Math.random() * (W - 80),
      segs:   5 + Math.floor(Math.random() * 7),
      color:  WEED_COLORS[Math.floor(Math.random() * WEED_COLORS.length)],
      phase:  Math.random() * Math.PI * 2,
      speed:  0.25 + Math.random() * 0.35,
    }));

    // ── Bubbles ────────────────────────────────────────────────
    const bubbles = [];

    // ── Fish ───────────────────────────────────────────────────
    const fishCount = Math.max(5, Math.floor(W / 90));
    const fish = Array.from({ length: fishCount }, () => {
      const t    = FISH[Math.floor(Math.random() * FISH.length)];
      const goR  = Math.random() < 0.5;
      return {
        ...t,
        x:     Math.random() * W,
        y:     H * 0.1 + Math.random() * (FLOOR - H * 0.18),
        vx:    (0.3 + Math.random() * 0.9) * (goR ? 1 : -1),
        goR,
        phase: Math.random() * Math.PI * 2,
        depth: Math.random(),
      };
    });

    // ── Shark ──────────────────────────────────────────────────
    const shark = {
      x:  -220,
      y:  H * 0.45,
      vx: 0.55,
      goR: true,
      nextAt: 600,
    };

    // ── Jellyfish ──────────────────────────────────────────────
    const JELLY_COLS = ['#cc44ff', '#ff44aa', '#44ccff', '#88ff44'];
    const jellies = Array.from({ length: 3 }, () => ({
      x:     Math.random() * W,
      y:     H * 0.08 + Math.random() * H * 0.35,
      phase: Math.random() * Math.PI * 2,
      r:     12 + Math.random() * 18,
      color: JELLY_COLS[Math.floor(Math.random() * JELLY_COLS.length)],
      vx:    (Math.random() - 0.5) * 0.25,
    }));

    // ── Rare submarine ────────────────────────────────────────
    let sub = null;
    let subTimer = 800 + Math.floor(Math.random() * 1200);

    // ── School of tiny fish ───────────────────────────────────
    const schoolX = Math.random() * W;
    const schoolY = H * 0.3 + Math.random() * H * 0.2;
    const school = Array.from({ length: 10 }, (_, i) => ({
      ox: (Math.random() - 0.5) * 60,
      oy: (Math.random() - 0.5) * 30,
      phase: Math.random() * Math.PI * 2,
    }));
    let schoolVx = 0.6;
    let schoolCx = schoolX;
    let schoolCy = schoolY;

    let time = 0;
    let rafId;

    // ── Background ────────────────────────────────────────────
    const drawBg = () => {
      const grad = ctx.createLinearGradient(0, 0, 0, H);
      grad.addColorStop(0,    '#000820');
      grad.addColorStop(0.55, '#001248');
      grad.addColorStop(FLOOR / H, '#001a5e');
      grad.addColorStop(1,    '#0a1400');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, W, H);

      // Caustic light shafts
      for (let i = 0; i < 7; i++) {
        const bx  = (W / 7) * i + Math.sin(time * 0.008 + i * 1.1) * 25;
        const wid = 10 + Math.sin(time * 0.012 + i) * 6;
        const lg  = ctx.createLinearGradient(bx, 0, bx, H * 0.65);
        lg.addColorStop(0,   `rgba(80,160,255,${0.03 + Math.sin(time * 0.015 + i) * 0.01})`);
        lg.addColorStop(1,   'rgba(80,160,255,0)');
        ctx.fillStyle = lg;
        ctx.beginPath();
        ctx.moveTo(bx - 5,       0);
        ctx.lineTo(bx + wid,     0);
        ctx.lineTo(bx + wid + 50, H * 0.65);
        ctx.lineTo(bx + 25,      H * 0.65);
        ctx.fill();
      }

      // Sandy floor
      const sg = ctx.createLinearGradient(0, FLOOR, 0, H);
      sg.addColorStop(0, '#1a1100');
      sg.addColorStop(1, '#0d0a00');
      ctx.fillStyle = sg;
      ctx.fillRect(0, FLOOR, W, H - FLOOR);

      // Sand ripples
      ctx.strokeStyle = 'rgba(100,75,20,0.25)';
      ctx.lineWidth = 1;
      for (let sx = 0; sx < W; sx += 28) {
        const off = Math.sin(sx * 0.025) * 3;
        ctx.beginPath();
        ctx.moveTo(sx, FLOOR + 6 + off);
        ctx.quadraticCurveTo(sx + 14, FLOOR + 9 + off, sx + 28, FLOOR + 6 + off);
        ctx.stroke();
      }
    };

    // ── Seaweed ───────────────────────────────────────────────
    const drawWeeds = () => {
      ctx.font = '10px monospace';
      for (const w of weeds) {
        for (let s = 0; s < w.segs; s++) {
          const sway  = Math.sin(time * w.speed + w.phase + s * 0.55) * (s * 2.2);
          const wx    = w.x + sway;
          const wy    = FLOOR - s * 10;
          const alpha = 0.35 + (s / w.segs) * 0.65;
          ctx.globalAlpha = alpha;
          ctx.fillStyle   = w.color;
          ctx.fillText(WEED_CHARS[s % WEED_CHARS.length], wx, wy);
        }
      }
      ctx.globalAlpha = 1;
    };

    // ── Bubbles ───────────────────────────────────────────────
    const drawBubbles = () => {
      if (bubbles.length < 60 && Math.random() < 0.35) {
        const w = weeds[Math.floor(Math.random() * weeds.length)];
        bubbles.push({
          x:      w.x + (Math.random() - 0.5) * 8,
          y:      FLOOR - w.segs * 10,
          r:      1 + Math.random() * 2.5,
          vy:     0.4 + Math.random() * 0.6,
          wobble: Math.random() * Math.PI * 2,
        });
      }
      for (let i = bubbles.length - 1; i >= 0; i--) {
        const b = bubbles[i];
        b.y       -= b.vy;
        b.wobble  += 0.04;
        b.x       += Math.sin(b.wobble) * 0.4;
        const alpha = Math.min(1, (b.y / H) * 0.7);
        ctx.strokeStyle = `rgba(140,210,255,${alpha})`;
        ctx.lineWidth   = 0.6;
        ctx.beginPath();
        ctx.arc(b.x, b.y, b.r, 0, Math.PI * 2);
        ctx.stroke();

        // Tiny highlight
        ctx.fillStyle = `rgba(255,255,255,${alpha * 0.4})`;
        ctx.beginPath();
        ctx.arc(b.x - b.r * 0.3, b.y - b.r * 0.3, b.r * 0.3, 0, Math.PI * 2);
        ctx.fill();

        if (b.y < 0) bubbles.splice(i, 1);
      }
    };

    // ── Jellyfish ─────────────────────────────────────────────
    const drawJellies = () => {
      for (const j of jellies) {
        j.x    += j.vx;
        j.phase += 0.018;
        if (j.x > W + 60) j.x = -60;
        if (j.x < -60)    j.x = W + 60;

        const pulse = 0.7 + Math.sin(j.phase) * 0.3;
        const jy    = j.y + Math.sin(j.phase * 0.4) * 18;

        // Bell
        ctx.globalAlpha = 0.55;
        ctx.fillStyle   = j.color;
        ctx.beginPath();
        ctx.ellipse(j.x, jy, j.r * pulse, j.r * 0.55 * pulse, 0, Math.PI, 0);
        ctx.fill();

        // Inner glow
        const ig = ctx.createRadialGradient(j.x, jy - j.r * 0.2, 0, j.x, jy, j.r * pulse);
        ig.addColorStop(0, 'rgba(255,255,255,0.3)');
        ig.addColorStop(1, 'rgba(255,255,255,0)');
        ctx.fillStyle = ig;
        ctx.beginPath();
        ctx.ellipse(j.x, jy, j.r * pulse, j.r * 0.55 * pulse, 0, Math.PI, 0);
        ctx.fill();

        // Tentacles
        ctx.strokeStyle = j.color;
        ctx.lineWidth   = 0.8;
        const tentCount = 7;
        for (let t = 0; t < tentCount; t++) {
          const tx = j.x - j.r * pulse + (t / (tentCount - 1)) * j.r * 2 * pulse;
          ctx.beginPath();
          ctx.moveTo(tx, jy);
          for (let seg = 1; seg <= 6; seg++) {
            const wave = Math.sin(j.phase + seg * 0.4 + t * 0.7) * 5;
            ctx.lineTo(tx + wave, jy + seg * 5);
          }
          ctx.stroke();
        }
        ctx.globalAlpha = 1;
      }
    };

    // ── Fish ──────────────────────────────────────────────────
    const drawFish = () => {
      for (const f of fish) {
        f.x     += f.vx;
        f.phase += 0.025;
        const bob = Math.sin(f.phase) * 1.8;

        if (f.x > W + 120) f.x = -120;
        if (f.x < -120)    f.x = W + 120;

        const art   = f.goR ? f.r : f.l;
        const alpha = 0.45 + f.depth * 0.55;

        ctx.globalAlpha = alpha;
        ctx.font        = `${f.fs}px monospace`;

        // Drop shadow
        ctx.fillStyle = 'rgba(0,0,0,0.3)';
        ctx.fillText(art, f.x + 2, f.y + bob + 2);

        // Fish
        ctx.fillStyle = f.color;
        ctx.fillText(art, f.x, f.y + bob);
      }
      ctx.globalAlpha = 1;
    };

    // ── School of tiny fish ───────────────────────────────────
    const drawSchool = () => {
      schoolCx += schoolVx;
      if (schoolCx > W + 100) { schoolCx = -100; schoolVx = 0.6; }
      if (schoolCx < -100)    { schoolCx = W + 100; schoolVx = -0.6; }
      schoolCy += Math.sin(time * 0.008) * 0.4;

      ctx.font      = '9px monospace';
      ctx.fillStyle = '#aaffdd';
      ctx.globalAlpha = 0.8;
      const art = schoolVx > 0 ? '><>' : '<><';
      for (const s of school) {
        s.phase += 0.03;
        const sx = schoolCx + s.ox + Math.sin(s.phase) * 3;
        const sy = schoolCy + s.oy + Math.sin(s.phase * 0.7) * 2;
        ctx.fillText(art, sx, sy);
      }
      ctx.globalAlpha = 1;
    };

    // ── Shark ─────────────────────────────────────────────────
    const drawShark = () => {
      if (time < shark.nextAt) return;

      shark.x += shark.vx;
      if (shark.x > W + 300) {
        shark.x    = -300;
        shark.y    = H * 0.25 + Math.random() * H * 0.45;
        shark.nextAt = time + 400 + Math.floor(Math.random() * 600);
      }

      ctx.fillStyle   = '#aabbcc';
      ctx.globalAlpha = 0.85;
      ctx.font        = '17px monospace';
      ctx.fillText(shark.goR ? SHARK_R : SHARK_L, shark.x, shark.y);

      // Fin
      ctx.strokeStyle = '#aabbcc';
      ctx.lineWidth   = 1.5;
      const fx = shark.x + (shark.goR ? 30 : 10);
      ctx.beginPath();
      ctx.moveTo(fx, shark.y - 2);
      ctx.lineTo(fx + 5, shark.y - 16);
      ctx.lineTo(fx + 10, shark.y - 2);
      ctx.stroke();

      ctx.globalAlpha = 1;
    };

    // ── Submarine (rare easter egg) ───────────────────────────
    const drawSub = () => {
      subTimer--;
      if (subTimer <= 0 && !sub) {
        const goR = Math.random() < 0.5;
        sub = {
          x:    goR ? -200 : W + 200,
          y:    H * 0.5 + (Math.random() - 0.5) * H * 0.2,
          vx:   goR ? 1.2 : -1.2,
          goR,
          bubbleTimer: 0,
        };
        subTimer = 1500 + Math.floor(Math.random() * 2000);
      }
      if (!sub) return;

      sub.x += sub.vx;
      sub.bubbleTimer--;

      // Periscope bubble trail
      if (sub.bubbleTimer <= 0) {
        sub.bubbleTimer = 8;
        bubbles.push({
          x:      sub.x + (sub.goR ? 80 : 0),
          y:      sub.y - 14,
          r:      2 + Math.random() * 2,
          vy:     0.8 + Math.random() * 0.5,
          wobble: Math.random() * Math.PI * 2,
        });
      }

      ctx.fillStyle   = '#ffcc44';
      ctx.globalAlpha = 0.9;
      ctx.font        = '14px monospace';
      ctx.fillText(sub.goR ? SUB_R : SUB_L, sub.x, sub.y);

      // Porthole lights
      for (let p = 0; p < 3; p++) {
        const px = sub.x + (sub.goR ? 20 + p * 14 : 40 - p * 14);
        ctx.fillStyle   = 'rgba(255,255,150,0.6)';
        ctx.beginPath();
        ctx.arc(px, sub.y - 2, 3, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalAlpha = 1;

      if (sub.x > W + 250 || sub.x < -250) sub = null;
    };

    // ── HUD overlay ───────────────────────────────────────────
    const drawHUD = () => {
      ctx.font      = '9px monospace';
      ctx.fillStyle = 'rgba(80,200,255,0.35)';
      const depth = Math.floor(200 + Math.sin(time * 0.009) * 15);
      const temp  = (3.8 + Math.sin(time * 0.006) * 0.4).toFixed(1);
      ctx.fillText(`DEPTH ${depth}m`, 10, 14);
      ctx.fillText(`TEMP  ${temp}°C`, 10, 25);
      ctx.fillText(`SONAR ACTIVE`, W - 88, 14);
      // Sonar pulse ring
      const pulseR = ((time * 2) % 80);
      const pulseA = Math.max(0, 0.3 - pulseR / 80 * 0.3);
      ctx.strokeStyle = `rgba(80,200,255,${pulseA})`;
      ctx.lineWidth   = 1;
      ctx.beginPath();
      ctx.arc(W - 42, 35, pulseR * 0.4, 0, Math.PI * 2);
      ctx.stroke();
      ctx.fillStyle   = 'rgba(80,200,255,0.5)';
      ctx.beginPath();
      ctx.arc(W - 42, 35, 2, 0, Math.PI * 2);
      ctx.fill();
    };

    // ── Main loop ─────────────────────────────────────────────
    const animate = () => {
      time++;
      drawBg();
      drawWeeds();
      drawBubbles();
      drawJellies();
      drawSchool();
      drawFish();
      drawShark();
      drawSub();
      drawHUD();

      // CRT scanlines
      ctx.fillStyle = 'rgba(0,0,0,0.12)';
      for (let y = 0; y < H; y += 3) ctx.fillRect(0, y, W, 1);

      rafId = requestAnimationFrame(animate);
    };

    animate();
    return () => cancelAnimationFrame(rafId);
  }, []);

  return (
    <div ref={containerRef} className="dvd-screensaver" style={{ background: '#000820' }}>
      <canvas ref={canvasRef} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }} />
      <div className="dvd-hint">press any key or click to exit</div>
    </div>
  );
}
