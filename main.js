// ═══════════════════════════════════════
//  LAYA HOME — V2 Reimagined
//  Advanced GSAP + Lenis + Custom Effects
// ═══════════════════════════════════════

gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);

// ═══ LENIS SMOOTH SCROLL ═══
let lenis;
function initLenis() {
  lenis = new Lenis({
    duration: 1.2,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    orientation: 'vertical',
    smoothWheel: true,
    wheelMultiplier: 1,
    touchMultiplier: 2,
  });

  lenis.on('scroll', ScrollTrigger.update);
  gsap.ticker.add((time) => lenis.raf(time * 1000));
  gsap.ticker.lagSmoothing(0);
}

// ═══ TEXT SCRAMBLE EFFECT ═══
class TextScramble {
  constructor(el) {
    this.el = el;
    this.chars = '!<>-_\\/[]{}—=+*^?#________';
    this.originalText = el.textContent;
    this.isAnimating = false;
  }
  scramble() {
    if (this.isAnimating) return;
    this.isAnimating = true;
    const text = this.originalText;
    const length = text.length;
    let iteration = 0;
    const maxIterations = length * 3;

    const interval = setInterval(() => {
      this.el.textContent = text.split('').map((char, i) => {
        if (char === ' ') return ' ';
        if (i < iteration / 3) return text[i];
        return this.chars[Math.floor(Math.random() * this.chars.length)];
      }).join('');

      iteration++;
      if (iteration >= maxIterations) {
        clearInterval(interval);
        this.el.textContent = text;
        this.isAnimating = false;
      }
    }, 30);
  }
  reset() {
    this.el.textContent = this.originalText;
    this.isAnimating = false;
  }
}

