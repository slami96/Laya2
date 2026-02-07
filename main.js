// ═══════════════════════════════════
//  LAYA HOME — Main JavaScript
//  GSAP Animations & Interactions
// ═══════════════════════════════════

gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);

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
        opacity: 0,
        duration: 0.6,
        ease: 'power2.inOut',
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
    .to({}, { duration: 0.3 }); // brief pause
}

// ═══ SCROLL PROGRESS BAR ═══
function initScrollProgress() {
  const bar = document.querySelector('.scroll-progress');
  if (!bar) return;

  gsap.to(bar, {
    scaleX: 1,
    ease: 'none',
    scrollTrigger: {
      trigger: document.body,
      start: 'top top',
      end: 'bottom bottom',
      scrub: 0.3
    }
  });
}

// ═══ HEADER — SCROLL & THEME DETECTION ═══
function initHeader() {
  const header = document.getElementById('site-header');
  if (!header) return;

  // Detect which section is in view and update header theme
  const sections = document.querySelectorAll('section[data-theme]');

  // Simple scroll detection for header background
  let lastScroll = 0;
  const onScroll = () => {
    const scrollY = window.scrollY;
    const isScrolled = scrollY > 60;

    // Add/remove scrolled class
    header.classList.toggle('header-scrolled', isScrolled);

    // Detect current section theme
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

    lastScroll = scrollY;
  };

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll(); // initial check

  // Smooth scroll for nav links
  const headerLinks = document.querySelectorAll('.header-nav a[href^="#"], .mobile-nav a[href^="#"]');
  headerLinks.forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const href = this.getAttribute('href');
      if (href && href.startsWith('#') && href.length > 1) {
        const target = document.querySelector(href);
        if (target) {
          e.preventDefault();
          gsap.to(window, {
            duration: 1.2,
            scrollTo: { y: target, offsetY: target.id === 'section-0' ? 0 : 0 },
            ease: 'power2.inOut'
          });
        }
      }
    });
  });

  // Logo click
  const logoLink = document.querySelector('.logo-link');
  if (logoLink) {
    logoLink.addEventListener('click', function(e) {
      const href = this.getAttribute('href');
      if (href === '#section-0') {
        e.preventDefault();
        gsap.to(window, { duration: 1.2, scrollTo: { y: '#section-0' }, ease: 'power2.inOut' });
      }
    });
  }
}

// ═══ MOBILE MENU ═══
function initMobileMenu() {
  const toggle = document.querySelector('.mobile-menu-toggle');
  const overlay = document.querySelector('.mobile-menu-overlay');
  const links = document.querySelectorAll('.mobile-nav a');

  if (!toggle || !overlay) return;

  toggle.addEventListener('click', () => {
    toggle.classList.toggle('active');
    overlay.classList.toggle('active');
    document.body.style.overflow = overlay.classList.contains('active') ? 'hidden' : '';
  });

  links.forEach(link => {
    link.addEventListener('click', () => {
      toggle.classList.remove('active');
      overlay.classList.remove('active');
      document.body.style.overflow = '';
    });
  });

  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) {
      toggle.classList.remove('active');
      overlay.classList.remove('active');
      document.body.style.overflow = '';
    }
  });
}

// ═══ HERO — CINEMATIC SLIDESHOW ═══
function initHero() {
  const heroSection = document.querySelector('.hero-section');
  if (!heroSection) return;

  const images = gsap.utils.toArray('.hero-image');
  const portfolioBtn = document.querySelector('.hero-portfolio-btn');
  const heroTagline = document.querySelector('.hero-tagline');
  const heroCounter = document.querySelector('.hero-counter');
  const counterCurrent = heroCounter?.querySelector('.current');
  const counterTotal = heroCounter?.querySelector('.total');

  if (images.length === 0) return;

  let currentIndex = 0;
  let imageInterval;
  const SLIDE_DURATION = 5000; // 5 seconds per slide
  const TRANSITION_DURATION = 1.2;

  // Set total in counter
  if (counterTotal) counterTotal.textContent = String(images.length).padStart(2, '0');

  // Initialize first image
  gsap.set(images[0], { opacity: 1, scale: 1, zIndex: 1 });
  images[0].classList.add('hero-image-active');
  gsap.set(images.slice(1), { opacity: 0, scale: 1.05, zIndex: 0 });

  // Intro animation
  const introTl = gsap.timeline({ delay: 0.2 });

  // Ken Burns on first image
  introTl.to(images[0], { scale: 1.08, duration: SLIDE_DURATION / 1000, ease: 'none' }, 0);

  // Reveal tagline
  if (heroTagline) {
    introTl.to(heroTagline, { opacity: 1, duration: 0.8, ease: 'power2.out' }, 0.3);
  }

  // Reveal button
  if (portfolioBtn) {
    introTl.to(portfolioBtn, { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out' }, 0.5);
  }

  // Reveal counter
  if (heroCounter) {
    introTl.to(heroCounter, { opacity: 1, duration: 0.6 }, 0.4);
  }

  // Image transition function
  function switchImage() {
    if (images.length <= 1) return;

    const prevIndex = currentIndex;
    currentIndex = (currentIndex + 1) % images.length;
    const prevImage = images[prevIndex];
    const nextImage = images[currentIndex];

    // Update counter
    if (counterCurrent) counterCurrent.textContent = String(currentIndex + 1).padStart(2, '0');

    const tl = gsap.timeline();

    // Prepare next image
    gsap.set(nextImage, { opacity: 0, scale: 1, zIndex: 1 });

    // Crossfade
    tl.to(nextImage, { opacity: 1, duration: TRANSITION_DURATION, ease: 'power2.inOut' }, 0)
      .to(prevImage, { opacity: 0, duration: TRANSITION_DURATION, ease: 'power2.inOut' }, 0)
      // Ken Burns on new image
      .to(nextImage, { scale: 1.08, duration: SLIDE_DURATION / 1000, ease: 'none' }, 0);

    // Update classes
    prevImage.classList.remove('hero-image-active');
    nextImage.classList.add('hero-image-active');

    // Reset previous
    tl.set(prevImage, { zIndex: 0, scale: 1.05 });
  }

  // Start slideshow
  imageInterval = setInterval(switchImage, SLIDE_DURATION);

  // Pause on visibility change
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      clearInterval(imageInterval);
    } else {
      imageInterval = setInterval(switchImage, SLIDE_DURATION);
    }
  });
}

