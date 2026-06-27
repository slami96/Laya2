/* ═══════════════════════════════════════════
   LAYA HOME — Project detail pages (shared JS)
   Smooth scroll + scroll reveals. No lightbox.
   ═══════════════════════════════════════════ */
document.addEventListener('DOMContentLoaded', () => {

  /* ── Smooth scroll (Lenis) + GSAP sync ── */
  let lenis = null;
  if (window.Lenis) {
    lenis = new Lenis({ duration: 1.1, easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)) });
    function raf(time) { lenis.raf(time); requestAnimationFrame(raf); }
    requestAnimationFrame(raf);
    if (window.gsap && window.ScrollTrigger) {
      lenis.on('scroll', ScrollTrigger.update);
      gsap.ticker.add((t) => lenis.raf(t * 1000));
      gsap.ticker.lagSmoothing(0);
    }
  }

  /* ── Scroll reveals ── */
  if (window.gsap && window.ScrollTrigger) {
    gsap.registerPlugin(ScrollTrigger);
    gsap.utils.toArray('.reveal').forEach((el) => {
      gsap.to(el, {
        opacity: 1, y: 0, duration: 1, ease: 'power3.out',
        scrollTrigger: { trigger: el, start: 'top 90%' }
      });
    });
  } else {
    document.querySelectorAll('.reveal').forEach((el) => { el.style.opacity = 1; el.style.transform = 'none'; });
  }

  /* ── Header hide-on-scroll-down ── */
  const header = document.querySelector('.site-header');
  if (header) {
    let last = 0;
    window.addEventListener('scroll', () => {
      const y = window.scrollY;
      header.style.transition = 'transform 0.4s var(--ease, ease)';
      header.style.transform = (y > last && y > 200) ? 'translateY(-100%)' : 'translateY(0)';
      last = y;
    }, { passive: true });
  }

  /* ── Current year in footer ── */
  const yearEl = document.querySelector('[data-year]');
  if (yearEl) yearEl.textContent = new Date().getFullYear();
});