// ═══════════════════════════════════════
//  PAGE LOADER — ISOMETRIC WIREFRAME ROOM
// ═══════════════════════════════════════
function initLoader() {
  const loaderEl = document.getElementById('page-loader');
  const canvas = document.getElementById('loader-canvas');
  const barFill = document.getElementById('loader-bar-fill');
  const pctEl = document.getElementById('loader-pct');

  if (!loaderEl || !canvas) { initAll(); return; }

  const ctx = canvas.getContext('2d');
  const DPR = Math.min(window.devicePixelRatio || 1, 2);

  let W, H, CX, CY, isoScale;
  const COS30 = Math.cos(Math.PI / 6);
  const SIN30 = Math.sin(Math.PI / 6);

  function resize() {
    W = window.innerWidth; H = window.innerHeight;
    canvas.width = W * DPR; canvas.height = H * DPR;
    canvas.style.width = W + 'px'; canvas.style.height = H + 'px';
    ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
    CX = W / 2; CY = H / 2;
    isoScale = Math.min(W, H) * 0.07;
  }
  resize();

  function iso(x, y, z) {
    return {
      x: CX + (x - y) * COS30 * isoScale,
      y: CY + (x + y) * SIN30 * isoScale - z * isoScale
    };
  }

  // ═ State — all progress values 0→1
  const S = {
    grid: 0, floor: 0, walls: 0, window: 0, door: 0,
    table: 0, chair: 0, shelf: 0, lamp: 0, plant: 0,
    picture: 0, rug: 0, dims: 0,
    glow: 0, dissolve: 0, particleAlpha: 0.2
  };

  // Colors
  const BLUE = 'rgba(120,155,180,';
  const GOLD = 'rgba(194,164,126,';

  function colorAt(a, warmth) {
    const r = Math.round(120 + warmth * 74);
    const g = Math.round(155 + warmth * 9);
    const b = Math.round(180 - warmth * 54);
    return `rgba(${r},${g},${b},${a})`;
  }

  // Room dims
  const RW = 7, RD = 5.5, RH = 3.8;

  // Particles
  const particles = [];
  for (let i = 0; i < 50; i++) {
    particles.push({
      x: (Math.random() - 0.5) * RW * 1.5,
      y: (Math.random() - 0.5) * RD * 1.5,
      z: Math.random() * RH,
      speed: 0.002 + Math.random() * 0.004,
      wobble: Math.random() * Math.PI * 2,
      size: 1 + Math.random() * 1.5
    });
  }

  // ═ Drawing helpers
  function line(ax, ay, az, bx, by, bz, progress, alpha, warmth) {
    if (progress <= 0) return;
    const a = iso(ax, ay, az);
    const b = iso(bx, by, bz);
    const p = Math.min(progress, 1);
    const ex = a.x + (b.x - a.x) * p;
    const ey = a.y + (b.y - a.y) * p;

    ctx.beginPath();
    ctx.moveTo(a.x, a.y);
    ctx.lineTo(ex, ey);
    ctx.strokeStyle = colorAt(alpha, warmth || S.glow);
    ctx.lineWidth = 1;
    ctx.stroke();

    // Pen tip glow
    if (p < 0.98 && p > 0.02) {
      ctx.beginPath();
      ctx.arc(ex, ey, 3, 0, Math.PI * 2);
      ctx.fillStyle = colorAt(alpha * 0.6, warmth || S.glow);
      ctx.fill();
      ctx.beginPath();
      ctx.arc(ex, ey, 8, 0, Math.PI * 2);
      ctx.fillStyle = colorAt(alpha * 0.15, warmth || S.glow);
      ctx.fill();
    }
  }

  function lineSeq(segments, progress, alpha) {
    const total = segments.length;
    for (let i = 0; i < total; i++) {
      const segStart = i / total;
      const segEnd = (i + 1) / total;
      const segProgress = Math.max(0, Math.min(1, (progress - segStart) / (segEnd - segStart)));
      if (segProgress > 0) {
        const s = segments[i];
        line(s[0], s[1], s[2], s[3], s[4], s[5], segProgress, alpha);
      }
    }
  }

  // ═ Draw functions
  function drawGrid() {
    if (S.grid <= 0) return;
    const a = S.grid * 0.3;
    ctx.strokeStyle = colorAt(a * 0.15, S.glow);
    ctx.lineWidth = 0.5;
    for (let i = -2; i <= RW + 2; i += 1) {
      const a1 = iso(i, -2, 0);
      const a2 = iso(i, RD + 2, 0);
      ctx.beginPath(); ctx.moveTo(a1.x, a1.y); ctx.lineTo(a2.x, a2.y); ctx.stroke();
    }
    for (let j = -2; j <= RD + 2; j += 1) {
      const b1 = iso(-2, j, 0);
      const b2 = iso(RW + 2, j, 0);
      ctx.beginPath(); ctx.moveTo(b1.x, b1.y); ctx.lineTo(b2.x, b2.y); ctx.stroke();
    }
  }

  function drawFloor() {
    const p = S.floor;
    if (p <= 0) return;
    lineSeq([
      [0, 0, 0, RW, 0, 0],
      [RW, 0, 0, RW, RD, 0],
      [RW, RD, 0, 0, RD, 0],
      [0, RD, 0, 0, 0, 0]
    ], p, 0.7);
    // Floor fill
    if (p > 0.6) {
      const fa = (p - 0.6) / 0.4 * 0.04;
      const c1 = iso(0, 0, 0), c2 = iso(RW, 0, 0), c3 = iso(RW, RD, 0), c4 = iso(0, RD, 0);
      ctx.beginPath(); ctx.moveTo(c1.x, c1.y); ctx.lineTo(c2.x, c2.y);
      ctx.lineTo(c3.x, c3.y); ctx.lineTo(c4.x, c4.y); ctx.closePath();
      ctx.fillStyle = colorAt(fa, S.glow); ctx.fill();
    }
  }

  function drawWalls() {
    const p = S.walls;
    if (p <= 0) return;
    // Right wall (x=RW)
    const rp = Math.min(p * 2, 1);
    line(RW, 0, 0, RW, 0, RH * rp, rp, 0.6);
    line(RW, RD, 0, RW, RD, RH * rp, rp, 0.6);
    if (rp > 0.3) line(RW, 0, RH * rp, RW, RD, RH * rp, (rp - 0.3) / 0.7, 0.5);
    // Right wall fill
    if (rp > 0.6) {
      const fa = (rp - 0.6) / 0.4 * 0.03;
      const c1 = iso(RW, 0, 0), c2 = iso(RW, RD, 0), c3 = iso(RW, RD, RH * rp), c4 = iso(RW, 0, RH * rp);
      ctx.beginPath(); ctx.moveTo(c1.x, c1.y); ctx.lineTo(c2.x, c2.y);
      ctx.lineTo(c3.x, c3.y); ctx.lineTo(c4.x, c4.y); ctx.closePath();
      ctx.fillStyle = colorAt(fa, S.glow); ctx.fill();
    }
    // Left wall (y=RD)
    const lp = Math.min(Math.max(p * 2 - 0.3, 0) / 0.7, 1);
    if (lp > 0) {
      line(0, RD, 0, 0, RD, RH * lp, lp, 0.6);
      if (lp > 0.3) line(0, RD, RH * lp, RW, RD, RH * lp, (lp - 0.3) / 0.7, 0.5);
      // Left wall fill
      if (lp > 0.6) {
        const fa = (lp - 0.6) / 0.4 * 0.03;
        const c1 = iso(0, RD, 0), c2 = iso(RW, RD, 0), c3 = iso(RW, RD, RH * lp), c4 = iso(0, RD, RH * lp);
        ctx.beginPath(); ctx.moveTo(c1.x, c1.y); ctx.lineTo(c2.x, c2.y);
        ctx.lineTo(c3.x, c3.y); ctx.lineTo(c4.x, c4.y); ctx.closePath();
        ctx.fillStyle = colorAt(fa, S.glow); ctx.fill();
      }
    }
  }

  function drawWindow() {
    const p = S.window;
    if (p <= 0) return;
    const wl = 1.5, wr = 4, wb = 1.2, wt = 3;
    // Frame
    lineSeq([
      [RW, wl, wb, RW, wr, wb],
      [RW, wr, wb, RW, wr, wt],
      [RW, wr, wt, RW, wl, wt],
      [RW, wl, wt, RW, wl, wb]
    ], p, 0.6);
    // Mullions
    if (p > 0.5) {
      const mp = (p - 0.5) / 0.5;
      const my = (wl + wr) / 2, mz = (wb + wt) / 2;
      line(RW, my, wb, RW, my, wt, mp, 0.4);
      line(RW, wl, mz, RW, wr, mz, mp, 0.4);
    }
    // Glass glow
    if (p > 0.7) {
      const ga = (p - 0.7) / 0.3 * 0.06;
      const c1 = iso(RW, wl, wb), c2 = iso(RW, wr, wb), c3 = iso(RW, wr, wt), c4 = iso(RW, wl, wt);
      ctx.beginPath(); ctx.moveTo(c1.x, c1.y); ctx.lineTo(c2.x, c2.y);
      ctx.lineTo(c3.x, c3.y); ctx.lineTo(c4.x, c4.y); ctx.closePath();
      ctx.fillStyle = `rgba(180,200,220,${ga})`; ctx.fill();
    }
  }

  function drawDoor() {
    const p = S.door;
    if (p <= 0) return;
    const dl = 0.8, dr = 2.2, dt = 3;
    lineSeq([
      [dl, RD, 0, dr, RD, 0],
      [dr, RD, 0, dr, RD, dt],
      [dr, RD, dt, dl, RD, dt],
      [dl, RD, dt, dl, RD, 0]
    ], p, 0.5);
    // Handle
    if (p > 0.8) {
      const hp = iso(dr - 0.2, RD, dt * 0.45);
      ctx.beginPath();
      ctx.arc(hp.x, hp.y, 3, 0, Math.PI * 2);
      ctx.strokeStyle = colorAt(0.5, S.glow);
      ctx.lineWidth = 1; ctx.stroke();
    }
  }

  function drawRug() {
    const p = S.rug;
    if (p <= 0) return;
    const rx = 1.5, ry = 1.2, rw = 4, rd = 3;
    lineSeq([
      [rx, ry, 0, rx + rw, ry, 0],
      [rx + rw, ry, 0, rx + rw, ry + rd, 0],
      [rx + rw, ry + rd, 0, rx, ry + rd, 0],
      [rx, ry + rd, 0, rx, ry, 0]
    ], p, 0.3);
    // Inner border
    if (p > 0.6) {
      const ip = (p - 0.6) / 0.4;
      const m = 0.3;
      lineSeq([
        [rx + m, ry + m, 0, rx + rw - m, ry + m, 0],
        [rx + rw - m, ry + m, 0, rx + rw - m, ry + rd - m, 0],
        [rx + rw - m, ry + rd - m, 0, rx + m, ry + rd - m, 0],
        [rx + m, ry + rd - m, 0, rx + m, ry + m, 0]
      ], ip, 0.2);
    }
  }

  function drawTable() {
    const p = S.table;
    if (p <= 0) return;
    const tx = 2.5, ty = 2, tw = 2.2, td = 1.4, th = 1.1, legH = th;
    // Top
    lineSeq([
      [tx, ty, th, tx + tw, ty, th],
      [tx + tw, ty, th, tx + tw, ty + td, th],
      [tx + tw, ty + td, th, tx, ty + td, th],
      [tx, ty + td, th, tx, ty, th]
    ], Math.min(p * 1.5, 1), 0.6);
    // Legs
    if (p > 0.3) {
      const lp = (p - 0.3) / 0.7;
      line(tx + 0.15, ty + 0.15, th, tx + 0.15, ty + 0.15, 0, lp, 0.4);
      line(tx + tw - 0.15, ty + 0.15, th, tx + tw - 0.15, ty + 0.15, 0, lp, 0.4);
      line(tx + tw - 0.15, ty + td - 0.15, th, tx + tw - 0.15, ty + td - 0.15, 0, lp, 0.4);
      line(tx + 0.15, ty + td - 0.15, th, tx + 0.15, ty + td - 0.15, 0, lp, 0.4);
    }
    // Laptop on table
    if (p > 0.7) {
      const lpp = (p - 0.7) / 0.3;
      const lx = tx + 0.5, ly = ty + 0.3;
      lineSeq([
        [lx, ly, th + 0.01, lx + 1, ly, th + 0.01],
        [lx + 1, ly, th + 0.01, lx + 1, ly + 0.7, th + 0.01],
        [lx + 1, ly + 0.7, th + 0.01, lx, ly + 0.7, th + 0.01],
        [lx, ly + 0.7, th + 0.01, lx, ly, th + 0.01]
      ], lpp, 0.35);
    }
  }

  function drawChair(cx, cy, flip) {
    const p = S.chair;
    if (p <= 0) return;
    const cw = 0.7, cd = 0.7, ch = 0.7, bh = 1.5;
    // Seat
    lineSeq([
      [cx, cy, ch, cx + cw, cy, ch],
      [cx + cw, cy, ch, cx + cw, cy + cd, ch],
      [cx + cw, cy + cd, ch, cx, cy + cd, ch],
      [cx, cy + cd, ch, cx, cy, ch]
    ], Math.min(p * 1.4, 1), 0.5);
    // Legs
    if (p > 0.2) {
      const lp = (p - 0.2) / 0.8;
      line(cx, cy, ch, cx, cy, 0, lp, 0.35);
      line(cx + cw, cy, ch, cx + cw, cy, 0, lp, 0.35);
      line(cx + cw, cy + cd, ch, cx + cw, cy + cd, 0, lp, 0.35);
      line(cx, cy + cd, ch, cx, cy + cd, 0, lp, 0.35);
    }
    // Backrest
    if (p > 0.5) {
      const bp = (p - 0.5) / 0.5;
      const bx = flip ? cx + cw : cx;
      line(bx, cy, ch, bx, cy, bh, bp, 0.5);
      line(bx, cy + cd, ch, bx, cy + cd, bh, bp, 0.5);
      if (bp > 0.5) line(bx, cy, bh, bx, cy + cd, bh, (bp - 0.5) / 0.5, 0.45);
    }
  }

  function drawShelf() {
    const p = S.shelf;
    if (p <= 0) return;
    const sx = 5.8, sy = RD - 0.05, sw = 1, sd = 0.4, sh = 3, shelves = 5;
    // Verticals
    line(sx, sy, 0, sx, sy, sh * Math.min(p * 1.3, 1), Math.min(p * 1.3, 1), 0.5);
    line(sx + sw, sy, 0, sx + sw, sy, sh * Math.min(p * 1.3, 1), Math.min(p * 1.3, 1), 0.5);
    // Shelves
    if (p > 0.2) {
      const sp = (p - 0.2) / 0.8;
      for (let i = 0; i <= shelves; i++) {
        const sz = (sh / shelves) * i;
        const ip = Math.min(Math.max(sp * (shelves + 1) - i, 0), 1);
        if (ip > 0) {
          line(sx, sy, sz, sx + sw, sy, sz, ip, 0.4);
          line(sx, sy - sd, sz, sx + sw, sy - sd, sz, ip, 0.25);
          line(sx, sy, sz, sx, sy - sd, sz, ip, 0.25);
          line(sx + sw, sy, sz, sx + sw, sy - sd, sz, ip, 0.25);
        }
      }
    }
    // Books (small rectangles on shelves)
    if (p > 0.6) {
      const bp = (p - 0.6) / 0.4;
      for (let i = 1; i <= 3; i++) {
        const bz = (sh / shelves) * i;
        const numBooks = 3 + Math.floor(Math.random() * 0.1); // deterministic
        for (let j = 0; j < numBooks; j++) {
          const bx = sx + 0.1 + j * 0.3;
          const bh2 = 0.3 + (j % 2) * 0.15;
          const segP = Math.min(bp * 3 - i * 0.3, 1);
          if (segP > 0) {
            line(bx, sy - 0.02, bz, bx, sy - 0.02, bz + bh2, segP, 0.25);
            if (segP > 0.5) line(bx + 0.15, sy - 0.02, bz, bx + 0.15, sy - 0.02, bz + bh2, (segP - 0.5) * 2, 0.2);
          }
        }
      }
    }
  }

  function drawLamp() {
    const p = S.lamp;
    if (p <= 0) return;
    const lx = 0.8, ly = 1, lh = 2.5;
    // Base ellipse
    if (p > 0) {
      const bp = iso(lx, ly, 0);
      ctx.beginPath();
      ctx.ellipse(bp.x, bp.y, 8 * Math.min(p * 2, 1), 4 * Math.min(p * 2, 1), -Math.PI / 6, 0, Math.PI * 2);
      ctx.strokeStyle = colorAt(0.4, S.glow);
      ctx.lineWidth = 1; ctx.stroke();
    }
    // Pole
    if (p > 0.15) line(lx, ly, 0, lx, ly, lh * Math.min((p - 0.15) / 0.5, 1), Math.min((p - 0.15) / 0.5, 1), 0.5);
    // Shade cone
    if (p > 0.5) {
      const sp = (p - 0.5) / 0.5;
      const t = iso(lx, ly, lh);
      const r = 18 * sp;
      ctx.beginPath();
      ctx.ellipse(t.x, t.y + 12, r, r * 0.4, 0, 0, Math.PI * 2);
      ctx.strokeStyle = colorAt(0.45 * sp, S.glow);
      ctx.lineWidth = 1; ctx.stroke();
      // Glow
      if (sp > 0.5) {
        const grad = ctx.createRadialGradient(t.x, t.y + 20, 0, t.x, t.y + 20, 60);
        grad.addColorStop(0, colorAt(0.08 * sp, S.glow));
        grad.addColorStop(1, 'transparent');
        ctx.fillStyle = grad;
        ctx.fillRect(t.x - 60, t.y - 40, 120, 120);
      }
    }
  }

  function drawPlant() {
    const p = S.plant;
    if (p <= 0) return;
    const px = 6.2, py = 0.6, ph = 0.5;
    // Pot
    lineSeq([
      [px - 0.25, py - 0.2, 0, px + 0.25, py - 0.2, 0],
      [px + 0.25, py - 0.2, 0, px + 0.2, py + 0.2, ph],
      [px - 0.2, py + 0.2, ph, px - 0.25, py - 0.2, 0]
    ], Math.min(p * 2, 1), 0.4);
    line(px + 0.2, py + 0.2, ph, px - 0.2, py + 0.2, ph, Math.min(p * 2, 1), 0.4);
    // Stems + leaves
    if (p > 0.4) {
      const sp = (p - 0.4) / 0.6;
      const stems = [
        { dx: 0, dy: 0, h: 1.2, curve: 0.3 },
        { dx: 0.15, dy: -0.1, h: 0.9, curve: -0.2 },
        { dx: -0.1, dy: 0.1, h: 1, curve: 0.15 },
        { dx: 0.08, dy: 0.12, h: 0.7, curve: -0.25 }
      ];
      stems.forEach((stem, i) => {
        const ssp = Math.min(Math.max(sp * 4 - i * 0.5, 0), 1);
        if (ssp > 0) {
          line(px + stem.dx, py + stem.dy, ph, px + stem.dx + stem.curve * ssp, py + stem.dy, ph + stem.h * ssp, ssp, 0.35);
        }
      });
    }
  }

  function drawPicture() {
    const p = S.picture;
    if (p <= 0) return;
    const fx = RW, fy1 = RD - 1.5, fy2 = RD - 3.5, fz1 = 1.8, fz2 = 3;
    lineSeq([
      [fx, fy1, fz1, fx, fy2, fz1],
      [fx, fy2, fz1, fx, fy2, fz2],
      [fx, fy2, fz2, fx, fy1, fz2],
      [fx, fy1, fz2, fx, fy1, fz1]
    ], p, 0.4);
    // Inner
    if (p > 0.6) {
      const ip = (p - 0.6) / 0.4;
      const m = 0.2;
      lineSeq([
        [fx, fy1 - m, fz1 + m, fx, fy2 + m, fz1 + m],
        [fx, fy2 + m, fz1 + m, fx, fy2 + m, fz2 - m],
        [fx, fy2 + m, fz2 - m, fx, fy1 - m, fz2 - m],
        [fx, fy1 - m, fz2 - m, fx, fy1 - m, fz1 + m]
      ], ip, 0.25);
    }
  }

  function drawDimensions() {
    const p = S.dims;
    if (p <= 0) return;
    ctx.setLineDash([4, 4]);
    // Width dimension
    const d1a = iso(0, -0.8, 0), d1b = iso(RW, -0.8, 0);
    const dp1 = Math.min(p * 2, 1);
    ctx.beginPath();
    ctx.moveTo(d1a.x, d1a.y);
    ctx.lineTo(d1a.x + (d1b.x - d1a.x) * dp1, d1a.y + (d1b.y - d1a.y) * dp1);
    ctx.strokeStyle = colorAt(0.3, S.glow);
    ctx.lineWidth = 0.8; ctx.stroke();

    // Height dimension
    const d2a = iso(-0.8, 0, 0), d2b = iso(-0.8, 0, RH);
    const dp2 = Math.min(Math.max(p * 2 - 0.3, 0) / 0.7, 1);
    ctx.beginPath();
    ctx.moveTo(d2a.x, d2a.y);
    ctx.lineTo(d2a.x + (d2b.x - d2a.x) * dp2, d2a.y + (d2b.y - d2a.y) * dp2);
    ctx.strokeStyle = colorAt(0.3, S.glow);
    ctx.stroke();
    ctx.setLineDash([]);

    // Labels
    if (p > 0.6) {
      const la = (p - 0.6) / 0.4;
      ctx.font = `${10}px Montserrat, sans-serif`;
      ctx.fillStyle = colorAt(0.3 * la, S.glow);
      ctx.textAlign = 'center';
      const lp1 = iso(RW / 2, -1.3, 0);
      ctx.fillText('7 000 mm', lp1.x, lp1.y);
      const lp2 = iso(-1.5, 0, RH / 2);
      ctx.save();
      ctx.translate(lp2.x, lp2.y);
      ctx.rotate(-Math.PI / 2);
      ctx.fillText('3 800 mm', 0, 0);
      ctx.restore();
    }

    // Corner crosses
    if (p > 0.3) {
      const cp = (p - 0.3) / 0.7;
      const corners = [[0, 0, 0], [RW, 0, 0], [RW, RD, 0], [0, RD, 0]];
      corners.forEach(c => {
        const pt = iso(c[0], c[1], c[2]);
        const s = 5 * cp;
        ctx.beginPath();
        ctx.moveTo(pt.x - s, pt.y); ctx.lineTo(pt.x + s, pt.y);
        ctx.moveTo(pt.x, pt.y - s); ctx.lineTo(pt.x, pt.y + s);
        ctx.strokeStyle = colorAt(0.35 * cp, S.glow);
        ctx.lineWidth = 1; ctx.stroke();
      });
    }
  }

  function drawGlow() {
    if (S.glow <= 0) return;
    // Window light beam
    const wCenter = iso(RW, 2.75, 2.1);
    const floorTarget = iso(RW - 3, 2.75, 0);
    const grad = ctx.createRadialGradient(wCenter.x, wCenter.y, 0, wCenter.x, wCenter.y, 200 * S.glow);
    grad.addColorStop(0, `rgba(194,164,126,${0.08 * S.glow})`);
    grad.addColorStop(1, 'transparent');
    ctx.fillStyle = grad;
    ctx.fillRect(wCenter.x - 200, wCenter.y - 200, 400, 400);

    // Light cone on floor
    if (S.glow > 0.3) {
      const cp = (S.glow - 0.3) / 0.7;
      const p1 = iso(RW, 1.5, 1.2);
      const p2 = iso(RW, 4, 1.2);
      const p3 = iso(RW - 3, 4.5, 0);
      const p4 = iso(RW - 3, 1, 0);
      ctx.beginPath();
      ctx.moveTo(p1.x, p1.y); ctx.lineTo(p2.x, p2.y);
      ctx.lineTo(p3.x, p3.y); ctx.lineTo(p4.x, p4.y);
      ctx.closePath();
      ctx.fillStyle = `rgba(194,164,126,${0.025 * cp})`;
      ctx.fill();
    }
  }

  function drawParticles() {
    particles.forEach(p => {
      p.z += p.speed;
      p.wobble += 0.01;
      if (p.z > RH + 1) { p.z = -0.5; p.x = (Math.random() - 0.5) * RW * 1.5; }
      const wx = p.x + Math.sin(p.wobble) * 0.3;
      const pt = iso(wx, p.y, p.z);
      if (pt.x < 0 || pt.x > W || pt.y < 0 || pt.y > H) return;
      ctx.beginPath();
      ctx.arc(pt.x, pt.y, p.size, 0, Math.PI * 2);
      ctx.fillStyle = colorAt(S.particleAlpha * 0.3, S.glow);
      ctx.fill();
    });
  }

  // ═ Main render loop
  let running = true;
  function render() {
    if (!running) return;
    ctx.clearRect(0, 0, W, H);

    // Apply dissolve
    if (S.dissolve > 0) {
      ctx.globalAlpha = 1 - S.dissolve;
    }

    drawGrid();
    drawFloor();
    drawWalls();
    drawWindow();
    drawDoor();
    drawRug();
    drawGlow();
    drawTable();
    drawChair(2.0, 1.6, false);
    drawChair(4.0, 3.2, true);
    drawShelf();
    drawLamp();
    drawPlant();
    drawPicture();
    drawDimensions();
    drawParticles();

    ctx.globalAlpha = 1;
    requestAnimationFrame(render);
  }

  // ═ GSAP Timeline
  const tl = gsap.timeline({
    onUpdate: function () {
      const p = Math.round(tl.progress() * 100);
      if (barFill) barFill.style.width = p + '%';
      if (pctEl) pctEl.textContent = p + '%';
    },
    onComplete: function () {
      // Fade out loader → reveal main site
      gsap.to(loaderEl, {
        opacity: 0, duration: 0.6, ease: 'power2.inOut',
        onComplete: function () {
          loaderEl.style.display = 'none';
          running = false;
          initAll();
        }
      });
    }
  });

  // Phase 1 — Grid + Floor
  tl.to(S, { grid: 1, duration: 0.8, ease: 'power2.out' }, 0)
    .to(S, { floor: 1, duration: 1, ease: 'power2.out' }, 0.2);
  // Phase 2 — Walls
  tl.to(S, { walls: 1, duration: 1.2, ease: 'power2.out' }, 0.7);
  // Phase 3 — Window + Door
  tl.to(S, { window: 1, duration: 0.8, ease: 'power2.out' }, 1.6)
    .to(S, { door: 1, duration: 0.6, ease: 'power2.out' }, 1.8);
  // Phase 4 — Furniture
  tl.to(S, { rug: 1, duration: 0.6, ease: 'power2.out' }, 2.2)
    .to(S, { table: 1, duration: 0.8, ease: 'power2.out' }, 2.4)
    .to(S, { chair: 1, duration: 0.7, ease: 'power2.out' }, 2.7)
    .to(S, { shelf: 1, duration: 0.8, ease: 'power2.out' }, 2.9)
    .to(S, { lamp: 1, duration: 0.7, ease: 'power2.out' }, 3.1)
    .to(S, { plant: 1, duration: 0.5, ease: 'power2.out' }, 3.3)
    .to(S, { picture: 1, duration: 0.5, ease: 'power2.out' }, 3.4);
  // Phase 5 — Dimensions
  tl.to(S, { dims: 1, duration: 0.7, ease: 'power2.out' }, 3.3);
  // Phase 6 — Golden light
  tl.to(S, { glow: 1, duration: 1, ease: 'power2.inOut' }, 3.6)
    .to(S, { particleAlpha: 0.8, duration: 0.8 }, 3.6);
  // Phase 7 — Dissolve
  tl.to(S, { dissolve: 1, duration: 0.8, ease: 'power2.in' }, 4.6);

  // Start
  render();
  window.addEventListener('resize', resize);
}

