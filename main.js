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



// ═══════════════════════════════════════
//  PROCESS SECTION — SCROLL-DRIVEN
//  ISOMETRIC WIREFRAME ROOM CANVAS
//  (Original laya-loader animation, scrubbed by scroll)
// ═══════════════════════════════════════
function initProcessCanvas() {
  const wrap = document.getElementById('process-canvas-wrap');
  const canvas = document.getElementById('process-canvas');
  if (!wrap || !canvas) return;

  const ctx = canvas.getContext('2d');
  const dpr = Math.min(window.devicePixelRatio || 1, 2);

  let W, H;

  function resize() {
    const rect = canvas.getBoundingClientRect();
    W = rect.width;
    H = rect.height;
    canvas.width = W * dpr;
    canvas.height = H * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    recalcIso();
  }

  // ─── Isometric math ───
  const COS30 = Math.cos(Math.PI / 6);
  const SIN30 = 0.5;
  let isoScale, isoOffX, isoOffY;

  function recalcIso() {
    isoScale = Math.min(W, H) * 0.07;
    isoOffX = W * 0.5;
    isoOffY = H * 0.54;
  }

  function iso(x, y, z) {
    return {
      x: (x - y) * COS30 * isoScale + isoOffX,
      y: ((x + y) * SIN30 - z) * isoScale + isoOffY
    };
  }

  resize();
  window.addEventListener('resize', resize);

  // ─── Room dimensions (iso units) ───
  const RW = 7, RD = 5.5, RH = 3.8;

  // ─── Animation state ───
  const S = {
    grid: 0, floor: 0,
    wallL: 0, wallR: 0, wallB: 0, ceiling: 0,
    window: 0, door: 0,
    table: 0, chair: 0, shelf: 0, lamp: 0, plant: 0, picture: 0, rug: 0,
    dims: 0, glow: 0, particles: 0, fadeOut: 0,
  };

  // ─── Colors ───
  function goldAlpha(a) {
    return `rgba(194,164,126,${a * (1 - S.fadeOut)})`;
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

  // ─── Particles (static positions, animated by scroll) ───
  const dustParticles = [];
  for (let i = 0; i < 50; i++) {
    dustParticles.push({
      x: Math.random(), y: Math.random(),
      baseY: Math.random(),
      size: Math.random() * 1.5 + 0.5,
      drift: (Math.random() - 0.5) * 0.15,
      alpha: Math.random() * 0.35 + 0.1,
    });
  }

  // ═══ DRAW EACH ELEMENT (identical to original) ═══

  function drawGrid() {
    if (S.grid <= 0) return;
    ctx.globalAlpha = S.grid * 0.15 * (1 - S.fadeOut);
    for (let i = 0; i <= RW; i++) line(i, 0, 0, i, RD, 0, 1, 0.3, 0.12);
    for (let j = 0; j <= Math.floor(RD); j++) line(0, j, 0, RW, j, 0, 1, 0.3, 0.12);
    ctx.globalAlpha = 1;
  }

  function drawFloor() {
    lineSeq([[0,0,0,RW,0,0],[RW,0,0,RW,RD,0],[RW,RD,0,0,RD,0],[0,RD,0,0,0,0]], S.floor, 1.5, 0.8);
  }

  function drawWalls() {
    const wh = RH;
    if (S.wallL > 0) {
      const h = wh * S.wallL;
      line(0,0,0,0,0,h,1,1.5,0.9); line(0,RD,0,0,RD,h,1,1.5,0.9);
      if (S.wallL >= 1) line(0,0,wh,0,RD,wh,1,1.5,0.9);
      if (S.wallL > 0.6) { const fa=(S.wallL-0.6)/0.4*0.035; fillQuad(0,0,0,0,RD,0,0,RD,h,0,0,h,goldAlpha(fa)); }
    }
    if (S.wallR > 0) {
      const h = wh * S.wallR;
      line(0,0,0,0,0,h,1,1.3,0.85); line(RW,0,0,RW,0,h,1,1.3,0.85);
      if (S.wallR >= 1) line(0,0,wh,RW,0,wh,1,1.3,0.85);
      if (S.wallR > 0.6) { const fa=(S.wallR-0.6)/0.4*0.03; fillQuad(0,0,0,RW,0,0,RW,0,h,0,0,h,goldAlpha(fa)); }
    }
  }

  function drawCeiling() {
    if (S.ceiling <= 0) return;
    lineSeq([[0,0,RH,RW,0,RH],[RW,0,RH,RW,RD,RH],[RW,RD,RH,0,RD,RH],[0,RD,RH,0,0,RH]], S.ceiling, 0.7, 0.35);
  }

  function drawWindow() {
    if (S.window <= 0) return;
    const wx1=1.5,wx2=4.5,wz1=1.2,wz2=3.0;
    lineSeq([[wx1,0,wz1,wx2,0,wz1],[wx2,0,wz1,wx2,0,wz2],[wx2,0,wz2,wx1,0,wz2],[wx1,0,wz2,wx1,0,wz1]], S.window, 1.4, 0.9);
    const mp=Math.max(0,(S.window-0.5)/0.5), mx=(wx1+wx2)/2, mz=(wz1+wz2)/2;
    line(mx,0,wz1,mx,0,wz2,mp,0.8,0.6); line(wx1,0,mz,wx2,0,mz,mp,0.8,0.6);
    const sp=Math.max(0,(S.window-0.7)/0.3);
    line(wx1-0.15,0.1,wz1,wx2+0.15,0.1,wz1,sp,0.9,0.7);
    if (S.window > 0.8) { const ga=(S.window-0.8)/0.2*0.06; fillQuad(wx1,0,wz1,wx2,0,wz1,wx2,0,wz2,wx1,0,wz2,goldAlpha(ga)); }
  }

  function drawDoor() {
    if (S.door <= 0) return;
    const dy1=3.5,dy2=4.5,dz=2.8;
    lineSeq([[0,dy1,0,0,dy1,dz],[0,dy1,dz,0,dy2,dz],[0,dy2,dz,0,dy2,0]], S.door, 1.2, 0.8);
    if (S.door > 0.7) { const hp=(S.door-0.7)/0.3; const h=iso(0,dy1+0.15,1.3); ctx.beginPath(); ctx.arc(h.x,h.y,2.5*hp,0,Math.PI*2); ctx.strokeStyle=goldAlpha(0.6*hp); ctx.lineWidth=0.8; ctx.stroke(); }
  }

  function drawTable() {
    if (S.table <= 0) return;
    const tx=2.5,ty=2,tw=2.2,td=1.4,th=1.05;
    lineSeq([[tx,ty,th,tx+tw,ty,th],[tx+tw,ty,th,tx+tw,ty+td,th],[tx+tw,ty+td,th,tx,ty+td,th],[tx,ty+td,th,tx,ty,th]], S.table, 1.3, 0.85);
    const lp=Math.max(0,(S.table-0.4)/0.6), ins=0.12;
    [[tx+ins,ty+ins],[tx+tw-ins,ty+ins],[tx+tw-ins,ty+td-ins],[tx+ins,ty+td-ins]].forEach(([lx,ly])=>{ line(lx,ly,th,lx,ly,th-th*lp,1,0.7,0.5); });
    if (S.table > 0.7) {
      const ip=(S.table-0.7)/0.3;
      lineSeq([[tx+0.4,ty+0.3,th,tx+1.3,ty+0.3,th],[tx+1.3,ty+0.3,th,tx+1.3,ty+1,th],[tx+1.3,ty+1,th,tx+0.4,ty+1,th],[tx+0.4,ty+1,th,tx+0.4,ty+0.3,th]], ip, 0.6, 0.35);
      if (ip>0.5) { const scrP=(ip-0.5)*2; line(tx+0.4,ty+0.3,th,tx+0.4,ty+0.25,th+0.6*scrP,1,0.6,0.35); line(tx+1.3,ty+0.3,th,tx+1.3,ty+0.25,th+0.6*scrP,1,0.6,0.35); if(scrP>0.8) line(tx+0.4,ty+0.25,th+0.6,tx+1.3,ty+0.25,th+0.6,1,0.6,0.35); }
      if (ip>0.3) { const mugP=(ip-0.3)/0.7; const mugC=iso(tx+1.7,ty+0.6,th); ctx.beginPath(); ctx.arc(mugC.x,mugC.y,4*mugP,0,Math.PI*2); ctx.strokeStyle=goldAlpha(0.35*mugP); ctx.lineWidth=0.7; ctx.stroke(); line(tx+1.7,ty+0.6,th,tx+1.7,ty+0.6,th+0.2*mugP,1,0.5,0.25); }
    }
  }

  function drawChair() {
    if (S.chair <= 0) return;
    function oneChair(cx,cy,backSide) {
      const cw=0.55,cd=0.55,sh=0.6,bkH=1.15;
      lineSeq([[cx,cy,sh,cx+cw,cy,sh],[cx+cw,cy,sh,cx+cw,cy+cd,sh],[cx+cw,cy+cd,sh,cx,cy+cd,sh],[cx,cy+cd,sh,cx,cy,sh]], S.chair, 0.9, 0.65);
      const lp=Math.max(0,(S.chair-0.3)/0.5);
      [[cx,cy],[cx+cw,cy],[cx+cw,cy+cd],[cx,cy+cd]].forEach(([lx,ly])=>{ line(lx,ly,sh,lx,ly,sh-sh*lp,1,0.6,0.4); });
      const bp=Math.max(0,(S.chair-0.6)/0.4);
      if (bp > 0) {
        if (backSide==='y0') { line(cx,cy,sh,cx,cy,bkH*bp+sh*(1-bp),1,0.9,0.65); line(cx+cw,cy,sh,cx+cw,cy,bkH*bp+sh*(1-bp),1,0.9,0.65); if(bp>0.7) line(cx,cy,bkH,cx+cw,cy,bkH,(bp-0.7)/0.3,0.9,0.65); }
        else { line(cx,cy+cd,sh,cx,cy+cd,bkH*bp+sh*(1-bp),1,0.9,0.65); line(cx+cw,cy+cd,sh,cx+cw,cy+cd,bkH*bp+sh*(1-bp),1,0.9,0.65); if(bp>0.7) line(cx,cy+cd,bkH,cx+cw,cy+cd,bkH,(bp-0.7)/0.3,0.9,0.65); }
      }
    }
    oneChair(3.1,1.1,'y0'); oneChair(3.1,3.3,'yD');
  }

  function drawShelf() {
    if (S.shelf <= 0) return;
    const sy1=0.5,sy2=1.8,topZ=2.8;
    line(0,sy1,0,0,sy1,topZ*S.shelf,1,1,0.8); line(0,sy2,0,0,sy2,topZ*S.shelf,1,1,0.8);
    const numS=5;
    for (let i=0;i<=numS;i++) { const sz=(topZ/numS)*i; if(sz>topZ*S.shelf) break; const sp=Math.max(0,(S.shelf-i*0.1)/0.5); line(0,sy1,sz,0,sy2,sz,Math.min(sp,1),0.7,0.55); line(0,sy1,sz,0.35,sy1,sz,Math.min(sp,1)*0.5,0.4,0.25); }
    if (S.shelf > 0.6) {
      const bp=(S.shelf-0.6)/0.4;
      const books=[[sy1+0.1,0.05,0.45],[sy1+0.25,0.05,0.5],[sy1+0.4,0.05,0.38],[sy1+0.55,0.05,0.42],[sy1+0.7,0.05,0.47],[sy1+0.9,0.05,0.35],[sy1+0.15,topZ/numS+0.05,0.48],[sy1+0.35,topZ/numS+0.05,0.4],[sy1+0.55,topZ/numS+0.05,0.44],[sy1+0.8,topZ/numS+0.05,0.38],[sy1+0.1,topZ/numS*2+0.05,0.42],[sy1+0.3,topZ/numS*2+0.05,0.5]];
      books.forEach((b,i)=>{ const bookP=Math.max(0,Math.min(1,(bp-i*0.04)*2.5)); if(bookP>0) line(0,b[0],b[1],0,b[0],b[1]+b[2]*bookP,1,0.5,0.3); });
    }
  }

  function drawLamp() {
    if (S.lamp <= 0) return;
    const lx=6,ly=4.2;
    const bp=Math.min(S.lamp*2,1); const base=iso(lx,ly,0); ctx.beginPath(); ctx.ellipse(base.x,base.y,7*bp,4*bp,-Math.PI/6,0,Math.PI*2); ctx.strokeStyle=goldAlpha(0.5*bp); ctx.lineWidth=0.7; ctx.stroke();
    if (S.lamp>0.2) { const pp=(S.lamp-0.2)/0.5; line(lx,ly,0,lx,ly,2.8*Math.min(pp,1),1,1,0.8); }
    if (S.lamp>0.65) {
      const sp=(S.lamp-0.65)/0.35;
      lineSeq([[lx-0.4,ly-0.3,3.2,lx,ly,2.8],[lx,ly,2.8,lx+0.4,ly+0.3,3.2],[lx+0.4,ly+0.3,3.2,lx+0.4,ly-0.2,3.2],[lx+0.4,ly-0.2,3.2,lx-0.4,ly-0.3,3.2],[lx-0.4,ly-0.3,3.2,lx-0.4,ly+0.2,3.2]], sp, 0.9, 0.7);
      if (sp>0.8) { const ga=(sp-0.8)/0.2; const center=iso(lx,ly,2.6); const grad=ctx.createRadialGradient(center.x,center.y,0,center.x,center.y,40*ga); grad.addColorStop(0,goldAlpha(0.1*ga)); grad.addColorStop(1,'rgba(194,164,126,0)'); ctx.fillStyle=grad; ctx.fillRect(center.x-50,center.y-50,100,100); }
    }
  }

  function drawPlant() {
    if (S.plant <= 0) return;
    const px=6.2,py=0.6;
    lineSeq([[px-0.2,py-0.15,0,px-0.25,py-0.2,0.4],[px-0.25,py-0.2,0.4,px+0.25,py+0.2,0.4],[px+0.25,py+0.2,0.4,px+0.2,py+0.15,0],[px+0.2,py+0.15,0,px-0.2,py-0.15,0]], S.plant, 0.8, 0.6);
    if (S.plant > 0.4) {
      const sp=(S.plant-0.4)/0.6;
      [{dx:-0.1,dy:-0.08,h:0.9},{dx:0.05,dy:0.05,h:1.1},{dx:-0.15,dy:0.1,h:0.8},{dx:0.12,dy:-0.06,h:1.0}].forEach((s,i)=>{
        const stemP=Math.max(0,Math.min(1,(sp-i*0.12)*2));
        if (stemP>0) {
          line(px,py,0.4,px+s.dx,py+s.dy,0.4+s.h*stemP,1,0.6,0.45);
          if (stemP>0.7) { const lp2=(stemP-0.7)/0.3; const leafEnd=iso(px+s.dx*3,py+s.dy*2.5,0.4+s.h-0.1); const leafStart=iso(px+s.dx,py+s.dy,0.4+s.h*stemP); ctx.beginPath(); ctx.moveTo(leafStart.x,leafStart.y); ctx.quadraticCurveTo(leafStart.x+(leafEnd.x-leafStart.x)*0.5+5,leafStart.y-8,leafEnd.x,leafEnd.y); ctx.strokeStyle=goldAlpha(0.35*lp2); ctx.lineWidth=0.6; ctx.stroke(); }
        }
      });
    }
  }

  function drawPicture() {
    if (S.picture <= 0) return;
    const px1=5.3,px2=6.5,pz1=2.0,pz2=2.9;
    lineSeq([[px1,0,pz1,px2,0,pz1],[px2,0,pz1,px2,0,pz2],[px2,0,pz2,px1,0,pz2],[px1,0,pz2,px1,0,pz1]], S.picture, 0.9, 0.6);
    if (S.picture>0.6) { const ip=(S.picture-0.6)/0.4; const m=0.1; lineSeq([[px1+m,0,pz1+m,px2-m,0,pz1+m],[px2-m,0,pz1+m,px2-m,0,pz2-m],[px2-m,0,pz2-m,px1+m,0,pz2-m],[px1+m,0,pz2-m,px1+m,0,pz1+m]], ip, 0.5, 0.3); }
  }

  function drawRug() {
    if (S.rug <= 0) return;
    const rx=2,ry=1.5,rw=3.2,rd=2.2;
    lineSeq([[rx,ry,0.01,rx+rw,ry,0.01],[rx+rw,ry,0.01,rx+rw,ry+rd,0.01],[rx+rw,ry+rd,0.01,rx,ry+rd,0.01],[rx,ry+rd,0.01,rx,ry,0.01]], S.rug, 0.7, 0.35);
    if (S.rug>0.5) { const ip=(S.rug-0.5)*2; const m=0.25; lineSeq([[rx+m,ry+m,0.01,rx+rw-m,ry+m,0.01],[rx+rw-m,ry+m,0.01,rx+rw-m,ry+rd-m,0.01],[rx+rw-m,ry+rd-m,0.01,rx+m,ry+rd-m,0.01],[rx+m,ry+rd-m,0.01,rx+m,ry+m,0.01]], ip, 0.5, 0.2); }
  }

  function drawDimensions() {
    if (S.dims <= 0) return;
    [[0,0,0],[RW,0,0],[0,RD,0],[RW,RD,0],[0,0,RH],[RW,0,RH]].forEach((c,i)=>{ cross(c[0],c[1],c[2],Math.max(0,(S.dims-i*0.05)/0.5)); });
    const dp=Math.max(0,(S.dims-0.2)/0.8);
    dashed(0,RD+0.6,0,RW,RD+0.6,0,dp,0.3); line(0,RD+0.4,0,0,RD+0.8,0,dp,0.5,0.25); line(RW,RD+0.4,0,RW,RD+0.8,0,dp,0.5,0.25);
    dashed(RW+0.6,0,0,RW+0.6,0,RH,dp,0.3); line(RW+0.4,0,0,RW+0.8,0,0,dp,0.5,0.25); line(RW+0.4,0,RH,RW+0.8,0,RH,dp,0.5,0.25);
    if (S.dims>0.5) { const tp=(S.dims-0.5)/0.5; ctx.font=`300 ${Math.max(9,Math.min(11,W*0.008))}px Montserrat, sans-serif`; ctx.textAlign='center'; ctx.fillStyle=goldAlpha(0.35*tp); const wMid=iso(RW/2,RD+1,0); ctx.fillText('7 000 mm',wMid.x,wMid.y); const hMid=iso(RW+1,0,RH/2); ctx.fillText('3 800 mm',hMid.x,hMid.y); }
  }

  function drawGlow() {
    if (S.glow <= 0) return;
    const wCenter=iso(3,0,2.1); const r=Math.min(W,H)*0.5;
    const grad=ctx.createRadialGradient(wCenter.x,wCenter.y,0,wCenter.x,wCenter.y,r*S.glow);
    grad.addColorStop(0,goldAlpha(0.08*S.glow)); grad.addColorStop(0.4,goldAlpha(0.03*S.glow)); grad.addColorStop(1,'rgba(194,164,126,0)');
    ctx.fillStyle=grad; ctx.fillRect(0,0,W,H);
    if (S.glow>0.3) { const bp2=(S.glow-0.3)/0.7; ctx.globalAlpha=bp2*0.06*(1-S.fadeOut); const w1=iso(1.5,0,2.5),w2=iso(4.5,0,2.5),f1=iso(1,3,0),f2=iso(5,3.5,0); ctx.beginPath(); ctx.moveTo(w1.x,w1.y); ctx.lineTo(w2.x,w2.y); ctx.lineTo(f2.x,f2.y); ctx.lineTo(f1.x,f1.y); ctx.closePath(); ctx.fillStyle='rgba(194,164,126,0.5)'; ctx.fill(); ctx.globalAlpha=1; }
  }

  function drawParticles() {
    if (S.particles <= 0) return;
    dustParticles.forEach(p => {
      // Scroll-driven: shift Y based on scroll progress
      const scrollY = (p.baseY + S.particles * 0.5) % 1;
      const driftX = p.x + p.drift * S.particles;
      const dx = ((driftX % 1) + 1) % 1;
      ctx.beginPath();
      ctx.arc(dx * W, scrollY * H, p.size, 0, Math.PI * 2);
      ctx.fillStyle = goldAlpha(p.alpha * S.particles);
      ctx.fill();
    });
  }

  // ═══ RENDER (called on every scroll tick) ═══
  function render() {
    ctx.clearRect(0, 0, W, H);
    drawGlow(); drawGrid(); drawRug(); drawFloor(); drawWalls(); drawCeiling();
    drawWindow(); drawDoor(); drawShelf(); drawPicture(); drawTable(); drawChair();
    drawLamp(); drawPlant(); drawDimensions(); drawParticles();
  }

  // ═══ SCROLL-DRIVEN GSAP TIMELINE ═══
  // Maps original timed phases (0–5.4s) → scroll progress (0–1)
  // Total original duration = 5.4s, so we normalize all times by /5.4

  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: wrap,
      start: 'top 80%',
      end: 'bottom 20%',
      scrub: 0.5,
      onUpdate: () => render(),
    }
  });

  // Phase 1: Grid + Floor (0 – 0.19)
  tl.to(S, { grid: 1, duration: 0.8, ease: 'none' }, 0);
  tl.to(S, { particles: 0.5, duration: 1, ease: 'none' }, 0);
  tl.to(S, { floor: 1, duration: 0.8, ease: 'none' }, 0.25);

  // Phase 2: Walls rise (0.7 – 2.2)
  tl.to(S, { wallR: 1, duration: 1, ease: 'none' }, 0.7);
  tl.to(S, { wallL: 1, duration: 1, ease: 'none' }, 0.85);
  tl.to(S, { ceiling: 1, duration: 0.6, ease: 'none' }, 1.6);

  // Phase 3: Window + Door
  tl.to(S, { window: 1, duration: 0.8, ease: 'none' }, 1.6);
  tl.to(S, { door: 1, duration: 0.6, ease: 'none' }, 2.0);

  // Phase 4: Furniture
  tl.to(S, { rug: 1, duration: 0.6, ease: 'none' }, 2.2);
  tl.to(S, { table: 1, duration: 0.9, ease: 'none' }, 2.3);
  tl.to(S, { chair: 1, duration: 0.8, ease: 'none' }, 2.6);
  tl.to(S, { shelf: 1, duration: 0.9, ease: 'none' }, 2.4);
  tl.to(S, { lamp: 1, duration: 0.8, ease: 'none' }, 2.8);
  tl.to(S, { plant: 1, duration: 0.7, ease: 'none' }, 3.0);
  tl.to(S, { picture: 1, duration: 0.5, ease: 'none' }, 3.1);

  // Phase 5: Dimensions
  tl.to(S, { dims: 1, duration: 0.7, ease: 'none' }, 3.3);

  // Phase 6: Golden light
  tl.to(S, { glow: 1, duration: 1.2, ease: 'none' }, 3.6);
  tl.to(S, { particles: 0.8, duration: 0.8, ease: 'none' }, 3.8);

  // Hold completed state (no dissolve — room stays visible as backdrop)
  tl.to({}, { duration: 0.8 }, 4.8);

  // Initial render (blank canvas visible before scroll)
  render();
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
    gsap.set(frame, { opacity: 0, y: 20 });
    gsap.to(frame, {
      opacity: 0.4, y: 0, duration: 1, delay: 0.8, ease: 'power2.out',
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
        toggleActions: 'play none none none'
      }
    });
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

  // Animate transition — clean fade
  const modal = document.getElementById('project-modal');
  const img = modal?.querySelector('.project-modal-image');
  if (img) {
    gsap.to(img, {
      opacity: 0, duration: 0.2, ease: 'power2.in',
      onComplete: () => {
        updateModalContent();
        gsap.fromTo(img,
          { opacity: 0 },
          { opacity: 1, duration: 0.3, ease: 'power2.out' }
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
  initProcessCanvas();
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

// ═══ BOOT — no loader, instant init ═══
window.addEventListener('load', () => {
  initAll();
});
