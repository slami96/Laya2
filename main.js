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
function initServices() {
  // Accordion (one open at a time)
  const items = gsap.utils.toArray('.srv-item');
  function setBody(item) {
    const b = item.querySelector('.srv-body');
    if (b) b.style.maxHeight = item.classList.contains('open') ? b.scrollHeight + 'px' : '0px';
  }
  items.forEach(function (item) {
    const head = item.querySelector('.srv-head');
    if (!head) return;
    head.addEventListener('click', function () {
      const isOpen = item.classList.contains('open');
      items.forEach(function (i) { i.classList.remove('open'); setBody(i); });
      if (!isOpen) { item.classList.add('open'); setBody(item); }
    });
  });
  requestAnimationFrame(function () { items.forEach(setBody); });
  window.addEventListener('resize', function () { items.forEach(setBody); });
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

  const video = document.querySelector('.hero-video');
  const slideshow = document.getElementById('hero-slideshow');
  const slides = gsap.utils.toArray('.hero-slide');
  const btnWrap = document.querySelector('.hero-btn-wrap');
  const lineInners = gsap.utils.toArray('.hero-title .line-inner');

  // Intro: split-text reveal + button
  const introTl = gsap.timeline({ delay: 0.3 });
  lineInners.forEach((inner, i) => introTl.to(inner, { y: 0, duration: 1.1, ease: 'power3.out' }, 0.12 * i));
  if (btnWrap) introTl.to(btnWrap, { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out' }, 0.7);

  // Looping interior slideshow (Ken Burns) — same timing as the original hero
  let slideStarted = false;
  function startSlideshow() {
    if (slideStarted || !slides.length) return;
    slideStarted = true;
    gsap.set(slides, { opacity: 0, scale: 1.05 });
    gsap.set(slides[0], { opacity: 1, scale: 1 });
    gsap.to(slides[0], { scale: 1.08, duration: 5, ease: 'none' });
    let idx = 0;
    setInterval(() => {
      const prev = slides[idx];
      idx = (idx + 1) % slides.length;
      const next = slides[idx];
      gsap.set(next, { opacity: 0, scale: 1 });
      gsap.to(next, { opacity: 1, duration: 1.2, ease: 'power2.inOut' });
      gsap.to(prev, { opacity: 0, duration: 1.2, ease: 'power2.inOut' });
      gsap.to(next, { scale: 1.08, duration: 5, ease: 'none' });
      gsap.delayedCall(1.2, () => gsap.set(prev, { scale: 1.05 }));
    }, 3000);
  }
  function dissolveToSlideshow() {
    if (slideshow) gsap.to(slideshow, { opacity: 1, duration: 1.2, ease: 'power2.inOut' });
    if (video) gsap.to(video, { opacity: 0, duration: 1.2, ease: 'power2.inOut' });
    startSlideshow();
  }

  const reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const saveData = navigator.connection && navigator.connection.saveData;

  if (!video || reduce || saveData) {
    // No video: show the slideshow straight away
    if (slideshow) gsap.set(slideshow, { opacity: 1 });
    if (video) video.style.display = 'none';
    if (reduce) {
      if (slides[0]) gsap.set(slides[0], { opacity: 1, scale: 1 });   // static, no motion
    } else {
      startSlideshow();
    }
  } else {
    const p = video.play();
    if (p && p.catch) p.catch(() => dissolveToSlideshow());   // autoplay blocked -> slideshow
    video.addEventListener('ended', dissolveToSlideshow);     // video done -> dissolve into slideshow
  }

  // Subtle parallax on the media block
  if (window.innerWidth > 768) {
    gsap.to('.hero-media', {
      yPercent: 12, ease: 'none',
      scrollTrigger: { trigger: heroSection, start: 'top top', end: 'bottom top', scrub: 1 }
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
// ═══ STACKING CARDS — PROCESS ═══
function initProcessTimeline() {
  const timeline = document.querySelector('.timeline');
  if (!timeline) return;
  const steps = gsap.utils.toArray('.timeline-step');
  const fill = timeline.querySelector('.timeline-line-fill');

  gsap.set(steps, { opacity: 0, y: 30 });

  // Gold line draws down as you scroll through the section.
  if (fill) {
    gsap.to(fill, {
      height: '100%', ease: 'none',
      scrollTrigger: { trigger: timeline, start: 'top 70%', end: 'bottom 75%', scrub: 0.5 }
    });
  }
  // Each step fades in and its node lights up when reached.
  steps.forEach((step) => {
    ScrollTrigger.create({
      trigger: step, start: 'top 80%', once: true,
      onEnter: () => {
        gsap.to(step, { opacity: 1, y: 0, duration: 0.7, ease: 'power2.out' });
        step.classList.add('active');
      }
    });
  });
}

// ═══ PROJECTS — GRID + BEFORE/AFTER ═══
function initProjects() {
  const tiles = gsap.utils.toArray('.proj-tile');
  if (tiles.length) {
    gsap.set(tiles, { opacity: 0, y: 40 });
    ScrollTrigger.batch(tiles, {
      start: 'top 88%', once: true,
      onEnter: (batch) => gsap.to(batch, { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out', stagger: 0.1, overwrite: true })
    });
    tiles.forEach((tile) => {
      tile.addEventListener('click', (e) => {
        e.preventDefault();
        openProjectModal(parseInt(tile.dataset.index));
      });
    });
  }
  initBeforeAfter();
}

function initBeforeAfter() {
  document.querySelectorAll('.ba-slider').forEach(function (slider) {
    const handle = slider.querySelector('.ba-handle');
    const after = slider.querySelector('.ba-after');
    let dragging = false;

    // Box takes the photo's real shape so BEFORE and AFTER are identical height (no gap, no crop).
    function setAspect() {
      if (after && after.naturalWidth) slider.style.aspectRatio = after.naturalWidth + ' / ' + after.naturalHeight;
    }
    if (after) { after.complete ? setAspect() : after.addEventListener('load', setAspect); }

    function apply(pct) {
      pct = Math.max(0, Math.min(100, pct));
      slider.style.setProperty('--ba', (100 - pct) + '%');   // how much of BEFORE is hidden from the right
      if (handle) handle.style.left = pct + '%';
    }
    function setPos(clientX) {
      const r = slider.getBoundingClientRect();
      apply(((clientX - r.left) / r.width) * 100);
    }

    // Initial position: data-start = % of BEFORE shown (default 50). Services uses 20 -> 80% AFTER visible.
    apply(parseFloat(slider.dataset.start || '50'));

    slider.addEventListener('pointerdown', function (e) {
      e.preventDefault();
      dragging = true;
      try { slider.setPointerCapture(e.pointerId); } catch (er) {}
      setPos(e.clientX);
    });
    slider.addEventListener('pointermove', function (e) { if (dragging) setPos(e.clientX); });
    slider.addEventListener('pointerup', function () { dragging = false; });
    slider.addEventListener('pointercancel', function () { dragging = false; });
    // Safari: don't let the image get selected / native-dragged (the blue "copy" highlight)
    slider.addEventListener('dragstart', function (e) { e.preventDefault(); });
    slider.addEventListener('selectstart', function (e) { e.preventDefault(); });
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
const projectList = [];

function buildProjectList() {
  const items = document.querySelectorAll('.proj-tile[data-project]');
  items.forEach(item => {
    projectList.push({
      image: item.dataset.project,
      title: item.dataset.title || ''
    });
  });
}

function openProjectModal(index) {
  if (projectList.length === 0) buildProjectList();

  const modal = document.getElementById('project-modal');
  if (!modal || index < 0 || index >= projectList.length) return;

  currentModalIndex = index;
  updateModalContent();

  modal.classList.add('active');
  document.body.style.overflow = 'hidden';
  if (lenis) lenis.stop();
}

function updateModalContent() {
  const modal = document.getElementById('project-modal');
  if (!modal) return;

  const project = projectList[currentModalIndex];
  const img = modal.querySelector('.project-modal-image');
  const title = modal.querySelector('.project-modal-title');
  const current = modal.querySelector('.project-modal-counter .current');
  const total = modal.querySelector('.project-modal-counter .total');

  if (img) { img.src = project.image; img.alt = project.title; }
  if (title) title.textContent = project.title;
  if (current) current.textContent = String(currentModalIndex + 1).padStart(2, '0');
  if (total) total.textContent = String(projectList.length).padStart(2, '0');
}

function navigateProjectModal(direction) {
  const newIndex = currentModalIndex + direction;
  if (newIndex < 0 || newIndex >= projectList.length) return;
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
  const btns = document.querySelectorAll('.hero-portfolio-btn, .contact-form button, .projects-btn');
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
    initScrollIndicator, initHero, initAbout,
    initServices, initProcessTimeline, initProjects,
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
