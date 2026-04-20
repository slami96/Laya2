// ═══════════════════════════════════════
//  LAYA HOME — Portfolio V3 Editorial
// ═══════════════════════════════════════

gsap.registerPlugin(ScrollTrigger);

// ═══ LENIS ═══
let lenis;
function initLenis() {
  lenis = new Lenis({
    duration: 1.2,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    smoothWheel: true,
  });
  lenis.on('scroll', ScrollTrigger.update);
  gsap.ticker.add((time) => lenis.raf(time * 1000));
  gsap.ticker.lagSmoothing(0);
}

// ═══ HEADER ═══
function initHeader() {
  const header = document.getElementById('site-header');
  if (!header) return;
  // portfolio page is always light — just toggle scrolled state
  window.addEventListener('scroll', () => {
    header.classList.toggle('header-scrolled', window.scrollY > 60);
  }, { passive: true });
}

// ═══ MOBILE MENU ═══
function initMobileMenu() {
  const toggle = document.querySelector('.mobile-menu-toggle');
  const overlay = document.querySelector('.mobile-menu-overlay');
  if (!toggle || !overlay) return;
  toggle.addEventListener('click', () => {
    const active = toggle.classList.toggle('active');
    overlay.classList.toggle('active');
    document.body.style.overflow = active ? 'hidden' : '';
    if (lenis) active ? lenis.stop() : lenis.start();
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

// ═══ HERO ANIMATION ═══
function initHero() {
  const label   = document.querySelector('.portfolio-hero .section-label');
  const title   = document.querySelector('.portfolio-hero-title');
  const sub     = document.querySelector('.portfolio-hero-sub');

  gsap.set([label, title, sub].filter(Boolean), { opacity: 0 });
  gsap.set(title, { y: 28 });

  const tl = gsap.timeline({ delay: 0.15 });
  if (label) tl.to(label, { opacity: 1, x: 0, duration: 0.55, ease: 'power2.out' });
  if (title) tl.to(title, { opacity: 1, y: 0,  duration: 0.85, ease: 'power3.out' }, '-=0.25');
  if (sub)   tl.to(sub,   { opacity: 1,        duration: 0.55, ease: 'power2.out' }, '-=0.45');
}

// ═══ FILTER ═══
function initFilter() {
  const filterBtns = document.querySelectorAll('.proj-filter-btn');
  const cards      = document.querySelectorAll('.proj-card');
  if (!filterBtns.length || !cards.length) return;

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const filter = btn.dataset.filter;

      // Swap active button
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      // Sort into two buckets
      const toShow = [];
      const toHide = [];
      cards.forEach(card => {
        const matches = filter === 'all' || card.dataset.category === filter;
        (matches ? toShow : toHide).push(card);
      });

      // Animate out non-matching, then hide with display:none
      if (toHide.length) {
        gsap.to(toHide, {
          opacity: 0,
          y: 16,
          duration: 0.25,
          ease: 'power2.in',
          onComplete: () => {
            toHide.forEach(c => {
              c.classList.add('is-hidden');
              gsap.set(c, { y: 0 });
            });
          }
        });
      }

      // Reveal matching with stagger
      toShow.forEach(c => c.classList.remove('is-hidden'));
      gsap.fromTo(
        toShow,
        { opacity: 0, y: 28 },
        { opacity: 1, y: 0, duration: 0.65, ease: 'power3.out', stagger: 0.07, delay: 0.18 }
      );
    });
  });
}

// ═══ SCROLL REVEAL ═══
function initScrollReveal() {
  const cards = document.querySelectorAll('.proj-card');
  if (!cards.length) return;

  ScrollTrigger.batch(cards, {
    onEnter: (batch) => {
      gsap.to(batch, {
        opacity: 1,
        y: 0,
        duration: 0.9,
        ease: 'power3.out',
        stagger: 0.1,
        overwrite: true,
      });
    },
    start: 'top 88%',
    once: true,
  });
}

// ═══ FOOTER ═══
function initFooter() {
  const year = document.getElementById('copyright-year');
  if (year) year.textContent = new Date().getFullYear();

  const icons = gsap.utils.toArray('.site-footer .social-icons a');
  if (icons.length) {
    gsap.from(icons, {
      scrollTrigger: { trigger: '.site-footer', start: 'top 90%' },
      y: 14, opacity: 0, duration: 0.5, stagger: 0.08, ease: 'power2.out'
    });
  }
}

// ═══ INIT ═══
window.addEventListener('load', () => {
  initLenis();
  initHeader();
  initMobileMenu();
  initHero();
  initFilter();
  initScrollReveal();
  initFooter();

  setTimeout(() => ScrollTrigger.refresh(), 300);
});