// ═══ SCROLL INDICATOR ═══
function initScrollIndicator() {
  let scrolled = window.scrollY > 50;
  document.body.classList.toggle('scrolled', scrolled);

  window.addEventListener('scroll', () => {
    const isScrolled = window.scrollY > 50;
    if (isScrolled !== scrolled) {
      document.body.classList.toggle('scrolled', isScrolled);
      scrolled = isScrolled;
    }
  }, { passive: true });
}

// ═══ ABOUT SECTION ═══
function initAbout() {
  const section = document.querySelector('.about-section');
  const wrapper = document.querySelector('.about-content-wrapper');
  const portrait = document.querySelector('.about-portrait');

  if (!section || !wrapper) return;

  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: section,
      start: 'top 65%',
      toggleActions: 'play none none reverse'
    }
  });

  tl.to(wrapper, { opacity: 1, y: 0, duration: 1, ease: 'power3.out' });

  if (portrait) {
    tl.to(portrait, {
      opacity: 1,
      scale: 1,
      duration: 0.9,
      ease: 'power2.out'
    }, '-=0.6');
  }

  // Parallax on portrait
  if (portrait && window.innerWidth > 768) {
    gsap.to(portrait, {
      yPercent: -8,
      ease: 'none',
      scrollTrigger: {
        trigger: section,
        start: 'top bottom',
        end: 'bottom top',
        scrub: 1
      }
    });
  }
}

// ═══ SERVICES OFFERED ═══
function initServicesOffered() {
  const section = document.querySelector('.services-offered-section');
  const container = document.querySelector('.services-offered-container');
  const timelineLine = document.querySelector('.timeline-line');

  if (!section || !container) return;

  const items = gsap.utils.toArray('.service-item', container);
  const circles = gsap.utils.toArray('.service-number-circle', container);

  gsap.set(container, { opacity: 0, y: 40 });
  gsap.set(items, { opacity: 0, y: 24 });
  gsap.set(circles, { scale: 0 });

  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: section,
      start: 'top 65%',
      toggleActions: 'play none none reverse'
    }
  });

  tl.to(container, { opacity: 1, y: 0, duration: 0.8, ease: 'power2.out' });

  if (timelineLine && window.innerWidth > 992) {
    tl.to(timelineLine, { scaleX: 1, duration: 1, ease: 'power2.out' }, '-=0.4');
  }

  items.forEach((item, i) => {
    tl.to(item, {
      opacity: 1,
      y: 0,
      duration: 0.6,
      ease: 'power2.out'
    }, `-=${i === 0 ? 0.3 : 0.45}`);

    if (circles[i]) {
      tl.to(circles[i], {
        scale: 1,
        duration: 0.5,
        ease: 'back.out(2)'
      }, '-=0.35');
    }
  });
}

