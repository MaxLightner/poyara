const menuButton = document.querySelector<HTMLButtonElement>('.menu-toggle');
const navigation = document.querySelector<HTMLElement>('#site-nav');

function closeMenu() {
  if (!menuButton || !navigation) return;
  menuButton.setAttribute('aria-expanded', 'false');
  menuButton.setAttribute('aria-label', 'Open navigation');
  document.body.classList.remove('menu-open');
}

menuButton?.addEventListener('click', () => {
  const isOpen = menuButton.getAttribute('aria-expanded') === 'true';
  menuButton.setAttribute('aria-expanded', String(!isOpen));
  menuButton.setAttribute('aria-label', isOpen ? 'Open navigation' : 'Close navigation');
  document.body.classList.toggle('menu-open', !isOpen);
});
navigation?.querySelectorAll('a').forEach((link) => link.addEventListener('click', closeMenu));

document.addEventListener('keydown', (event) => { if (event.key === 'Escape') closeMenu(); });
document.addEventListener('pointerdown', (event) => {
  if (!document.body.classList.contains('menu-open')) return;
  const target = event.target;
  if (target instanceof Node && !menuButton?.contains(target) && !navigation?.contains(target)) closeMenu();
});
window.matchMedia('(min-width: 901px)').addEventListener('change', closeMenu);

const progress = document.querySelector<HTMLElement>('.scroll-track > span');
let scrollScheduled = false;
function updateScrollProgress() {
  const fullHeight = document.documentElement.scrollHeight - window.innerHeight;
  const fraction = fullHeight > 0 ? Math.min(1, Math.max(0, window.scrollY / fullHeight)) : 0;
  progress?.style.setProperty('--progress', `${fraction * 100}%`);
  scrollScheduled = false;
}
window.addEventListener('scroll', () => {
  if (scrollScheduled) return;
  scrollScheduled = true;
  requestAnimationFrame(updateScrollProgress);
}, { passive: true });
updateScrollProgress();

const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
if (!reducedMotion && 'IntersectionObserver' in window) {
  const revealObserver = new IntersectionObserver((entries, observer) => {
    for (const entry of entries) {
      if (!entry.isIntersecting) continue;
      entry.target.classList.add('revealed');
      observer.unobserve(entry.target);
    }
  }, { threshold: 0.08, rootMargin: '0px 0px -20px 0px' });
  document.querySelectorAll<HTMLElement>('.section-heading, .project-card, .capability-grid article, .case-main, .case-meta, .showcase-aside, .reading-feature > div, .insight-item').forEach((element) => {
    if (element.getBoundingClientRect().top <= window.innerHeight - 28) return;
    element.classList.add('reveal-pending');
    revealObserver.observe(element);
  });
}

if (!reducedMotion && window.matchMedia('(pointer: fine)').matches) {
  document.querySelectorAll<HTMLElement>('.system-visual[data-tilt="true"]').forEach((visual) => {
    let frame = 0;
    visual.addEventListener('pointermove', (event) => {
      if (frame) cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const box = visual.getBoundingClientRect();
        const x = (event.clientX - box.left) / box.width - 0.5;
        const y = (event.clientY - box.top) / box.height - 0.5;
        visual.style.setProperty('--tilt-x', `${(-y * 6).toFixed(2)}deg`);
        visual.style.setProperty('--tilt-y', `${(x * 6).toFixed(2)}deg`);
      });
    });
    visual.addEventListener('pointerleave', () => {
      if (frame) cancelAnimationFrame(frame);
      visual.style.setProperty('--tilt-x', '0deg');
      visual.style.setProperty('--tilt-y', '0deg');
    });
  });
}
