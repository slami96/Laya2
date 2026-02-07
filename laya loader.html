<!DOCTYPE html>
<html lang="cs">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>LAYA HOME — Loading</title>

<link rel="preconnect" href="https://fonts.googleapis.com">
<link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;1,300;1,400&family=DM+Sans:wght@300;400;500&family=Montserrat:wght@300;400;500;600&display=swap" rel="stylesheet">

<style>
  *,*::before,*::after{margin:0;padding:0;box-sizing:border-box}

  :root {
    --gold: #c2a47e;
    --dark: #0a0a08;
    --cream: #e8e4de;
  }

  body {
    background: var(--dark);
    color: var(--cream);
    font-family: 'DM Sans', sans-serif;
    overflow: hidden;
    height: 100vh;
    width: 100vw;
  }

  /* ═══ LOADER OVERLAY ═══ */
  .loader {
    position: fixed;
    inset: 0;
    z-index: 9999;
    background: var(--dark);
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
  }

  .loader-canvas {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
  }

  .loader-logo-wrap {
    position: relative;
    z-index: 2;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 16px;
    pointer-events: none;
  }

  .loader-logo {
    font-family: 'Cormorant Garamond', serif;
    font-size: clamp(32px, 5vw, 56px);
    font-weight: 300;
    letter-spacing: 0.25em;
    color: var(--gold);
    opacity: 0;
    text-transform: uppercase;
  }

  .loader-tagline {
    font-family: 'DM Sans', sans-serif;
    font-size: clamp(10px, 1.4vw, 13px);
    font-weight: 300;
    letter-spacing: 0.3em;
    color: var(--gold);
    opacity: 0;
    text-transform: uppercase;
  }

  .loader-progress {
    position: absolute;
    bottom: 40px;
    left: 50%;
    transform: translateX(-50%);
    z-index: 2;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 8px;
  }

  .loader-bar-track {
    width: 120px;
    height: 1px;
    background: rgba(194, 164, 126, 0.15);
    overflow: hidden;
    border-radius: 1px;
  }

  .loader-bar-fill {
    width: 0%;
    height: 100%;
    background: var(--gold);
    transition: width 0.1s ease;
  }

  .loader-pct {
    font-family: 'Montserrat', sans-serif;
    font-size: 10px;
    font-weight: 300;
    letter-spacing: 0.15em;
    color: rgba(194, 164, 126, 0.4);
  }

  /* ═══ POST-LOADER CONTENT ═══ */
  .hero-placeholder {
    position: fixed;
    inset: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    opacity: 0;
  }

  .hero-placeholder h1 {
    font-family: 'Cormorant Garamond', serif;
    font-size: clamp(28px, 4vw, 52px);
    font-weight: 300;
    color: var(--cream);
    text-align: center;
    line-height: 1.3;
    letter-spacing: 0.04em;
  }

  .hero-placeholder h1 span {
    display: block;
    font-size: 0.4em;
    letter-spacing: 0.15em;
    color: var(--gold);
    margin-top: 12px;
    text-transform: uppercase;
    font-family: 'DM Sans', sans-serif;
    font-weight: 300;
  }
</style>
</head>
<body>

<!-- ═══ LOADER ═══ -->
<div class="loader" id="loader">
  <canvas class="loader-canvas" id="loaderCanvas"></canvas>

  <div class="loader-logo-wrap">
    <div class="loader-logo" id="loaderLogo">LAYA</div>
    <div class="loader-tagline" id="loaderTagline">Architektura & Interiérový Design</div>
  </div>

  <div class="loader-progress">
    <div class="loader-bar-track">
      <div class="loader-bar-fill" id="loaderBarFill"></div>
    </div>
    <div class="loader-pct" id="loaderPct">0%</div>
  </div>
</div>

<!-- ═══ CONTENT BEHIND ═══ -->
<div class="hero-placeholder" id="heroPlaceholder">
  <h1>Tvoříme prostory,<br>které vyprávějí příběhy
    <span>LAYA Home — Architecture Studio</span>
  </h1>
</div>

<script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/gsap.min.js"></script>

