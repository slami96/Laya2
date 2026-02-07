// ═══════════════════════════════════
//  LAYA HOME — Portfolio JavaScript
// ═══════════════════════════════════

// Initialize GSAP staggered reveal
function initPortfolioAnimations() {
  const items = document.querySelectorAll('.portfolio-item');
  if (items.length === 0) return;

  items.forEach((item, i) => {
    gsap.to(item, {
      opacity: 1,
      y: 0,
      duration: 0.7,
      delay: Math.min(i * 0.08, 1.6), // cap delay so late items aren't too slow
      ease: 'power2.out',
      onComplete: () => item.classList.add('show')
    });
  });
}

// Mobile menu
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

// Project Modal with smooth GSAP transitions
function initProjectModal() {
  const modal = document.getElementById('projectModal');
  if (!modal) return;

  const modalImage = modal.querySelector('.modal-image');
  const modalClose = modal.querySelector('.modal-close');
  const modalOverlay = modal.querySelector('.modal-overlay');
  const modalPrev = modal.querySelector('.modal-nav-prev');
  const modalNext = modal.querySelector('.modal-nav-next');
  const viewButtons = document.querySelectorAll('.view-project');
  const portfolioItems = document.querySelectorAll('.portfolio-item');

  let currentIndex = 0;
  let projects = [];
  let isTransitioning = false;

  // Build project data
  portfolioItems.forEach((item) => {
    const img = item.dataset.projectImage;
    const placeholder = item.querySelector('.portfolio-image img')?.src;
    const title = item.querySelector('h3')?.textContent || '';
    projects.push({ image: img || placeholder, title });
  });

  function updateImage(index) {
    const project = projects[index];
    modalImage.src = project.image;
    modalImage.alt = project.title;
    currentIndex = index;
    modalPrev.style.display = index === 0 ? 'none' : 'block';
    modalNext.style.display = index === projects.length - 1 ? 'none' : 'block';
  }

  function openModal(index) {
    updateImage(index);
    modal.classList.add('active');
    document.body.classList.add('modal-open');

    gsap.fromTo(modal, { opacity: 0 }, { opacity: 1, duration: 0.35, ease: 'power2.out' });
    gsap.fromTo(modalImage,
      { scale: 0.92, opacity: 0 },
      { scale: 1, opacity: 1, duration: 0.45, delay: 0.1, ease: 'power3.out' }
    );
  }

  function closeModal() {
    isTransitioning = false;
    gsap.to(modal, {
      opacity: 0,
      duration: 0.3,
      ease: 'power2.in',
      onComplete: () => {
        modal.classList.remove('active');
        document.body.classList.remove('modal-open');
        modalImage.src = '';
      }
    });
  }

  function navigate(direction) {
    const nextIndex = currentIndex + direction;
    if (nextIndex < 0 || nextIndex >= projects.length || isTransitioning) return;

    isTransitioning = true;
    const nextProject = projects[nextIndex];

    // Preload image
    const preload = new Image();
    preload.onload = () => {
      gsap.to(modalImage, {
        opacity: 0,
        x: direction * -20,
        duration: 0.2,
        ease: 'power2.in',
        onComplete: () => {
          modalImage.src = nextProject.image;
          modalImage.alt = nextProject.title;
          currentIndex = nextIndex;
          modalPrev.style.display = nextIndex === 0 ? 'none' : 'block';
          modalNext.style.display = nextIndex === projects.length - 1 ? 'none' : 'block';

          gsap.fromTo(modalImage,
            { opacity: 0, x: direction * 20 },
            {
              opacity: 1, x: 0,
              duration: 0.25,
              ease: 'power2.out',
              onComplete: () => { isTransitioning = false; }
            }
          );
        }
      });
    };
    preload.onerror = () => { isTransitioning = false; };
    preload.src = nextProject.image;
  }

  // Event listeners
  viewButtons.forEach((btn, i) => {
    btn.addEventListener('click', (e) => { e.preventDefault(); openModal(i); });
  });

  modalClose.addEventListener('click', closeModal);
  modalOverlay.addEventListener('click', closeModal);
  modalPrev.addEventListener('click', () => navigate(-1));
  modalNext.addEventListener('click', () => navigate(1));

  document.addEventListener('keydown', (e) => {
    if (!modal.classList.contains('active')) return;
    if (e.key === 'Escape') closeModal();
    if (e.key === 'ArrowLeft') navigate(-1);
    if (e.key === 'ArrowRight') navigate(1);
  });

  // Touch swipe support
  let touchStartX = 0;
  modal.addEventListener('touchstart', (e) => { touchStartX = e.touches[0].clientX; }, { passive: true });
  modal.addEventListener('touchend', (e) => {
    const diff = touchStartX - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 60) {
      navigate(diff > 0 ? 1 : -1);
    }
  }, { passive: true });
}

// Copyright year
function updateCopyrightYear() {
  const el = document.getElementById('copyright-year');
  if (el) el.textContent = new Date().getFullYear();
}

// Init
function initPortfolio() {
  console.log('LAYA Portfolio — Initializing...');
  initPortfolioAnimations();
  initMobileMenu();
  initProjectModal();
  updateCopyrightYear();
  console.log('LAYA Portfolio — Ready.');
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initPortfolio);
} else {
  initPortfolio();
}
