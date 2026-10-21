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
  }, { threshold: .04, rootMargin: '0px 0px 100px 0px' });
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
    if (pointerFrame) cancelAnimationFrame(pointerFrame);
    pointerFrame = 0;
    studioStage.style.setProperty('--mx', '50%');
    studioStage.style.setProperty('--my', '50%');
    for (const variable of ['--stage-lines-x', '--stage-lines-y', '--stage-node-x', '--stage-node-y', '--stage-core-x', '--stage-core-y']) {
      studioStage.style.setProperty(variable, '0px');
    }
  });
}

// A single compositor-only cursor treatment for the whole homepage.
// The halo eases toward the pointer and stops requesting frames when settled.
const cursorRing = document.querySelector<HTMLElement>('.poy-pointer-ring');
const cursorDot = document.querySelector<HTMLElement>('.poy-pointer-dot');
if (cursorRing && cursorDot && !prefersReducedMotion && window.matchMedia('(pointer: fine) and (hover: hover)').matches) {
  let currentX = -150;
  let currentY = -150;
  let targetX = -150;
  let targetY = -150;
  let lastFrameTime = 0;
  let cursorFrame = 0;
  let started = false;

  const easeCursor = (time: number) => {
    const delta = Math.min(40, lastFrameTime ? time - lastFrameTime : 16.7);
    lastFrameTime = time;
    const ease = 1 - Math.exp(-delta / 82);
    currentX += (targetX - currentX) * ease;
    currentY += (targetY - currentY) * ease;
    cursorRing.style.transform = `translate3d(${currentX.toFixed(2)}px,${currentY.toFixed(2)}px,0) translate(-50%,-50%)`;
    if (Math.abs(targetX - currentX) + Math.abs(targetY - currentY) > .24) {
      cursorFrame = requestAnimationFrame(easeCursor);
    } else {
      cursorFrame = 0;
      lastFrameTime = 0;
    }
  };

  document.addEventListener('pointermove', (event) => {
    if (event.pointerType === 'touch') return;
    targetX = event.clientX;
    targetY = event.clientY;
    if (!started) {
      currentX = targetX;
      currentY = targetY;
      started = true;
    }
    cursorDot.style.transform = `translate3d(${targetX}px,${targetY}px,0) translate(-50%,-50%)`;
    document.documentElement.classList.add('poy-pointer-visible');
    if (!cursorFrame) cursorFrame = requestAnimationFrame(easeCursor);
  }, { passive: true });

  document.addEventListener('pointerover', (event) => {
    const target = event.target;
    document.documentElement.classList.toggle('poy-pointer-hover', target instanceof Element && Boolean(target.closest('a, button, [role="button"]')));
  }, { passive: true });

  document.addEventListener('pointerout', (event) => {
    if (event.relatedTarget) return;
    document.documentElement.classList.remove('poy-pointer-visible', 'poy-pointer-hover');
    started = false;
    if (cursorFrame) cancelAnimationFrame(cursorFrame);
    cursorFrame = 0;
    lastFrameTime = 0;
  }, { passive: true });
  window.addEventListener('blur', () => {
    document.documentElement.classList.remove('poy-pointer-visible', 'poy-pointer-hover');
    started = false;
    if (cursorFrame) cancelAnimationFrame(cursorFrame);
    cursorFrame = 0;
    lastFrameTime = 0;
  });
}