// ═══ SERVICES PROCESS ═══
function initServices() {
  const section = document.querySelector('.services-section');
  const container = document.querySelector('.services-container');

  if (!section || !container) return;

  const items = gsap.utils.toArray('.service-offered-item', container);
  const dividers = gsap.utils.toArray('.service-divider', container);

  gsap.set(container, { opacity: 0, y: 40 });
  gsap.set(items, { opacity: 0, x: -24 });
  gsap.set(dividers, { scaleX: 0, opacity: 0 });

  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: section,
      start: 'top 65%',
      toggleActions: 'play none none reverse'
    }
  });

  tl.to(container, { opacity: 1, y: 0, duration: 0.8, ease: 'power2.out' });

  items.forEach((item, i) => {
    tl.to(item, {
      opacity: 1,
      x: 0,
      duration: 0.7,
      ease: 'power2.out'
    }, `-=${i === 0 ? 0.3 : 0.5}`);

    if (i < dividers.length) {
      tl.to(dividers[i], {
        scaleX: 1,
        opacity: 1,
        duration: 0.6,
        ease: 'power2.out'
      }, '-=0.4');
    }
  });
}

// ═══ CONTACT SECTION ═══
function initContact() {
  const section = document.querySelector('.contact-section');
  const container = document.querySelector('.contact-form-container');

  if (!section || !container) return;

  const labels = gsap.utils.toArray('.contact-form label', container);
  const inputs = gsap.utils.toArray('.contact-form input, .contact-form textarea', container);
  const button = container.querySelector('.contact-form button');

  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: section,
      start: 'top 60%',
      toggleActions: 'play none none reverse'
    }
  });

  tl.to(container, { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out' })
    .to(labels, { opacity: 1, y: 0, duration: 0.4, ease: 'power2.out', stagger: 0.06 }, '-=0.4')
    .to(inputs, { opacity: 1, y: 0, duration: 0.4, ease: 'power2.out', stagger: 0.06 }, '<0.08')
    .to(button, { opacity: 1, y: 0, duration: 0.5, ease: 'back.out(1.5)' }, '-=0.2');
}

// ═══ FOOTER ═══
function initFooter() {
  const year = document.getElementById('copyright-year');
  if (year) year.textContent = new Date().getFullYear();

  // Animate footer elements
  const footer = document.querySelector('.site-footer');
  if (footer) {
    const icons = gsap.utils.toArray('.site-footer .social-icons a');
    const copyright = footer.querySelector('.copyright');

    gsap.from(icons, {
      scrollTrigger: { trigger: footer, start: 'top 90%' },
      y: 16,
      opacity: 0,
      duration: 0.5,
      stagger: 0.08,
      ease: 'power2.out'
    });

    if (copyright) {
      gsap.from(copyright, {
        scrollTrigger: { trigger: footer, start: 'top 90%' },
        opacity: 0,
        duration: 0.6,
        delay: 0.3
      });
    }
  }
}

// ═══ MAGNETIC BUTTONS ═══
function initMagneticEffects() {
  if (window.innerWidth < 768) return;

  const btns = document.querySelectorAll('.hero-portfolio-btn, .contact-form button');
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

// ═══ SMOOTH ANCHOR SCROLL (non-header links) ═══
function initSmoothAnchors() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    if (anchor.closest('.site-header') || anchor.closest('.mobile-nav')) return;
    anchor.addEventListener('click', function(e) {
      const href = this.getAttribute('href');
      if (href && href.startsWith('#') && href.length > 1) {
        const target = document.querySelector(href);
        if (target) {
          e.preventDefault();
          gsap.to(window, {
            duration: 1,
            scrollTo: { y: target, offsetY: 0 },
            ease: 'power2.inOut'
          });
        }
      } else if (href === '#') {
        e.preventDefault();
      }
    });
  });
}

// ═══ GENERIC REVEAL ANIMATIONS ═══
function initReveals() {
  document.querySelectorAll('.reveal').forEach(el => {
    gsap.to(el, {
      scrollTrigger: { trigger: el, start: 'top 85%', toggleActions: 'play none none reverse' },
      opacity: 1, y: 0, duration: 0.7, ease: 'power2.out'
    });
  });
  document.querySelectorAll('.reveal-left').forEach(el => {
    gsap.to(el, {
      scrollTrigger: { trigger: el, start: 'top 85%', toggleActions: 'play none none reverse' },
      opacity: 1, x: 0, duration: 0.7, ease: 'power2.out'
    });
  });
  document.querySelectorAll('.reveal-right').forEach(el => {
    gsap.to(el, {
      scrollTrigger: { trigger: el, start: 'top 85%', toggleActions: 'play none none reverse' },
      opacity: 1, x: 0, duration: 0.7, ease: 'power2.out'
    });
  });
}

// ═══ INITIALIZE ALL ═══
function initAll() {
  console.log('LAYA — Initializing...');

  initScrollProgress();
  initHeader();
  initMobileMenu();
  initScrollIndicator();
  initHero();
  initAbout();
  initServicesOffered();
  initServices();
  initContact();
  initFooter();
  initMagneticEffects();
  initSmoothAnchors();
  initReveals();

  // Refresh ScrollTrigger after everything settles
  setTimeout(() => {
    ScrollTrigger.refresh();
    console.log('LAYA — Ready.');
  }, 300);

  // Refresh on resize
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
