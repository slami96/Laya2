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
//  PROCESS — WIREFRAME ROOM CANVAS
//  Time-based animation, triggered on scroll
// ═══════════════════════════════════════
function initProcessCanvas() {
  const section = document.querySelector('.process-section');
  const canvas = document.getElementById('process-canvas');
  if (!section || !canvas) { console.warn('initProcessCanvas: elements not found'); return; }

  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  let W, H, running = false, played = false;

  function resize() {
    W = section.offsetWidth;
    H = section.offsetHeight;
    canvas.width = W * dpr;
    canvas.height = H * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    recalcIso();
  }

  const COS30 = Math.cos(Math.PI / 6);
  const SIN30 = 0.5;
  let isoScale, isoOffX, isoOffY;
  const RW = 7, RD = 5.5, RH = 3.8;

  function recalcIso() {
    if (!W || !H) return;
    isoScale = Math.min(W, H) * 0.060;
    isoOffX = W * 0.5 - (RW / 2 - RD / 2) * COS30 * isoScale;
    isoOffY = H * 0.5 - ((RW / 2 + RD / 2) * SIN30 - RH / 2) * isoScale;
  }

  function iso(x, y, z) {
    return {
      x: (x - y) * COS30 * isoScale + isoOffX,
      y: ((x + y) * SIN30 - z) * isoScale + isoOffY
    };
  }

  const S = {
    grid: 0, floor: 0, wallL: 0, wallR: 0, ceiling: 0,
    window: 0, door: 0, table: 0, chair: 0, shelf: 0,
    lamp: 0, plant: 0, picture: 0, rug: 0,
    dims: 0, glow: 0, particles: 0, fadeOut: 0,
  };

  function ink(a) { return 'rgba(35,30,25,' + (a * (1 - S.fadeOut)) + ')'; }

  function penTip(p, prog) {
    if (prog <= 0 || prog >= 1) return;
    ctx.beginPath(); ctx.arc(p.x, p.y, 3, 0, Math.PI * 2);
    ctx.fillStyle = ink(0.6); ctx.fill();
    ctx.beginPath(); ctx.arc(p.x, p.y, 8, 0, Math.PI * 2);
    ctx.fillStyle = ink(0.12); ctx.fill();
  }

  function ln(ax, ay, az, bx, by, bz, prog, lw, alpha) {
    if (prog <= 0) return;
    var p = Math.min(prog, 1);
    var a = iso(ax, ay, az), b = iso(bx, by, bz);
    var ex = a.x + (b.x - a.x) * p, ey = a.y + (b.y - a.y) * p;
    ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(ex, ey);
    ctx.strokeStyle = ink(alpha != null ? alpha : 0.8);
    ctx.lineWidth = lw || 1.2; ctx.stroke();
    penTip({ x: ex, y: ey }, prog);
  }

  function lnSeq(arr, prog, lw, alpha) {
    if (prog <= 0) return;
    var n = arr.length;
    for (var i = 0; i < n; i++) {
      var seg = Math.max(0, Math.min(1, (prog - i / n) / (1 / n)));
      var l = arr[i];
      ln(l[0], l[1], l[2], l[3], l[4], l[5], seg, lw, alpha);
    }
  }

  function dashed(ax, ay, az, bx, by, bz, prog, alpha) {
    if (prog <= 0) return;
    var p = Math.min(prog, 1);
    var a = iso(ax, ay, az), b = iso(bx, by, bz);
    ctx.save(); ctx.setLineDash([3, 4]);
    ctx.beginPath(); ctx.moveTo(a.x, a.y);
    ctx.lineTo(a.x + (b.x - a.x) * p, a.y + (b.y - a.y) * p);
    ctx.strokeStyle = ink(alpha || 0.25); ctx.lineWidth = 0.6; ctx.stroke();
    ctx.restore();
  }

  function cross(x, y, z, prog) {
    if (prog <= 0) return;
    var s = 4 * Math.min(prog, 1), c = iso(x, y, z);
    ctx.beginPath();
    ctx.moveTo(c.x - s, c.y); ctx.lineTo(c.x + s, c.y);
    ctx.moveTo(c.x, c.y - s); ctx.lineTo(c.x, c.y + s);
    ctx.strokeStyle = ink(0.35 * Math.min(prog, 1));
    ctx.lineWidth = 0.6; ctx.stroke();
  }

  function fillQ(ax, ay, az, bx, by, bz, cx, cy, cz, dx, dy, dz, col) {
    var a = iso(ax, ay, az), b = iso(bx, by, bz), c = iso(cx, cy, cz), d = iso(dx, dy, dz);
    ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y);
    ctx.lineTo(c.x, c.y); ctx.lineTo(d.x, d.y); ctx.closePath();
    ctx.fillStyle = col; ctx.fill();
  }

  var dust = [];
  for (var i = 0; i < 50; i++) dust.push({ x: Math.random(), y: Math.random(), size: Math.random() * 1.5 + 0.5, speed: Math.random() * 0.0003 + 0.0001, drift: (Math.random() - 0.5) * 0.0002, alpha: Math.random() * 0.3 + 0.08 });

  // === DRAW FUNCTIONS ===
  function drawGrid() {
    if (S.grid <= 0) return;
    ctx.globalAlpha = S.grid * 0.15 * (1 - S.fadeOut);
    for (var i = 0; i <= RW; i++) ln(i, 0, 0, i, RD, 0, 1, 0.3, 0.12);
    for (var j = 0; j <= 5; j++) ln(0, j, 0, RW, j, 0, 1, 0.3, 0.12);
    ctx.globalAlpha = 1;
  }
  function drawFloor() { lnSeq([[0,0,0,RW,0,0],[RW,0,0,RW,RD,0],[RW,RD,0,0,RD,0],[0,RD,0,0,0,0]], S.floor, 1.5, 0.8); }
  function drawWalls() {
    if (S.wallL > 0) { var h = RH * S.wallL; ln(0,0,0,0,0,h,1,1.5,0.9); ln(0,RD,0,0,RD,h,1,1.5,0.9); if (S.wallL >= 1) ln(0,0,RH,0,RD,RH,1,1.5,0.9); if (S.wallL > 0.6) fillQ(0,0,0,0,RD,0,0,RD,h,0,0,h,ink((S.wallL-0.6)/0.4*0.025)); }
    if (S.wallR > 0) { var h2 = RH * S.wallR; ln(0,0,0,0,0,h2,1,1.3,0.85); ln(RW,0,0,RW,0,h2,1,1.3,0.85); if (S.wallR >= 1) ln(0,0,RH,RW,0,RH,1,1.3,0.85); if (S.wallR > 0.6) fillQ(0,0,0,RW,0,0,RW,0,h2,0,0,h2,ink((S.wallR-0.6)/0.4*0.02)); }
  }
  function drawCeiling() { if (S.ceiling <= 0) return; lnSeq([[0,0,RH,RW,0,RH],[RW,0,RH,RW,RD,RH],[RW,RD,RH,0,RD,RH],[0,RD,RH,0,0,RH]], S.ceiling, 0.7, 0.35); }
  function drawWindow() {
    if (S.window <= 0) return;
    lnSeq([[1.5,0,1.2,4.5,0,1.2],[4.5,0,1.2,4.5,0,3],[4.5,0,3,1.5,0,3],[1.5,0,3,1.5,0,1.2]], S.window, 1.4, 0.9);
    var mp = Math.max(0,(S.window-0.5)/0.5); ln(3,0,1.2,3,0,3,mp,0.8,0.6); ln(1.5,0,2.1,4.5,0,2.1,mp,0.8,0.6);
    var sp = Math.max(0,(S.window-0.7)/0.3); ln(1.35,0.1,1.2,4.65,0.1,1.2,sp,0.9,0.7);
    if (S.window > 0.8) fillQ(1.5,0,1.2,4.5,0,1.2,4.5,0,3,1.5,0,3,ink((S.window-0.8)/0.2*0.04));
  }
  function drawDoor() {
    if (S.door <= 0) return;
    lnSeq([[0,3.5,0,0,3.5,2.8],[0,3.5,2.8,0,4.5,2.8],[0,4.5,2.8,0,4.5,0]], S.door, 1.2, 0.8);
    if (S.door > 0.7) { var hp=(S.door-0.7)/0.3; var h=iso(0,3.65,1.3); ctx.beginPath(); ctx.arc(h.x,h.y,2.5*hp,0,Math.PI*2); ctx.strokeStyle=ink(0.6*hp); ctx.lineWidth=0.8; ctx.stroke(); }
  }
  function drawTable() {
    if (S.table <= 0) return;
    var tx=2.5,ty=2,tw=2.2,td=1.4,th=1.05;
    lnSeq([[tx,ty,th,tx+tw,ty,th],[tx+tw,ty,th,tx+tw,ty+td,th],[tx+tw,ty+td,th,tx,ty+td,th],[tx,ty+td,th,tx,ty,th]], S.table, 1.3, 0.85);
    var lp=Math.max(0,(S.table-0.4)/0.6);
    [[tx+0.12,ty+0.12],[tx+tw-0.12,ty+0.12],[tx+tw-0.12,ty+td-0.12],[tx+0.12,ty+td-0.12]].forEach(function(c){ln(c[0],c[1],th,c[0],c[1],th-th*lp,1,0.7,0.5);});
    if (S.table > 0.7) {
      var ip=(S.table-0.7)/0.3;
      lnSeq([[tx+0.4,ty+0.3,th,tx+1.3,ty+0.3,th],[tx+1.3,ty+0.3,th,tx+1.3,ty+1,th],[tx+1.3,ty+1,th,tx+0.4,ty+1,th],[tx+0.4,ty+1,th,tx+0.4,ty+0.3,th]], ip, 0.6, 0.35);
      if (ip>0.5){var sc=(ip-0.5)*2;ln(tx+0.4,ty+0.3,th,tx+0.4,ty+0.25,th+0.6*sc,1,0.6,0.35);ln(tx+1.3,ty+0.3,th,tx+1.3,ty+0.25,th+0.6*sc,1,0.6,0.35);if(sc>0.8)ln(tx+0.4,ty+0.25,th+0.6,tx+1.3,ty+0.25,th+0.6,1,0.6,0.35);}
      if (ip>0.3){var m2=(ip-0.3)/0.7;var mc=iso(tx+1.7,ty+0.6,th);ctx.beginPath();ctx.arc(mc.x,mc.y,4*m2,0,Math.PI*2);ctx.strokeStyle=ink(0.35*m2);ctx.lineWidth=0.7;ctx.stroke();ln(tx+1.7,ty+0.6,th,tx+1.7,ty+0.6,th+0.2*m2,1,0.5,0.25);}
    }
  }
  function drawChair() {
    if (S.chair <= 0) return;
    function one(cx,cy,bk){
      var cw=0.55,cd=0.55,sh=0.6,bkH=1.15;
      lnSeq([[cx,cy,sh,cx+cw,cy,sh],[cx+cw,cy,sh,cx+cw,cy+cd,sh],[cx+cw,cy+cd,sh,cx,cy+cd,sh],[cx,cy+cd,sh,cx,cy,sh]],S.chair,0.9,0.65);
      var lp=Math.max(0,(S.chair-0.3)/0.5);
      [[cx,cy],[cx+cw,cy],[cx+cw,cy+cd],[cx,cy+cd]].forEach(function(c){ln(c[0],c[1],sh,c[0],c[1],sh-sh*lp,1,0.6,0.4);});
      var bp=Math.max(0,(S.chair-0.6)/0.4);
      if(bp>0){if(bk==='y0'){ln(cx,cy,sh,cx,cy,bkH*bp+sh*(1-bp),1,0.9,0.65);ln(cx+cw,cy,sh,cx+cw,cy,bkH*bp+sh*(1-bp),1,0.9,0.65);if(bp>0.7)ln(cx,cy,bkH,cx+cw,cy,bkH,(bp-0.7)/0.3,0.9,0.65);}else{ln(cx,cy+cd,sh,cx,cy+cd,bkH*bp+sh*(1-bp),1,0.9,0.65);ln(cx+cw,cy+cd,sh,cx+cw,cy+cd,bkH*bp+sh*(1-bp),1,0.9,0.65);if(bp>0.7)ln(cx,cy+cd,bkH,cx+cw,cy+cd,bkH,(bp-0.7)/0.3,0.9,0.65);}}
    }
    one(3.1,1.1,'y0'); one(3.1,3.3,'yD');
  }
  function drawShelf() {
    if (S.shelf <= 0) return;
    var sy1=0.5,sy2=1.8,tz=2.8;
    ln(0,sy1,0,0,sy1,tz*S.shelf,1,1,0.8); ln(0,sy2,0,0,sy2,tz*S.shelf,1,1,0.8);
    for(var i=0;i<=5;i++){var sz=(tz/5)*i;if(sz>tz*S.shelf)break;var sp=Math.max(0,(S.shelf-i*0.1)/0.5);ln(0,sy1,sz,0,sy2,sz,Math.min(sp,1),0.7,0.55);ln(0,sy1,sz,0.35,sy1,sz,Math.min(sp,1)*0.5,0.4,0.25);}
    if(S.shelf>0.6){var bp=(S.shelf-0.6)/0.4;[[sy1+0.1,0.05,0.45],[sy1+0.25,0.05,0.5],[sy1+0.4,0.05,0.38],[sy1+0.55,0.05,0.42],[sy1+0.7,0.05,0.47],[sy1+0.9,0.05,0.35],[sy1+0.15,tz/5+0.05,0.48],[sy1+0.35,tz/5+0.05,0.4],[sy1+0.55,tz/5+0.05,0.44],[sy1+0.8,tz/5+0.05,0.38],[sy1+0.1,tz/5*2+0.05,0.42],[sy1+0.3,tz/5*2+0.05,0.5]].forEach(function(b,i){var bP=Math.max(0,Math.min(1,(bp-i*0.04)*2.5));if(bP>0)ln(0,b[0],b[1],0,b[0],b[1]+b[2]*bP,1,0.5,0.3);});}
  }
  function drawLamp() {
    if (S.lamp <= 0) return;
    var lx=6,ly=4.2,bp=Math.min(S.lamp*2,1),base=iso(lx,ly,0);
    ctx.beginPath();ctx.ellipse(base.x,base.y,7*bp,4*bp,-Math.PI/6,0,Math.PI*2);ctx.strokeStyle=ink(0.5*bp);ctx.lineWidth=0.7;ctx.stroke();
    if(S.lamp>0.2)ln(lx,ly,0,lx,ly,2.8*Math.min((S.lamp-0.2)/0.5,1),1,1,0.8);
    if(S.lamp>0.65){var sp=(S.lamp-0.65)/0.35;lnSeq([[lx-0.4,ly-0.3,3.2,lx,ly,2.8],[lx,ly,2.8,lx+0.4,ly+0.3,3.2],[lx+0.4,ly+0.3,3.2,lx+0.4,ly-0.2,3.2],[lx+0.4,ly-0.2,3.2,lx-0.4,ly-0.3,3.2],[lx-0.4,ly-0.3,3.2,lx-0.4,ly+0.2,3.2]],sp,0.9,0.7);if(sp>0.8){var ga=(sp-0.8)/0.2;var c=iso(lx,ly,2.6);var g=ctx.createRadialGradient(c.x,c.y,0,c.x,c.y,40*ga);g.addColorStop(0,ink(0.06*ga));g.addColorStop(1,'rgba(35,30,25,0)');ctx.fillStyle=g;ctx.fillRect(c.x-50,c.y-50,100,100);}}
  }
  function drawPlant() {
    if (S.plant <= 0) return;
    var px=6.2,py=0.6;
    lnSeq([[px-0.2,py-0.15,0,px-0.25,py-0.2,0.4],[px-0.25,py-0.2,0.4,px+0.25,py+0.2,0.4],[px+0.25,py+0.2,0.4,px+0.2,py+0.15,0],[px+0.2,py+0.15,0,px-0.2,py-0.15,0]],S.plant,0.8,0.6);
    if(S.plant>0.4){var sp=(S.plant-0.4)/0.6;[{dx:-0.1,dy:-0.08,h:0.9},{dx:0.05,dy:0.05,h:1.1},{dx:-0.15,dy:0.1,h:0.8},{dx:0.12,dy:-0.06,h:1.0}].forEach(function(s,i){var sP=Math.max(0,Math.min(1,(sp-i*0.12)*2));if(sP>0){ln(px,py,0.4,px+s.dx,py+s.dy,0.4+s.h*sP,1,0.6,0.45);if(sP>0.7){var lp2=(sP-0.7)/0.3;var le=iso(px+s.dx*3,py+s.dy*2.5,0.4+s.h-0.1),ls=iso(px+s.dx,py+s.dy,0.4+s.h*sP);ctx.beginPath();ctx.moveTo(ls.x,ls.y);ctx.quadraticCurveTo(ls.x+(le.x-ls.x)*0.5+5,ls.y-8,le.x,le.y);ctx.strokeStyle=ink(0.35*lp2);ctx.lineWidth=0.6;ctx.stroke();}}});}
  }
  function drawPicture() {
    if (S.picture <= 0) return;
    lnSeq([[5.3,0,2,6.5,0,2],[6.5,0,2,6.5,0,2.9],[6.5,0,2.9,5.3,0,2.9],[5.3,0,2.9,5.3,0,2]],S.picture,0.9,0.6);
    if(S.picture>0.6){var ip=(S.picture-0.6)/0.4;lnSeq([[5.4,0,2.1,6.4,0,2.1],[6.4,0,2.1,6.4,0,2.8],[6.4,0,2.8,5.4,0,2.8],[5.4,0,2.8,5.4,0,2.1]],ip,0.5,0.3);}
  }
  function drawRug() {
    if (S.rug <= 0) return;
    lnSeq([[2,1.5,0.01,5.2,1.5,0.01],[5.2,1.5,0.01,5.2,3.7,0.01],[5.2,3.7,0.01,2,3.7,0.01],[2,3.7,0.01,2,1.5,0.01]],S.rug,0.7,0.35);
    if(S.rug>0.5){var ip=(S.rug-0.5)*2;lnSeq([[2.25,1.75,0.01,4.95,1.75,0.01],[4.95,1.75,0.01,4.95,3.45,0.01],[4.95,3.45,0.01,2.25,3.45,0.01],[2.25,3.45,0.01,2.25,1.75,0.01]],ip,0.5,0.2);}
  }
  function drawDims() {
    if (S.dims <= 0) return;
    [[0,0,0],[RW,0,0],[0,RD,0],[RW,RD,0],[0,0,RH],[RW,0,RH]].forEach(function(c,i){cross(c[0],c[1],c[2],Math.max(0,(S.dims-i*0.05)/0.5));});
    var dp=Math.max(0,(S.dims-0.2)/0.8);
    dashed(0,RD+0.6,0,RW,RD+0.6,0,dp,0.3);ln(0,RD+0.4,0,0,RD+0.8,0,dp,0.5,0.25);ln(RW,RD+0.4,0,RW,RD+0.8,0,dp,0.5,0.25);
    dashed(RW+0.6,0,0,RW+0.6,0,RH,dp,0.3);ln(RW+0.4,0,0,RW+0.8,0,0,dp,0.5,0.25);ln(RW+0.4,0,RH,RW+0.8,0,RH,dp,0.5,0.25);
    if(S.dims>0.5){var tp=(S.dims-0.5)/0.5;ctx.font='300 '+Math.max(9,Math.min(11,W*0.008))+'px Montserrat,sans-serif';ctx.textAlign='center';ctx.fillStyle=ink(0.35*tp);var wM=iso(RW/2,RD+1,0);ctx.fillText('7 000 mm',wM.x,wM.y);var hM=iso(RW+1,0,RH/2);ctx.fillText('3 800 mm',hM.x,hM.y);}
  }
  function drawGlow() {
    if (S.glow <= 0) return;
    var wC=iso(3,0,2.1),r=Math.min(W,H)*0.5;
    var g=ctx.createRadialGradient(wC.x,wC.y,0,wC.x,wC.y,r*S.glow);
    g.addColorStop(0,ink(0.05*S.glow));g.addColorStop(0.4,ink(0.02*S.glow));g.addColorStop(1,'rgba(35,30,25,0)');
    ctx.fillStyle=g;ctx.fillRect(0,0,W,H);
    if(S.glow>0.3){var bp2=(S.glow-0.3)/0.7;ctx.globalAlpha=bp2*0.04*(1-S.fadeOut);var w1=iso(1.5,0,2.5),w2=iso(4.5,0,2.5),f1=iso(1,3,0),f2=iso(5,3.5,0);ctx.beginPath();ctx.moveTo(w1.x,w1.y);ctx.lineTo(w2.x,w2.y);ctx.lineTo(f2.x,f2.y);ctx.lineTo(f1.x,f1.y);ctx.closePath();ctx.fillStyle='rgba(35,30,25,0.15)';ctx.fill();ctx.globalAlpha=1;}
  }
  function drawParticles() {
    if (S.particles <= 0) return;
    dust.forEach(function(p) {
      p.y -= p.speed; p.x += p.drift;
      if (p.y < -0.02) { p.y = 1.02; p.x = Math.random(); }
      if (p.x < 0 || p.x > 1) p.x = Math.random();
      ctx.beginPath(); ctx.arc(p.x * W, p.y * H, p.size, 0, Math.PI * 2);
      ctx.fillStyle = ink(p.alpha * S.particles); ctx.fill();
    });
  }

  // === RENDER LOOP ===
  function render() {
    if (!running) return;
    ctx.clearRect(0, 0, W, H);
    drawGlow(); drawGrid(); drawRug(); drawFloor(); drawWalls(); drawCeiling();
    drawWindow(); drawDoor(); drawShelf(); drawPicture(); drawTable(); drawChair();
    drawLamp(); drawPlant(); drawDims(); drawParticles();
    requestAnimationFrame(render);
  }

  // === TIMELINE (paused, time-based) ===
  resize();
  window.addEventListener('resize', function() { resize(); });

  var tl = gsap.timeline({ paused: true, onComplete: function() {
    document.dispatchEvent(new CustomEvent('roomAnimationDone'));
  }});
  tl.to(S, { grid: 1, duration: 0.8, ease: 'power2.out' }, 0);
  tl.to(S, { particles: 0.5, duration: 1, ease: 'power1.in' }, 0);
  tl.to(S, { floor: 1, duration: 0.8, ease: 'power2.inOut' }, 0.25);
  tl.to(S, { wallR: 1, duration: 1, ease: 'power2.out' }, 0.7);
  tl.to(S, { wallL: 1, duration: 1, ease: 'power2.out' }, 0.85);
  tl.to(S, { ceiling: 1, duration: 0.6, ease: 'power2.out' }, 1.6);
  tl.to(S, { window: 1, duration: 0.8, ease: 'power2.inOut' }, 1.6);
  tl.to(S, { door: 1, duration: 0.6, ease: 'power2.out' }, 2.0);
  tl.to(S, { rug: 1, duration: 0.6, ease: 'power2.out' }, 2.2);
  tl.to(S, { table: 1, duration: 0.9, ease: 'power2.out' }, 2.3);
  tl.to(S, { chair: 1, duration: 0.8, ease: 'power2.out' }, 2.6);
  tl.to(S, { shelf: 1, duration: 0.9, ease: 'power2.out' }, 2.4);
  tl.to(S, { lamp: 1, duration: 0.8, ease: 'power2.out' }, 2.8);
  tl.to(S, { plant: 1, duration: 0.7, ease: 'power2.out' }, 3.0);
  tl.to(S, { picture: 1, duration: 0.5, ease: 'power2.out' }, 3.1);
  tl.to(S, { dims: 1, duration: 0.7, ease: 'power2.out' }, 3.3);
  tl.to(S, { glow: 1, duration: 1.2, ease: 'power2.inOut' }, 3.6);
  tl.to(S, { particles: 0.8, duration: 0.8, ease: 'power1.in' }, 3.8);

  // === TRIGGER: play once when section enters viewport ===
  ScrollTrigger.create({
    trigger: section,
    start: 'top 75%',
    onEnter: function() {
      if (played) return;
      played = true;
      running = true;
      resize();
      requestAnimationFrame(render);
      tl.play(0);
      console.log('Process canvas playing:', W, 'x', H);
    }
  });

  console.log('initProcessCanvas: ready, waiting for scroll trigger');
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

  // Hide cards initially — they wait for wireframe animation
  gsap.set(cards, { opacity: 0, y: 60 });

  // Listen for custom event dispatched when room animation completes
  document.addEventListener('roomAnimationDone', function() {
    gsap.to(cards, {
      opacity: 1, y: 0, duration: 0.8,
      stagger: 0.15, ease: 'power2.out'
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

  const inits = [
    initLenis, initScrollProgress, initHeader, initMobileMenu,
    initScrollIndicator, initHero, initAbout, initHorizontalScroll,
    initProcessCanvas, initStackingCards, initShowcase,
    initProjectModal, initContact, initFooter,
    initMagneticEffects, initVelocitySkew, initSectionReveals
  ];

  inits.forEach(fn => {
    try { fn(); }
    catch (e) { console.error(`${fn.name} failed:`, e); }
  });

  setTimeout(() => {
    ScrollTrigger.refresh(true);
    console.log('LAYA V2 — Ready.');
  }, 600);

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
