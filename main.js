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

// ═══ PAGE LOADER ═══
function initLoader() {
  const loader = document.querySelector('.page-loader');
  if (!loader) { initAll(); return; }

  const logo = loader.querySelector('.loader-logo');
  const lineFill = loader.querySelector('.loader-line-fill');
  const text = loader.querySelector('.loader-text');

  const tl = gsap.timeline({
    onComplete: () => {
      gsap.to(loader, {
        opacity: 0, duration: 0.6, ease: 'power2.inOut',
        onComplete: () => {
          loader.style.display = 'none';
          initAll();
        }
      });
    }
  });

  tl.to(logo, { opacity: 1, duration: 0.6, ease: 'power2.out' })
    .to(lineFill, { scaleX: 1, duration: 1.4, ease: 'power2.inOut' }, '-=0.2')
    .to(text, { opacity: 1, duration: 0.4 }, '-=0.6')
    .to({}, { duration: 0.3 });
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
  const subtitleRow = document.querySelector('.hero-subtitle-row');
  const dividerLine = document.querySelector('.hero-divider-line');
  const portfolioBtn = document.querySelector('.hero-portfolio-btn');
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

  // 1) Split text line reveal — each line slides up
  lineInners.forEach((inner, i) => {
    introTl.to(inner, {
      y: 0, duration: 1.1,
      ease: 'power3.out',
    }, 0.12 * i);
  });

  // 2) Subtitle row
  if (subtitleRow) {
    introTl.to(subtitleRow, { opacity: 1, y: 0, duration: 0.8, ease: 'power2.out' }, 0.6);
  }
  if (dividerLine) {
    introTl.to(dividerLine, { scaleX: 1, duration: 1, ease: 'power2.out' }, 0.7);
  }

  // 3) Portfolio button
  if (portfolioBtn) {
    introTl.to(portfolioBtn, { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out' }, 0.8);
  }

  // 4) Counter
  if (heroCounter) {
    introTl.to(heroCounter, { opacity: 1, duration: 0.6 }, 0.5);
  }

  // 5) Ken Burns on first image
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
  const heading = document.querySelector('.about-heading');

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

    // Portrait zoom-out after reveal
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

  // Frame fade in
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

  // Text column reveal
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

  // Portrait parallax
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
  if (window.innerWidth <= 992) return; // Stacked on mobile

  const trigger = document.querySelector('.horizontal-trigger');
  const container = document.querySelector('.horizontal-container');
  const track = document.querySelector('.horizontal-track');
  const dots = gsap.utils.toArray('.hs-dot');
  const cards = gsap.utils.toArray('.hs-card');

  if (!trigger || !track) return;

  const totalWidth = track.scrollWidth;
  const viewportWidth = window.innerWidth;
  const scrollDistance = totalWidth - viewportWidth;

  gsap.to(track, {
    x: -scrollDistance,
    ease: 'none',
    scrollTrigger: {
      trigger: trigger,
      start: 'top top',
      end: `+=${scrollDistance}`,
      pin: container,
      scrub: 1,
      invalidateOnRefresh: true,
      onUpdate: (self) => {
        // Update progress dots
        const progress = self.progress;
        const panelCount = dots.length;
        const activeIndex = Math.min(Math.floor(progress * panelCount), panelCount - 1);
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

    // Scale down previous cards as next ones appear
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

  // Set first active
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
        const isActive = i === activeIndex;
        item.classList.toggle('active', isActive);
      });

      images.forEach((img, i) => {
        const isActive = i === activeIndex;
        img.classList.toggle('active', isActive);
      });
    }
  });
}

function initShowcaseMobile() {
  const items = gsap.utils.toArray('.showcase-item');
  const images = gsap.utils.toArray('.showcase-image');
  if (items.length === 0) return;

  // Show first image
  if (images[0]) images[0].classList.add('active');
  items[0].classList.add('active');
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
    targetSkew *= 0.95; // decay
    if (Math.abs(currentSkew) > 0.01) {
      skewElements.forEach(el => {
        gsap.set(el, { skewY: currentSkew });
      });
    }
    requestAnimationFrame(updateSkew);
  }
  requestAnimationFrame(updateSkew);
}

// ═══ MARQUEE SPEED ON SCROLL ═══
function initMarquee() {
  const track = document.querySelector('.marquee-track');
  if (!track) return;

  // Speed up marquee when scrolling fast
  let scrollSpeed = 1;
  let lastScroll = window.scrollY;

  window.addEventListener('scroll', () => {
    const delta = Math.abs(window.scrollY - lastScroll);
    scrollSpeed = 1 + Math.min(delta * 0.02, 3);
    lastScroll = window.scrollY;
  }, { passive: true });

  function updateMarqueeSpeed() {
    track.style.animationDuration = `${35 / scrollSpeed}s`;
    scrollSpeed += (1 - scrollSpeed) * 0.05; // ease back
    requestAnimationFrame(updateMarqueeSpeed);
  }
  requestAnimationFrame(updateMarqueeSpeed);
}

// ═══ SECTION REVEAL ANIMATIONS ═══
function initSectionReveals() {
  // Process section header
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
  initContact();
  initFooter();
  initMagneticEffects();
  initVelocitySkew();
  initMarquee();
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