// ═══ SCROLL PROGRESS ═══
function initScrollProgress() {
  const bar = document.querySelector('.scroll-progress');
  if (!bar) return;
  gsap.to(bar, {
    scaleX: 1, ease: 'none',
    scrollTrigger: {
      trigger: document.body, start: 'top top',
      end: 'bottom bottom', scrub: 0.3
    }
  });
}

// ═══ HEADER — THEME DETECTION + SCRAMBLE ═══
function initHeader() {
  const header = document.getElementById('site-header');
  if (!header) return;

  const sections = document.querySelectorAll('section[data-theme]');

  // Text scramble on nav hover
  const navLinks = document.querySelectorAll('.header-nav a');
  navLinks.forEach(link => {
    const scrambler = new TextScramble(link);
    link.addEventListener('mouseenter', () => scrambler.scramble());
  });

  const onScroll = () => {
    const scrollY = window.scrollY;
    const isScrolled = scrollY > 60;
    header.classList.toggle('header-scrolled', isScrolled);

    let currentTheme = 'dark';
    sections.forEach(section => {
      const rect = section.getBoundingClientRect();
      if (rect.top <= header.offsetHeight && rect.bottom > header.offsetHeight) {
        currentTheme = section.dataset.theme || 'dark';
      }
    });

    if (isScrolled) {
      header.classList.toggle('header-light', currentTheme === 'light');
    } else {
      header.classList.remove('header-light');
    }
  };

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // Smooth scroll nav links
  document.querySelectorAll('.header-nav a[href^="#"], .mobile-nav a[href^="#"]').forEach(a => {
    a.addEventListener('click', function(e) {
      const href = this.getAttribute('href');
      if (href && href.startsWith('#') && href.length > 1) {
        const target = document.querySelector(href);
        if (target) {
          e.preventDefault();
          if (lenis) {
            lenis.scrollTo(target, { duration: 1.5 });
          } else {
            gsap.to(window, { duration: 1.2, scrollTo: { y: target }, ease: 'power2.inOut' });
          }
        }
      }
    });
  });

  // Logo click
  const logoLink = document.querySelector('.logo-link');
  if (logoLink) {
    logoLink.addEventListener('click', function(e) {
      e.preventDefault();
      if (lenis) { lenis.scrollTo(0, { duration: 1.5 }); }
      else { gsap.to(window, { duration: 1.2, scrollTo: 0, ease: 'power2.inOut' }); }
    });
  }
}

