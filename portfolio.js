// ═══════════════════════════════════════
//  LAYA HOME — Portfolio V2
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

// ═══ GRID STAGGER REVEAL ═══
function initGridReveal() {
  const cards = gsap.utils.toArray('.portfolio-card');
  if (cards.length === 0) return;

  // Batch reveal for performance
  ScrollTrigger.batch(cards, {
    onEnter: (batch) => {
      gsap.to(batch, {
        opacity: 1, y: 0,
        duration: 0.8,
        ease: 'power3.out',
        stagger: 0.08,
        overwrite: true,
      });
    },
    start: 'top 85%',
  });
}

// ═══ MODAL ═══
function initModal() {
  const modal = document.querySelector('.portfolio-modal');
  const modalImg = document.querySelector('.modal-image');
  const modalTitle = document.querySelector('.modal-title');
  const modalCurrent = document.querySelector('.modal-counter .current');
  const modalTotal = document.querySelector('.modal-counter .total');
  const closeBtn = document.querySelector('.modal-close');
  const prevBtn = document.querySelector('.modal-prev');
  const nextBtn = document.querySelector('.modal-next');

  if (!modal || !modalImg) return;

  const cards = gsap.utils.toArray('.portfolio-card');
  let currentIndex = 0;
  let isOpen = false;

  if (modalTotal) modalTotal.textContent = String(cards.length).padStart(2, '0');

  function openModal(index) {
    currentIndex = index;
    const card = cards[index];
    const projectImg = card.dataset.projectImage;
    const title = card.dataset.title;

    modalImg.src = projectImg;
    if (modalTitle) modalTitle.textContent = title;
    if (modalCurrent) modalCurrent.textContent = String(index + 1).padStart(2, '0');

    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
    if (lenis) lenis.stop();
    isOpen = true;

    // GSAP entrance
    gsap.fromTo(modalImg,
      { opacity: 0, scale: 0.9 },
      { opacity: 1, scale: 1, duration: 0.5, ease: 'power2.out' }
    );
  }

  function closeModal() {
    gsap.to(modalImg, {
      opacity: 0, scale: 0.95, duration: 0.3, ease: 'power2.in',
      onComplete: () => {
        modal.classList.remove('active');
        document.body.style.overflow = '';
        if (lenis) lenis.start();
        isOpen = false;
      }
    });
  }

  function navigateTo(index) {
    if (index < 0) index = cards.length - 1;
    if (index >= cards.length) index = 0;

    const direction = index > currentIndex ? 1 : -1;
    const card = cards[index];
    const nextSrc = card.dataset.projectImage;
    const title = card.dataset.title;

    // Preload
    const preload = new Image();
    preload.src = nextSrc;

    // Animate out
    gsap.to(modalImg, {
      opacity: 0, x: -30 * direction, duration: 0.25, ease: 'power2.in',
      onComplete: () => {
        modalImg.src = nextSrc;
        currentIndex = index;
        if (modalTitle) modalTitle.textContent = title;
        if (modalCurrent) modalCurrent.textContent = String(index + 1).padStart(2, '0');

        // Animate in
        gsap.fromTo(modalImg,
          { opacity: 0, x: 30 * direction },
          { opacity: 1, x: 0, duration: 0.35, ease: 'power2.out' }
        );
      }
    });
  }

  // Event listeners
  cards.forEach((card, i) => {
    const btn = card.querySelector('.portfolio-card-btn');
    const clickTarget = btn || card;
    clickTarget.addEventListener('click', (e) => {
      e.preventDefault();
      openModal(i);
    });
  });

  if (closeBtn) closeBtn.addEventListener('click', closeModal);
  if (prevBtn) prevBtn.addEventListener('click', () => navigateTo(currentIndex - 1));
  if (nextBtn) nextBtn.addEventListener('click', () => navigateTo(currentIndex + 1));

  // Click overlay to close
  modal.addEventListener('click', (e) => {
    if (e.target === modal) closeModal();
  });

  // Keyboard
  document.addEventListener('keydown', (e) => {
    if (!isOpen) return;
    if (e.key === 'Escape') closeModal();
    if (e.key === 'ArrowLeft') navigateTo(currentIndex - 1);
    if (e.key === 'ArrowRight') navigateTo(currentIndex + 1);
  });

  // Touch swipe
  let touchStartX = 0;
  modal.addEventListener('touchstart', (e) => { touchStartX = e.touches[0].clientX; }, { passive: true });
  modal.addEventListener('touchend', (e) => {
    const diff = touchStartX - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 50) {
      navigateTo(diff > 0 ? currentIndex + 1 : currentIndex - 1);
    }
  }, { passive: true });
}

// ═══ HERO ANIMATION ═══
function initHero() {
  const title = document.querySelector('.portfolio-hero-title');
  const sub = document.querySelector('.portfolio-hero-sub');
  if (title) gsap.from(title, { opacity: 0, y: 30, duration: 0.8, ease: 'power2.out', delay: 0.2 });
  if (sub) gsap.from(sub, { opacity: 0, y: 15, duration: 0.6, ease: 'power2.out', delay: 0.4 });
}

// ═══ FOOTER ═══
function initFooter() {
  const year = document.getElementById('copyright-year');
  if (year) year.textContent = new Date().getFullYear();
}

// ═══ INIT ═══
window.addEventListener('load', () => {
  initLenis();
  initHeader();
  initMobileMenu();
  initHero();
  initGridReveal();
  initModal();
  initFooter();

  setTimeout(() => ScrollTrigger.refresh(), 300);
});
