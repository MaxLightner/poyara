/* Homepage-only, progressive motion. Nothing intercepts wheel or touch input. */
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

if (!prefersReducedMotion && 'IntersectionObserver' in window) {
  const revealables = document.querySelectorAll<HTMLElement>('[data-reveal]');
  const observer = new IntersectionObserver((entries, instance) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('poy-in-view');
      instance.unobserve(entry.target);
    });
  }, { threshold: .065, rootMargin: '0px 0px -20px 0px' });
  revealables.forEach((element) => {
    if (element.getBoundingClientRect().top < window.innerHeight - 20) {
      element.classList.add('poy-in-view');
    } else {
      observer.observe(element);
    }
  });
  document.documentElement.classList.add('poy-motion-ready');
}

const studioStage = document.querySelector<HTMLElement>('.poy-stage');
if (studioStage && !prefersReducedMotion && window.matchMedia('(pointer: fine)').matches) {
  let pointerFrame = 0;
  let localX = .5;
  let localY = .5;

  studioStage.addEventListener('pointermove', (event) => {
    const bounds = studioStage.getBoundingClientRect();
    localX = Math.max(0, Math.min(1, (event.clientX - bounds.left) / bounds.width));
    localY = Math.max(0, Math.min(1, (event.clientY - bounds.top) / bounds.height));
    if (pointerFrame) return;
    pointerFrame = requestAnimationFrame(() => {
      studioStage.style.setProperty('--mx', `${(localX * 100).toFixed(2)}%`);
      studioStage.style.setProperty('--my', `${(localY * 100).toFixed(2)}%`);
      const dx = (localX - .5) * 19;
      const dy = (localY - .5) * 19;
      studioStage.style.setProperty('--stage-lines-x', `${(dx * .55).toFixed(2)}px`);
      studioStage.style.setProperty('--stage-lines-y', `${(dy * .55).toFixed(2)}px`);
      studioStage.style.setProperty('--stage-node-x', `${(dx * -.35).toFixed(2)}px`);
      studioStage.style.setProperty('--stage-node-y', `${(dy * -.35).toFixed(2)}px`);
      studioStage.style.setProperty('--stage-core-x', `${(dx * .65).toFixed(2)}px`);
      studioStage.style.setProperty('--stage-core-y', `${(dy * .65).toFixed(2)}px`);
      pointerFrame = 0;
    });
  }, { passive: true });

  studioStage.addEventListener('pointerleave', () => {
    studioStage.style.setProperty('--mx', '50%');
    studioStage.style.setProperty('--my', '50%');
    for (const variable of ['--stage-lines-x', '--stage-lines-y', '--stage-node-x', '--stage-node-y', '--stage-core-x', '--stage-core-y']) {
      studioStage.style.setProperty(variable, '0px');
    }
  });
}