// ═══ MOBILE MENU ═══
function initMobileMenu() {
  const toggle = document.querySelector('.mobile-menu-toggle');
  const overlay = document.querySelector('.mobile-menu-overlay');
  if (!toggle || !overlay) return;

  toggle.addEventListener('click', () => {
    const isActive = toggle.classList.toggle('active');
    overlay.classList.toggle('active');
    document.body.style.overflow = isActive ? 'hidden' : '';
    if (lenis) isActive ? lenis.stop() : lenis.start();
  });

  document.querySelectorAll('.mobile-nav a').forEach(link => {
    link.addEventListener('click', () => {
      toggle.classList.remove('active');
      overlay.classList.remove('active');
      document.body.style.overflow = '';
      if (lenis) lenis.start();
    });
  });
}

// ═══ HERO — SPLIT TEXT + SLIDESHOW ═══
function initHero() {
  const heroSection = document.querySelector('.hero-section');
  if (!heroSection) return;

  const images = gsap.utils.toArray('.hero-image');
  const btnWrap = document.querySelector('.hero-btn-wrap');
  const heroCounter = document.querySelector('.hero-counter');
  const counterCurrent = heroCounter?.querySelector('.current');
  const counterTotal = heroCounter?.querySelector('.total');
  const lineInners = gsap.utils.toArray('.hero-title .line-inner');

  // Initialize images
  if (images.length > 0) {
    gsap.set(images[0], { opacity: 1, scale: 1, zIndex: 1 });
    images[0].classList.add('hero-image-active');
    gsap.set(images.slice(1), { opacity: 0, scale: 1.05, zIndex: 0 });
    if (counterTotal) counterTotal.textContent = String(images.length).padStart(2, '0');
  }

  // Master intro timeline
  const introTl = gsap.timeline({ delay: 0.3 });

  // 1) Split text line reveal
  lineInners.forEach((inner, i) => {
    introTl.to(inner, {
      y: 0, duration: 1.1,
      ease: 'power3.out',
    }, 0.12 * i);
  });

  // 2) Portfolio button (centered)
  if (btnWrap) {
    introTl.to(btnWrap, { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out' }, 0.7);
  }

  // 3) Counter
  if (heroCounter) {
    introTl.to(heroCounter, { opacity: 1, duration: 0.6 }, 0.5);
  }

  // 4) Ken Burns on first image
  if (images.length > 0) {
    introTl.to(images[0], { scale: 1.08, duration: 5, ease: 'none' }, 0);
  }

  // Slideshow
  if (images.length > 1) {
    let currentIndex = 0;
    const SLIDE_DURATION = 5000;

    function switchImage() {
      const prevIndex = currentIndex;
      currentIndex = (currentIndex + 1) % images.length;
      const prevImg = images[prevIndex];
      const nextImg = images[currentIndex];

      if (counterCurrent) counterCurrent.textContent = String(currentIndex + 1).padStart(2, '0');

      gsap.set(nextImg, { opacity: 0, scale: 1, zIndex: 1 });
      const tl = gsap.timeline();
      tl.to(nextImg, { opacity: 1, duration: 1.2, ease: 'power2.inOut' }, 0)
        .to(prevImg, { opacity: 0, duration: 1.2, ease: 'power2.inOut' }, 0)
        .to(nextImg, { scale: 1.08, duration: 5, ease: 'none' }, 0);

      prevImg.classList.remove('hero-image-active');
      nextImg.classList.add('hero-image-active');
      tl.set(prevImg, { zIndex: 0, scale: 1.05 });
    }

    let interval = setInterval(switchImage, SLIDE_DURATION);
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) clearInterval(interval);
      else interval = setInterval(switchImage, SLIDE_DURATION);
    });
  }

  // Hero parallax on scroll
  if (images.length > 0 && window.innerWidth > 768) {
    gsap.to('.hero-image-stack', {
      yPercent: 15,
      ease: 'none',
      scrollTrigger: {
        trigger: heroSection,
        start: 'top top',
        end: 'bottom top',
        scrub: 1
      }
    });
  }
}