<script>
(function() {
  'use strict';

  // ═══════════════════════════════════════
  //  ISOMETRIC ROOM WIREFRAME LOADER
  // ═══════════════════════════════════════

  const canvas = document.getElementById('loaderCanvas');
  const ctx = canvas.getContext('2d');
  const dpr = Math.min(window.devicePixelRatio || 1, 2);

  let W, H;

  function resize() {
    W = window.innerWidth;
    H = window.innerHeight;
    canvas.width = W * dpr;
    canvas.height = H * dpr;
    canvas.style.width = W + 'px';
    canvas.style.height = H + 'px';
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  resize();
  window.addEventListener('resize', resize);

  // ─── Isometric math ───
  const COS30 = Math.cos(Math.PI / 6); // ≈ 0.866
  const SIN30 = 0.5;
  let isoScale, isoOffX, isoOffY;

  function recalcIso() {
    isoScale = Math.min(W, H) * 0.07;
    isoOffX = W * 0.5;
    isoOffY = H * 0.54;
  }
  recalcIso();
  window.addEventListener('resize', recalcIso);

  function iso(x, y, z) {
    return {
      x: (x - y) * COS30 * isoScale + isoOffX,
      y: ((x + y) * SIN30 - z) * isoScale + isoOffY
    };
  }

  // ─── Room dimensions (iso units) ───
  const RW = 7, RD = 5.5, RH = 3.8;

  // ─── Animation state ───
  const S = {
    grid: 0,
    floor: 0,
    wallL: 0,      // left wall (front face, y=RD)
    wallR: 0,      // right wall (front face, x=RW)
    wallB: 0,      // back wall edges
    ceiling: 0,
    window: 0,
    door: 0,
    table: 0,
    chair: 0,
    shelf: 0,
    lamp: 0,
    plant: 0,
    picture: 0,
    rug: 0,
    dims: 0,
    glow: 0,
    particles: 0,
    fadeOut: 0,
  };

  // ─── Colors ───
  function goldAlpha(a) {
    return `rgba(194,164,126,${a * (1 - S.fadeOut)})`;
  }
  function creamAlpha(a) {
    return `rgba(232,228,222,${a * (1 - S.fadeOut)})`;
  }

  // ─── Drawing pen glow at tip ───
  function drawPenTip(p, progress) {
    if (progress <= 0 || progress >= 1) return;
    ctx.beginPath();
    ctx.arc(p.x, p.y, 3, 0, Math.PI * 2);
    ctx.fillStyle = goldAlpha(0.7);
    ctx.fill();

    ctx.beginPath();
    ctx.arc(p.x, p.y, 8, 0, Math.PI * 2);
    ctx.fillStyle = goldAlpha(0.15);
    ctx.fill();
  }

  // ─── Line with progress ───
  function line(ax, ay, az, bx, by, bz, progress, lw, alpha) {
    if (progress <= 0) return;
    const p = Math.min(progress, 1);
    const a = iso(ax, ay, az);
    const b = iso(bx, by, bz);

    const ex = a.x + (b.x - a.x) * p;
    const ey = a.y + (b.y - a.y) * p;

    ctx.beginPath();
    ctx.moveTo(a.x, a.y);
    ctx.lineTo(ex, ey);
    ctx.strokeStyle = goldAlpha(alpha != null ? alpha : 0.8);
    ctx.lineWidth = lw || 1.2;
    ctx.stroke();

    drawPenTip({ x: ex, y: ey }, progress);
  }

  // ─── Multi-line sequence ───
  function lineSeq(lines, progress, lw, alpha) {
    if (progress <= 0) return;
    const n = lines.length;
    lines.forEach((l, i) => {
      const start = i / n;
      const end = (i + 1) / n;
      const seg = Math.max(0, Math.min(1, (progress - start) / (end - start)));
      line(l[0], l[1], l[2], l[3], l[4], l[5], seg, lw, alpha);
    });
  }

  // ─── Dashed line ───
  function dashed(ax, ay, az, bx, by, bz, progress, alpha) {
    if (progress <= 0) return;
    const p = Math.min(progress, 1);
    const a = iso(ax, ay, az);
    const b = iso(bx, by, bz);
    const ex = a.x + (b.x - a.x) * p;
    const ey = a.y + (b.y - a.y) * p;

    ctx.save();
    ctx.setLineDash([3, 4]);
    ctx.beginPath();
    ctx.moveTo(a.x, a.y);
    ctx.lineTo(ex, ey);
    ctx.strokeStyle = goldAlpha(alpha || 0.25);
    ctx.lineWidth = 0.6;
    ctx.stroke();
    ctx.restore();
  }

  // ─── Cross mark ───
  function cross(x, y, z, progress, size) {
    if (progress <= 0) return;
    const s = (size || 4) * Math.min(progress, 1);
    const c = iso(x, y, z);
    ctx.beginPath();
    ctx.moveTo(c.x - s, c.y);
    ctx.lineTo(c.x + s, c.y);
    ctx.moveTo(c.x, c.y - s);
    ctx.lineTo(c.x, c.y + s);
    ctx.strokeStyle = goldAlpha(0.35 * Math.min(progress, 1));
    ctx.lineWidth = 0.6;
    ctx.stroke();
  }

  // ─── Fill a 3D quad ───
  function fillQuad(ax, ay, az, bx, by, bz, cx, cy, cz, dx, dy, dz, color) {
    const a = iso(ax, ay, az);
    const b = iso(bx, by, bz);
    const c = iso(cx, cy, cz);
    const d = iso(dx, dy, dz);
    ctx.beginPath();
    ctx.moveTo(a.x, a.y);
    ctx.lineTo(b.x, b.y);
    ctx.lineTo(c.x, c.y);
    ctx.lineTo(d.x, d.y);
    ctx.closePath();
    ctx.fillStyle = color;
    ctx.fill();
  }

  // ─── Particles ───
  const dustParticles = [];
  for (let i = 0; i < 50; i++) {
    dustParticles.push({
      x: Math.random(),
      y: Math.random(),
      size: Math.random() * 1.5 + 0.5,
      speed: Math.random() * 0.0003 + 0.0001,
      drift: (Math.random() - 0.5) * 0.0002,
      alpha: Math.random() * 0.35 + 0.1,
    });
  }

  // ═══════════════════════════════════════
  //  DRAW EACH ELEMENT
  // ═══════════════════════════════════════

  function drawGrid() {
    if (S.grid <= 0) return;
    ctx.globalAlpha = S.grid * 0.15 * (1 - S.fadeOut);

    // Floor grid
    for (let i = 0; i <= RW; i++) {
      line(i, 0, 0, i, RD, 0, 1, 0.3, 0.12);
    }
    for (let j = 0; j <= Math.floor(RD); j++) {
      line(0, j, 0, RW, j, 0, 1, 0.3, 0.12);
    }
    ctx.globalAlpha = 1;
  }

  function drawFloor() {
    lineSeq([
      [0, 0, 0, RW, 0, 0],
      [RW, 0, 0, RW, RD, 0],
      [RW, RD, 0, 0, RD, 0],
      [0, RD, 0, 0, 0, 0],
    ], S.floor, 1.5, 0.8);
  }

  function drawWalls() {
    // Back-left wall: x=0 face (from y=0 to y=RD)
    const wh = RH;
    if (S.wallL > 0) {
      const h = wh * S.wallL;
      // Verticals rising
      line(0, 0, 0, 0, 0, h, 1, 1.5, 0.9);
      line(0, RD, 0, 0, RD, h, 1, 1.5, 0.9);
      // Top edge
      if (S.wallL >= 1) line(0, 0, wh, 0, RD, wh, 1, 1.5, 0.9);

      // Wall fill (subtle)
      if (S.wallL > 0.6) {
        const fa = (S.wallL - 0.6) / 0.4 * 0.035;
        fillQuad(0, 0, 0, 0, RD, 0, 0, RD, h, 0, 0, h, goldAlpha(fa));
      }
    }

    // Back-right wall: y=0 face (from x=0 to x=RW)
    if (S.wallR > 0) {
      const h = wh * S.wallR;
      line(0, 0, 0, 0, 0, h, 1, 1.3, 0.85);
      line(RW, 0, 0, RW, 0, h, 1, 1.3, 0.85);
      if (S.wallR >= 1) line(0, 0, wh, RW, 0, wh, 1, 1.3, 0.85);

      if (S.wallR > 0.6) {
        const fa = (S.wallR - 0.6) / 0.4 * 0.03;
        fillQuad(0, 0, 0, RW, 0, 0, RW, 0, h, 0, 0, h, goldAlpha(fa));
      }
    }
  }

  function drawCeiling() {
    if (S.ceiling <= 0) return;
    lineSeq([
      [0, 0, RH, RW, 0, RH],
      [RW, 0, RH, RW, RD, RH],
      [RW, RD, RH, 0, RD, RH],
      [0, RD, RH, 0, 0, RH],
    ], S.ceiling, 0.7, 0.35);
  }

  function drawWindow() {
    if (S.window <= 0) return;
    // Large window on right wall (y=0), centered
    const wx1 = 1.5, wx2 = 4.5, wz1 = 1.2, wz2 = 3.0;

    lineSeq([
      [wx1, 0, wz1, wx2, 0, wz1],
      [wx2, 0, wz1, wx2, 0, wz2],
      [wx2, 0, wz2, wx1, 0, wz2],
      [wx1, 0, wz2, wx1, 0, wz1],
    ], S.window, 1.4, 0.9);

    // Mullions (cross bars)
    const mp = Math.max(0, (S.window - 0.5) / 0.5);
    const mx = (wx1 + wx2) / 2;
    const mz = (wz1 + wz2) / 2;
    line(mx, 0, wz1, mx, 0, wz2, mp, 0.8, 0.6);
    line(wx1, 0, mz, wx2, 0, mz, mp, 0.8, 0.6);

    // Sill
    const sp = Math.max(0, (S.window - 0.7) / 0.3);
    line(wx1 - 0.15, 0.1, wz1, wx2 + 0.15, 0.1, wz1, sp, 0.9, 0.7);

    // Window glass glow
    if (S.window > 0.8) {
      const ga = (S.window - 0.8) / 0.2 * 0.06;
      fillQuad(wx1, 0, wz1, wx2, 0, wz1, wx2, 0, wz2, wx1, 0, wz2, goldAlpha(ga));
    }
  }

  function drawDoor() {
    if (S.door <= 0) return;
    // Door on left wall (x=0), near front
    const dy1 = 3.5, dy2 = 4.5, dz = 2.8;

    lineSeq([
      [0, dy1, 0, 0, dy1, dz],
      [0, dy1, dz, 0, dy2, dz],
      [0, dy2, dz, 0, dy2, 0],
    ], S.door, 1.2, 0.8);

    // Handle
    if (S.door > 0.7) {
      const hp = (S.door - 0.7) / 0.3;
      const h = iso(0, dy1 + 0.15, 1.3);
      ctx.beginPath();
      ctx.arc(h.x, h.y, 2.5 * hp, 0, Math.PI * 2);
      ctx.strokeStyle = goldAlpha(0.6 * hp);
      ctx.lineWidth = 0.8;
      ctx.stroke();
    }
  }

  function drawTable() {
    if (S.table <= 0) return;
    const tx = 2.5, ty = 2, tw = 2.2, td = 1.4, th = 1.05;

    // Top surface
    lineSeq([
      [tx, ty, th, tx + tw, ty, th],
      [tx + tw, ty, th, tx + tw, ty + td, th],
      [tx + tw, ty + td, th, tx, ty + td, th],
      [tx, ty + td, th, tx, ty, th],
    ], S.table, 1.3, 0.85);

    // Legs
    const lp = Math.max(0, (S.table - 0.4) / 0.6);
    const ins = 0.12;
    [[tx + ins, ty + ins], [tx + tw - ins, ty + ins], [tx + tw - ins, ty + td - ins], [tx + ins, ty + td - ins]]
      .forEach(([lx, ly]) => {
        line(lx, ly, th, lx, ly, th - th * lp, 1, 0.7, 0.5);
      });

    // Items on table
    if (S.table > 0.7) {
      const ip = (S.table - 0.7) / 0.3;
      // Laptop
      lineSeq([
        [tx + 0.4, ty + 0.3, th, tx + 1.3, ty + 0.3, th],
        [tx + 1.3, ty + 0.3, th, tx + 1.3, ty + 1, th],
        [tx + 1.3, ty + 1, th, tx + 0.4, ty + 1, th],
        [tx + 0.4, ty + 1, th, tx + 0.4, ty + 0.3, th],
      ], ip, 0.6, 0.35);
      // Screen
      if (ip > 0.5) {
        const scrP = (ip - 0.5) * 2;
        line(tx + 0.4, ty + 0.3, th, tx + 0.4, ty + 0.25, th + 0.6 * scrP, 1, 0.6, 0.35);
        line(tx + 1.3, ty + 0.3, th, tx + 1.3, ty + 0.25, th + 0.6 * scrP, 1, 0.6, 0.35);
        if (scrP > 0.8) {
          line(tx + 0.4, ty + 0.25, th + 0.6, tx + 1.3, ty + 0.25, th + 0.6, 1, 0.6, 0.35);
        }
      }

      // Mug
      if (ip > 0.3) {
        const mugP = (ip - 0.3) / 0.7;
        const mugC = iso(tx + 1.7, ty + 0.6, th);
        ctx.beginPath();
        ctx.arc(mugC.x, mugC.y, 4 * mugP, 0, Math.PI * 2);
        ctx.strokeStyle = goldAlpha(0.35 * mugP);
        ctx.lineWidth = 0.7;
        ctx.stroke();
        // Mug height
        line(tx + 1.7, ty + 0.6, th, tx + 1.7, ty + 0.6, th + 0.2 * mugP, 1, 0.5, 0.25);
      }
    }
  }

  function drawChair() {
    if (S.chair <= 0) return;

    function oneChair(cx, cy, backSide) {
      const cw = 0.55, cd = 0.55, sh = 0.6, bkH = 1.15;

      // Seat
      lineSeq([
        [cx, cy, sh, cx + cw, cy, sh],
        [cx + cw, cy, sh, cx + cw, cy + cd, sh],
        [cx + cw, cy + cd, sh, cx, cy + cd, sh],
        [cx, cy + cd, sh, cx, cy, sh],
      ], S.chair, 0.9, 0.65);

      // Legs
      const lp = Math.max(0, (S.chair - 0.3) / 0.5);
      [[cx, cy], [cx + cw, cy], [cx + cw, cy + cd], [cx, cy + cd]].forEach(([lx, ly]) => {
        line(lx, ly, sh, lx, ly, sh - sh * lp, 1, 0.6, 0.4);
      });

      // Backrest
      const bp = Math.max(0, (S.chair - 0.6) / 0.4);
      if (bp > 0) {
        if (backSide === 'y0') {
          line(cx, cy, sh, cx, cy, bkH * bp + sh * (1 - bp), 1, 0.9, 0.65);
          line(cx + cw, cy, sh, cx + cw, cy, bkH * bp + sh * (1 - bp), 1, 0.9, 0.65);
          if (bp > 0.7) line(cx, cy, bkH, cx + cw, cy, bkH, (bp - 0.7) / 0.3, 0.9, 0.65);
        } else {
          line(cx, cy + cd, sh, cx, cy + cd, bkH * bp + sh * (1 - bp), 1, 0.9, 0.65);
          line(cx + cw, cy + cd, sh, cx + cw, cy + cd, bkH * bp + sh * (1 - bp), 1, 0.9, 0.65);
          if (bp > 0.7) line(cx, cy + cd, bkH, cx + cw, cy + cd, bkH, (bp - 0.7) / 0.3, 0.9, 0.65);
        }
      }
    }

    oneChair(3.1, 1.1, 'y0');
    oneChair(3.1, 3.3, 'yD');
  }

  function drawShelf() {
    if (S.shelf <= 0) return;

    // Bookshelf against left wall (x=0)
    const sy1 = 0.5, sy2 = 1.8, topZ = 2.8;

    // Sides
    line(0, sy1, 0, 0, sy1, topZ * S.shelf, 1, 1, 0.8);
    line(0, sy2, 0, 0, sy2, topZ * S.shelf, 1, 1, 0.8);

    // Shelves (5 levels)
    const numS = 5;
    for (let i = 0; i <= numS; i++) {
      const sz = (topZ / numS) * i;
      if (sz > topZ * S.shelf) break;
      const sp = Math.max(0, (S.shelf - i * 0.1) / 0.5);
      line(0, sy1, sz, 0, sy2, sz, Math.min(sp, 1), 0.7, 0.55);
      // Depth
      line(0, sy1, sz, 0.35, sy1, sz, Math.min(sp, 1) * 0.5, 0.4, 0.25);
    }

    // Books
    if (S.shelf > 0.6) {
      const bp = (S.shelf - 0.6) / 0.4;
      const books = [
        [sy1 + 0.1, 0.05, 0.45], [sy1 + 0.25, 0.05, 0.5], [sy1 + 0.4, 0.05, 0.38],
        [sy1 + 0.55, 0.05, 0.42], [sy1 + 0.7, 0.05, 0.47], [sy1 + 0.9, 0.05, 0.35],
        [sy1 + 0.15, topZ / numS + 0.05, 0.48], [sy1 + 0.35, topZ / numS + 0.05, 0.4],
        [sy1 + 0.55, topZ / numS + 0.05, 0.44], [sy1 + 0.8, topZ / numS + 0.05, 0.38],
        [sy1 + 0.1, topZ / numS * 2 + 0.05, 0.42], [sy1 + 0.3, topZ / numS * 2 + 0.05, 0.5],
      ];
      books.forEach((b, i) => {
        const bookP = Math.max(0, Math.min(1, (bp - i * 0.04) * 2.5));
        if (bookP > 0) {
          line(0, b[0], b[1], 0, b[0], b[1] + b[2] * bookP, 1, 0.5, 0.3);
        }
      });
    }
  }

  function drawLamp() {
    if (S.lamp <= 0) return;
    const lx = 6, ly = 4.2;

    // Base
    const bp = Math.min(S.lamp * 2, 1);
    const base = iso(lx, ly, 0);
    ctx.beginPath();
    ctx.ellipse(base.x, base.y, 7 * bp, 4 * bp, -Math.PI / 6, 0, Math.PI * 2);
    ctx.strokeStyle = goldAlpha(0.5 * bp);
    ctx.lineWidth = 0.7;
    ctx.stroke();

    // Pole
    if (S.lamp > 0.2) {
      const pp = (S.lamp - 0.2) / 0.5;
      line(lx, ly, 0, lx, ly, 2.8 * Math.min(pp, 1), 1, 1, 0.8);
    }

    // Shade
    if (S.lamp > 0.65) {
      const sp = (S.lamp - 0.65) / 0.35;
      lineSeq([
        [lx - 0.4, ly - 0.3, 3.2, lx, ly, 2.8],
        [lx, ly, 2.8, lx + 0.4, ly + 0.3, 3.2],
        [lx + 0.4, ly + 0.3, 3.2, lx + 0.4, ly - 0.2, 3.2],
        [lx + 0.4, ly - 0.2, 3.2, lx - 0.4, ly - 0.3, 3.2],
        [lx - 0.4, ly - 0.3, 3.2, lx - 0.4, ly + 0.2, 3.2],
      ], sp, 0.9, 0.7);

      // Glow under shade
      if (sp > 0.8) {
        const ga = (sp - 0.8) / 0.2;
        const center = iso(lx, ly, 2.6);
        const grad = ctx.createRadialGradient(center.x, center.y, 0, center.x, center.y, 40 * ga);
        grad.addColorStop(0, goldAlpha(0.1 * ga));
        grad.addColorStop(1, 'rgba(194,164,126,0)');
        ctx.fillStyle = grad;
        ctx.fillRect(center.x - 50, center.y - 50, 100, 100);
      }
    }
  }

  function drawPlant() {
    if (S.plant <= 0) return;
    const px = 6.2, py = 0.6;

    // Pot
    lineSeq([
      [px - 0.2, py - 0.15, 0, px - 0.25, py - 0.2, 0.4],
      [px - 0.25, py - 0.2, 0.4, px + 0.25, py + 0.2, 0.4],
      [px + 0.25, py + 0.2, 0.4, px + 0.2, py + 0.15, 0],
      [px + 0.2, py + 0.15, 0, px - 0.2, py - 0.15, 0],
    ], S.plant, 0.8, 0.6);

    // Stems + leaves
    if (S.plant > 0.4) {
      const sp = (S.plant - 0.4) / 0.6;
      const stems = [
        { dx: -0.1, dy: -0.08, h: 0.9 },
        { dx: 0.05, dy: 0.05, h: 1.1 },
        { dx: -0.15, dy: 0.1, h: 0.8 },
        { dx: 0.12, dy: -0.06, h: 1.0 },
      ];
      stems.forEach((s, i) => {
        const stemP = Math.max(0, Math.min(1, (sp - i * 0.12) * 2));
        if (stemP > 0) {
          line(px, py, 0.4, px + s.dx, py + s.dy, 0.4 + s.h * stemP, 1, 0.6, 0.45);
          // Leaf arc at top
          if (stemP > 0.7) {
            const lp = (stemP - 0.7) / 0.3;
            const leafEnd = iso(px + s.dx * 3, py + s.dy * 2.5, 0.4 + s.h - 0.1);
            const leafStart = iso(px + s.dx, py + s.dy, 0.4 + s.h * stemP);
            ctx.beginPath();
            ctx.moveTo(leafStart.x, leafStart.y);
            ctx.quadraticCurveTo(
              leafStart.x + (leafEnd.x - leafStart.x) * 0.5 + 5,
              leafStart.y - 8,
              leafEnd.x, leafEnd.y
            );
            ctx.strokeStyle = goldAlpha(0.35 * lp);
            ctx.lineWidth = 0.6;
            ctx.stroke();
          }
        }
      });
    }
  }

  function drawPicture() {
    if (S.picture <= 0) return;
    // Picture on right wall (y=0)
    const px1 = 5.3, px2 = 6.5, pz1 = 2.0, pz2 = 2.9;
    lineSeq([
      [px1, 0, pz1, px2, 0, pz1],
      [px2, 0, pz1, px2, 0, pz2],
      [px2, 0, pz2, px1, 0, pz2],
      [px1, 0, pz2, px1, 0, pz1],
    ], S.picture, 0.9, 0.6);

    // Inner frame
    if (S.picture > 0.6) {
      const ip = (S.picture - 0.6) / 0.4;
      const m = 0.1;
      lineSeq([
        [px1 + m, 0, pz1 + m, px2 - m, 0, pz1 + m],
        [px2 - m, 0, pz1 + m, px2 - m, 0, pz2 - m],
        [px2 - m, 0, pz2 - m, px1 + m, 0, pz2 - m],
        [px1 + m, 0, pz2 - m, px1 + m, 0, pz1 + m],
      ], ip, 0.5, 0.3);
    }
  }

  function drawRug() {
    if (S.rug <= 0) return;
    const rx = 2, ry = 1.5, rw = 3.2, rd = 2.2;

    lineSeq([
      [rx, ry, 0.01, rx + rw, ry, 0.01],
      [rx + rw, ry, 0.01, rx + rw, ry + rd, 0.01],
      [rx + rw, ry + rd, 0.01, rx, ry + rd, 0.01],
      [rx, ry + rd, 0.01, rx, ry, 0.01],
    ], S.rug, 0.7, 0.35);

    if (S.rug > 0.5) {
      const ip = (S.rug - 0.5) * 2;
      const m = 0.25;
      lineSeq([
        [rx + m, ry + m, 0.01, rx + rw - m, ry + m, 0.01],
        [rx + rw - m, ry + m, 0.01, rx + rw - m, ry + rd - m, 0.01],
        [rx + rw - m, ry + rd - m, 0.01, rx + m, ry + rd - m, 0.01],
        [rx + m, ry + rd - m, 0.01, rx + m, ry + m, 0.01],
      ], ip, 0.5, 0.2);
    }
  }

  function drawDimensions() {
    if (S.dims <= 0) return;

    // Corner marks
    const corners = [[0,0,0],[RW,0,0],[0,RD,0],[RW,RD,0],[0,0,RH],[RW,0,RH]];
    corners.forEach((c, i) => {
      cross(c[0], c[1], c[2], Math.max(0, (S.dims - i * 0.05) / 0.5));
    });

    // Width dimension
    const dp = Math.max(0, (S.dims - 0.2) / 0.8);
    dashed(0, RD + 0.6, 0, RW, RD + 0.6, 0, dp, 0.3);
    // Ticks
    line(0, RD + 0.4, 0, 0, RD + 0.8, 0, dp, 0.5, 0.25);
    line(RW, RD + 0.4, 0, RW, RD + 0.8, 0, dp, 0.5, 0.25);

    // Height dimension
    dashed(RW + 0.6, 0, 0, RW + 0.6, 0, RH, dp, 0.3);
    line(RW + 0.4, 0, 0, RW + 0.8, 0, 0, dp, 0.5, 0.25);
    line(RW + 0.4, 0, RH, RW + 0.8, 0, RH, dp, 0.5, 0.25);

    // Labels
    if (S.dims > 0.5) {
      const tp = (S.dims - 0.5) / 0.5;
      ctx.font = `300 ${Math.max(9, Math.min(11, W * 0.008))}px Montserrat, sans-serif`;
      ctx.textAlign = 'center';
      ctx.fillStyle = goldAlpha(0.35 * tp);

      const wMid = iso(RW / 2, RD + 1, 0);
      ctx.fillText('7 000 mm', wMid.x, wMid.y);

      const hMid = iso(RW + 1, 0, RH / 2);
      ctx.fillText('3 800 mm', hMid.x, hMid.y);
    }
  }

  function drawGlow() {
    if (S.glow <= 0) return;

    // Big window glow
    const wCenter = iso(3, 0, 2.1);
    const r = Math.min(W, H) * 0.5;
    const grad = ctx.createRadialGradient(wCenter.x, wCenter.y, 0, wCenter.x, wCenter.y, r * S.glow);
    grad.addColorStop(0, goldAlpha(0.08 * S.glow));
    grad.addColorStop(0.4, goldAlpha(0.03 * S.glow));
    grad.addColorStop(1, 'rgba(194,164,126,0)');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, W, H);

    // Light beams
    if (S.glow > 0.3) {
      const bp = (S.glow - 0.3) / 0.7;
      ctx.globalAlpha = bp * 0.06 * (1 - S.fadeOut);
      const w1 = iso(1.5, 0, 2.5);
      const w2 = iso(4.5, 0, 2.5);
      const f1 = iso(1, 3, 0);
      const f2 = iso(5, 3.5, 0);

      ctx.beginPath();
      ctx.moveTo(w1.x, w1.y);
      ctx.lineTo(w2.x, w2.y);
      ctx.lineTo(f2.x, f2.y);
      ctx.lineTo(f1.x, f1.y);
      ctx.closePath();
      ctx.fillStyle = `rgba(194,164,126,0.5)`;
      ctx.fill();
      ctx.globalAlpha = 1;
    }
  }

  function drawParticles() {
    if (S.particles <= 0) return;
    dustParticles.forEach(p => {
      p.y -= p.speed;
      p.x += p.drift;
      if (p.y < -0.02) { p.y = 1.02; p.x = Math.random(); }
      if (p.x < 0 || p.x > 1) p.x = Math.random();

      ctx.beginPath();
      ctx.arc(p.x * W, p.y * H, p.size, 0, Math.PI * 2);
      ctx.fillStyle = goldAlpha(p.alpha * S.particles);
      ctx.fill();
    });
  }

  // ═══════════════════════════════════════
  //  RENDER LOOP
  // ═══════════════════════════════════════

  let running = true;

  function render() {
    if (!running) return;
    ctx.clearRect(0, 0, W, H);

    drawGlow();
    drawGrid();
    drawRug();
    drawFloor();
    drawWalls();
    drawCeiling();
    drawWindow();
    drawDoor();
    drawShelf();
    drawPicture();
    drawTable();
    drawChair();
    drawLamp();
    drawPlant();
    drawDimensions();
    drawParticles();

    requestAnimationFrame(render);
  }

  // ═══════════════════════════════════════
  //  GSAP TIMELINE
  // ═══════════════════════════════════════

  function startAnimation() {
    render();

    const barFill = document.getElementById('loaderBarFill');
    const pctEl = document.getElementById('loaderPct');
    const logo = document.getElementById('loaderLogo');
    const tagline = document.getElementById('loaderTagline');
    const loader = document.getElementById('loader');
    const hero = document.getElementById('heroPlaceholder');

    const tl = gsap.timeline({
      onUpdate: function () {
        const pct = Math.round(this.progress() * 100);
        if (barFill) barFill.style.width = pct + '%';
        if (pctEl) pctEl.textContent = pct + '%';
      },
      onComplete: () => {
        // Transition out loader
        gsap.to(loader, {
          opacity: 0,
          duration: 0.6,
          ease: 'power2.inOut',
          onComplete: () => {
            loader.style.display = 'none';
            running = false;
          }
        });
        // Reveal content
        gsap.to(hero, { opacity: 1, duration: 0.8, ease: 'power2.out', delay: 0.3 });
      }
    });

    // ─── Phase 1: Blueprint Grid + Floor (0s - 1s)
    tl.to(S, { grid: 1, duration: 0.8, ease: 'power2.out' }, 0);
    tl.to(S, { particles: 0.5, duration: 1, ease: 'power1.in' }, 0);
    tl.to(S, { floor: 1, duration: 0.8, ease: 'power2.inOut' }, 0.25);

    // ─── Phase 2: Walls rise (0.7s - 2s)
    tl.to(S, { wallR: 1, duration: 1, ease: 'power2.out' }, 0.7);
    tl.to(S, { wallL: 1, duration: 1, ease: 'power2.out' }, 0.85);
    tl.to(S, { ceiling: 1, duration: 0.6, ease: 'power2.out' }, 1.6);

    // ─── Phase 3: Window + Door (1.6s - 2.5s)
    tl.to(S, { window: 1, duration: 0.8, ease: 'power2.inOut' }, 1.6);
    tl.to(S, { door: 1, duration: 0.6, ease: 'power2.out' }, 2.0);

    // ─── Phase 4: Furniture (2.2s - 3.6s)
    tl.to(S, { rug: 1, duration: 0.6, ease: 'power2.out' }, 2.2);
    tl.to(S, { table: 1, duration: 0.9, ease: 'power2.out' }, 2.3);
    tl.to(S, { chair: 1, duration: 0.8, ease: 'power2.out' }, 2.6);
    tl.to(S, { shelf: 1, duration: 0.9, ease: 'power2.out' }, 2.4);
    tl.to(S, { lamp: 1, duration: 0.8, ease: 'power2.out' }, 2.8);
    tl.to(S, { plant: 1, duration: 0.7, ease: 'power2.out' }, 3.0);
    tl.to(S, { picture: 1, duration: 0.5, ease: 'power2.out' }, 3.1);

    // ─── Phase 5: Dimensions (3.3s - 4s)
    tl.to(S, { dims: 1, duration: 0.7, ease: 'power2.out' }, 3.3);

    // ─── Phase 6: Golden light wash (3.6s - 4.5s)
    tl.to(S, { glow: 1, duration: 1.2, ease: 'power2.inOut' }, 3.6);
    tl.to(S, { particles: 0.8, duration: 0.8, ease: 'power1.in' }, 3.8);

    // ─── Phase 7: Dissolve wireframe + Logo (4.4s - 5.2s)
    tl.to(S, { fadeOut: 1, duration: 0.8, ease: 'power2.in' }, 4.4);
    tl.to(S, { particles: 0, duration: 0.5 }, 4.6);

    // Logo + tagline reveal
    tl.to(logo, { opacity: 1, duration: 0.6, ease: 'power2.out' }, 4.6);
    tl.to(tagline, { opacity: 1, duration: 0.4, ease: 'power2.out' }, 4.85);

    // Hold
    tl.to({}, { duration: 0.6 }, 5.1);
  }

  // Start on load
  if (document.readyState === 'complete') {
    startAnimation();
  } else {
    window.addEventListener('load', startAnimation);
  }

})();
</script>
</body>
</html>