// ═══ SCROLL INDICATOR ═══
function initScrollIndicator() {
  let scrolled = false;
  const check = () => {
    const s = window.scrollY > 50;
    if (s !== scrolled) { scrolled = s; document.body.classList.toggle('scrolled', s); }
  };
  window.addEventListener('scroll', check, { passive: true });
  check();
}

// ═══ ABOUT — CLIP-PATH REVEAL ═══
function initAbout() {
  const section = document.querySelector('.about-section');
  if (!section) return;

  const clipEl = document.querySelector('.about-portrait-clip');
  const portrait = document.querySelector('.about-portrait');
  const frame = document.querySelector('.about-frame');
  const textCol = document.querySelector('.about-text-col');

  // Clip-path reveal animation
  if (clipEl) {
    gsap.to(clipEl, {
      clipPath: 'inset(0% 0 0 0)',
      duration: 1.4,
      ease: 'power3.inOut',
      scrollTrigger: {
        trigger: section,
        start: 'top 60%',
        toggleActions: 'play none none reverse'
      },
      onComplete: () => clipEl.classList.add('revealed')
    });

    if (portrait) {
      gsap.to(portrait, {
        scale: 1, duration: 1.6, ease: 'power2.out',
        scrollTrigger: {
          trigger: section,
          start: 'top 60%',
          toggleActions: 'play none none reverse'
        }
      });
    }
  }

  if (frame) {
    gsap.to(frame, {
      opacity: 0.3, duration: 0.8, delay: 0.6,
      scrollTrigger: {
        trigger: section,
        start: 'top 60%',
        toggleActions: 'play none none reverse'
      }
    });
  }

  if (textCol) {
    const label = textCol.querySelector('.section-label');
    const headingEl = textCol.querySelector('.about-heading');
    const paragraphs = gsap.utils.toArray('.about-text p', textCol);

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: section,
        start: 'top 55%',
        toggleActions: 'play none none reverse'
      }
    });

    if (label) {
      gsap.set(label, { opacity: 0, x: -20 });
      tl.to(label, { opacity: 1, x: 0, duration: 0.6, ease: 'power2.out' });
    }
    if (headingEl) {
      gsap.set(headingEl, { opacity: 0, y: 30 });
      tl.to(headingEl, { opacity: 1, y: 0, duration: 0.8, ease: 'power2.out' }, '-=0.3');
    }
    if (paragraphs.length) {
      gsap.set(paragraphs, { opacity: 0, y: 20 });
      tl.to(paragraphs, { opacity: 1, y: 0, duration: 0.6, stagger: 0.12, ease: 'power2.out' }, '-=0.4');
    }
  }

  if (portrait && window.innerWidth > 992) {
    gsap.to(portrait, {
      yPercent: -10,
      ease: 'none',
      scrollTrigger: {
        trigger: section,
        start: 'top bottom',
        end: 'bottom top',
        scrub: 1.5
      }
    });
  }
}

// ═══ HORIZONTAL SCROLL — SERVICES ═══
function initHorizontalScroll() {
  if (window.innerWidth <= 992) return;

  const trigger = document.querySelector('.horizontal-trigger');
  const container = document.querySelector('.horizontal-container');
  const track = document.querySelector('.horizontal-track');
  const dots = gsap.utils.toArray('.hs-dot');
  const cards = gsap.utils.toArray('.hs-card');

  if (!trigger || !track) return;

  const totalWidth = track.scrollWidth;
  const viewportWidth = window.innerWidth;
  const scrollDistance = totalWidth - viewportWidth;

  // Extra buffer so last card is fully visible before unpin
  const endValue = scrollDistance + viewportWidth * 0.5;

  // Set trigger height to match
  trigger.style.height = (endValue + window.innerHeight) + 'px';

  gsap.to(track, {
    x: -scrollDistance,
    ease: 'none',
    scrollTrigger: {
      trigger: trigger,
      start: 'top top',
      end: `+=${endValue}`,
      pin: container,
      scrub: 1,
      invalidateOnRefresh: true,
      onUpdate: (self) => {
        const progress = self.progress;
        // Map progress to panels (last 20% is buffer padding)
        const adjustedProgress = Math.min(progress / 0.8, 1);
        const panelCount = dots.length;
        const activeIndex = Math.min(Math.floor(adjustedProgress * panelCount), panelCount - 1);
        dots.forEach((dot, i) => dot.classList.toggle('active', i === activeIndex));
      }
    }
  });

  // 3D tilt on service cards
  if (window.innerWidth > 768) {
    cards.forEach(card => {
      card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width - 0.5;
        const y = (e.clientY - rect.top) / rect.height - 0.5;
        gsap.to(card, {
          rotateY: x * 8,
          rotateX: -y * 6,
          duration: 0.4,
          ease: 'power2.out',
          transformPerspective: 1000
        });
      });
      card.addEventListener('mouseleave', () => {
        gsap.to(card, {
          rotateY: 0, rotateX: 0,
          duration: 0.6, ease: 'power2.out'
        });
      });
    });
  }
}

// ═══ STACKING CARDS — PROCESS ═══
function initStackingCards() {
  const cards = gsap.utils.toArray('.stack-card');
  if (cards.length === 0) return;

  cards.forEach((card, i) => {
    gsap.from(card, {
      opacity: 0,
      y: 60,
      duration: 0.8,
      ease: 'power2.out',
      scrollTrigger: {
        trigger: card,
        start: 'top 80%',
        toggleActions: 'play none none reverse'
      }
    });

    if (i < cards.length - 1) {
      gsap.to(card, {
        scale: 0.95,
        opacity: 0.6,
        scrollTrigger: {
          trigger: cards[i + 1],
          start: 'top 80%',
          end: 'top 40%',
          scrub: true
        }
      });
    }
  });
}

// ═══ SHOWCASE — PINNED PORTFOLIO ═══
function initShowcase() {
  if (window.innerWidth <= 992) {
    initShowcaseMobile();
    return;
  }

  const trigger = document.querySelector('.showcase-trigger');
  const sticky = document.querySelector('.showcase-sticky');
  const items = gsap.utils.toArray('.showcase-item');
  const images = gsap.utils.toArray('.showcase-image');

  if (!trigger || items.length === 0) return;

  items[0].classList.add('active');
  if (images[0]) images[0].classList.add('active');

  ScrollTrigger.create({
    trigger: trigger,
    start: 'top top',
    end: 'bottom bottom',
    pin: sticky,
    onUpdate: (self) => {
      const progress = self.progress;
      const activeIndex = Math.min(Math.floor(progress * items.length), items.length - 1);

      items.forEach((item, i) => {
        item.classList.toggle('active', i === activeIndex);
      });
      images.forEach((img, i) => {
        img.classList.toggle('active', i === activeIndex);
      });
    }
  });

  // Click handlers for modal
  items.forEach(item => {
    item.addEventListener('click', (e) => {
      e.preventDefault();
      const idx = parseInt(item.dataset.index);
      openProjectModal(idx);
    });
  });
}

function initShowcaseMobile() {
  const items = gsap.utils.toArray('.showcase-item');
  const images = gsap.utils.toArray('.showcase-image');
  if (items.length === 0) return;

  if (images[0]) images[0].classList.add('active');
  items[0].classList.add('active');

  // Click handlers for modal on mobile too
  items.forEach(item => {
    item.addEventListener('click', (e) => {
      e.preventDefault();
      const idx = parseInt(item.dataset.index);
      openProjectModal(idx);
    });
  });
}

// ═══ PROJECT MODAL ═══
function initProjectModal() {
  const modal = document.getElementById('project-modal');
  if (!modal) return;

  const backdrop = modal.querySelector('.project-modal-backdrop');
  const closeBtn = modal.querySelector('.project-modal-close');
  const prevBtn = modal.querySelector('.project-modal-prev');
  const nextBtn = modal.querySelector('.project-modal-next');

  const close = () => {
    modal.classList.remove('active');
    document.body.style.overflow = '';
    if (lenis) lenis.start();
  };

  if (backdrop) backdrop.addEventListener('click', close);
  if (closeBtn) closeBtn.addEventListener('click', close);

  if (prevBtn) prevBtn.addEventListener('click', () => navigateProjectModal(-1));
  if (nextBtn) nextBtn.addEventListener('click', () => navigateProjectModal(1));

  // Keyboard
  document.addEventListener('keydown', (e) => {
    if (!modal.classList.contains('active')) return;
    if (e.key === 'Escape') close();
    if (e.key === 'ArrowLeft') navigateProjectModal(-1);
    if (e.key === 'ArrowRight') navigateProjectModal(1);
  });
}

let currentModalIndex = 0;
const showcaseProjects = [];

function buildShowcaseProjects() {
  const items = document.querySelectorAll('.showcase-item[data-project]');
  items.forEach(item => {
    showcaseProjects.push({
      image: item.dataset.project,
      title: item.dataset.title || ''
    });
  });
}

function openProjectModal(index) {
  if (showcaseProjects.length === 0) buildShowcaseProjects();

  const modal = document.getElementById('project-modal');
  if (!modal || index < 0 || index >= showcaseProjects.length) return;

  currentModalIndex = index;
  updateModalContent();

  modal.classList.add('active');
  document.body.style.overflow = 'hidden';
  if (lenis) lenis.stop();
}

function updateModalContent() {
  const modal = document.getElementById('project-modal');
  if (!modal) return;

  const project = showcaseProjects[currentModalIndex];
  const img = modal.querySelector('.project-modal-image');
  const title = modal.querySelector('.project-modal-title');
  const current = modal.querySelector('.project-modal-counter .current');
  const total = modal.querySelector('.project-modal-counter .total');

  if (img) { img.src = project.image; img.alt = project.title; }
  if (title) title.textContent = project.title;
  if (current) current.textContent = String(currentModalIndex + 1).padStart(2, '0');
  if (total) total.textContent = String(showcaseProjects.length).padStart(2, '0');
}

function navigateProjectModal(direction) {
  const newIndex = currentModalIndex + direction;
  if (newIndex < 0 || newIndex >= showcaseProjects.length) return;
  currentModalIndex = newIndex;

  // Animate transition
  const modal = document.getElementById('project-modal');
  const img = modal?.querySelector('.project-modal-image');
  if (img) {
    gsap.to(img, {
      opacity: 0, x: direction * -30, duration: 0.2, ease: 'power2.in',
      onComplete: () => {
        updateModalContent();
        gsap.fromTo(img,
          { opacity: 0, x: direction * 30 },
          { opacity: 1, x: 0, duration: 0.3, ease: 'power2.out' }
        );
      }
    });
  }
}

// ═══ CONTACT SECTION ═══
function initContact() {
  const section = document.querySelector('.contact-section');
  if (!section) return;

  const leftCol = section.querySelector('.contact-left');
  const formContainer = section.querySelector('.contact-form-container');

  if (leftCol) {
    const heading = leftCol.querySelector('.contact-heading');
    const subtext = leftCol.querySelector('.contact-subtext');

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: section,
        start: 'top 60%',
        toggleActions: 'play none none reverse'
      }
    });

    if (heading) {
      gsap.set(heading, { opacity: 0, y: 40 });
      tl.to(heading, { opacity: 1, y: 0, duration: 0.9, ease: 'power3.out' });
    }
    if (subtext) {
      gsap.set(subtext, { opacity: 0, y: 20 });
      tl.to(subtext, { opacity: 1, y: 0, duration: 0.7, ease: 'power2.out' }, '-=0.5');
    }
  }

  if (formContainer) {
    gsap.set(formContainer, { opacity: 0, y: 40 });
    gsap.to(formContainer, {
      opacity: 1, y: 0, duration: 0.9, ease: 'power3.out',
      scrollTrigger: {
        trigger: formContainer,
        start: 'top 70%',
        toggleActions: 'play none none reverse'
      }
    });
  }
}

// ═══ FOOTER ═══
function initFooter() {
  const year = document.getElementById('copyright-year');
  if (year) year.textContent = new Date().getFullYear();

  const footer = document.querySelector('.site-footer');
  if (footer) {
    const icons = gsap.utils.toArray('.site-footer .social-icons a');
    gsap.from(icons, {
      scrollTrigger: { trigger: footer, start: 'top 90%' },
      y: 16, opacity: 0, duration: 0.5, stagger: 0.08, ease: 'power2.out'
    });
  }
}

// ═══ MAGNETIC BUTTONS ═══
function initMagneticEffects() {
  if (window.innerWidth < 768) return;
  const btns = document.querySelectorAll('.hero-portfolio-btn, .contact-form button, .showcase-btn');
  btns.forEach(btn => {
    btn.addEventListener('mousemove', (e) => {
      const rect = btn.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      gsap.to(btn, { x: x * 0.15, y: y * 0.15, duration: 0.3, ease: 'power2.out' });
    });
    btn.addEventListener('mouseleave', () => {
      gsap.to(btn, { x: 0, y: 0, duration: 0.5, ease: 'elastic.out(1, 0.4)' });
    });
  });
}

// ═══ SCROLL VELOCITY SKEW ═══
function initVelocitySkew() {
  if (window.innerWidth < 768) return;

  const skewElements = gsap.utils.toArray('.velocity-skew');
  if (skewElements.length === 0) return;

  let currentSkew = 0;
  let targetSkew = 0;
  let lastScrollTop = window.scrollY;

  window.addEventListener('scroll', () => {
    const scrollTop = window.scrollY;
    const delta = scrollTop - lastScrollTop;
    targetSkew = Math.max(-3, Math.min(3, delta * 0.15));
    lastScrollTop = scrollTop;
  }, { passive: true });

  function updateSkew() {
    currentSkew += (targetSkew - currentSkew) * 0.08;
    targetSkew *= 0.95;
    if (Math.abs(currentSkew) > 0.01) {
      skewElements.forEach(el => {
        gsap.set(el, { skewY: currentSkew });
      });
    }
    requestAnimationFrame(updateSkew);
  }
  requestAnimationFrame(updateSkew);
}

// ═══ SECTION REVEAL ANIMATIONS ═══
function initSectionReveals() {
  const processHeader = document.querySelector('.process-header');
  if (processHeader) {
    gsap.from(processHeader, {
      opacity: 0, y: 40, duration: 0.8, ease: 'power2.out',
      scrollTrigger: { trigger: processHeader, start: 'top 80%' }
    });
  }
}

// ═══ INITIALIZE ALL ═══
function initAll() {
  console.log('LAYA V2 — Initializing...');

  initLenis();
  initScrollProgress();
  initHeader();
  initMobileMenu();
  initScrollIndicator();
  initHero();
  initAbout();
  initHorizontalScroll();
  initStackingCards();
  initShowcase();
  initProjectModal();
  initContact();
  initFooter();
  initMagneticEffects();
  initVelocitySkew();
  initSectionReveals();

  setTimeout(() => {
    ScrollTrigger.refresh();
    console.log('LAYA V2 — Ready.');
  }, 400);

  let resizeTimer;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => ScrollTrigger.refresh(true), 250);
  });
}

// ═══ BOOT ═══
window.addEventListener('load', () => {
  initLoader();
});
