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
  if (!isOpen) navigation?.querySelector<HTMLAnchorElement>('a')?.focus();
});
navigation?.querySelectorAll('a').forEach((link) => link.addEventListener('click', closeMenu));

document.addEventListener('keydown', (event) => {
  if (event.key !== 'Escape' || !document.body.classList.contains('menu-open')) return;
  closeMenu();
  menuButton?.focus();
});
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
  document.querySelectorAll<HTMLElement>('.section-heading, .project-card, .capability-grid article, .case-main, .case-meta, .showcase-aside, .reading-feature > div, .insight-item, .reel-card, .closing-founder').forEach((element) => {
    if (element.getBoundingClientRect().top <= window.innerHeight - 28) return;
    element.classList.add('reveal-pending');
    revealObserver.observe(element);
  });
}

// The homepage's video cards are lightweight posters until explicitly played.
// Adobe's public CCV players are loaded only after a visitor requests a film.
const reelDialog = document.querySelector<HTMLDialogElement>('.reel-dialog');
const reelIframe = reelDialog?.querySelector<HTMLIFrameElement>('.reel-player iframe');
const reelVideo = reelDialog?.querySelector<HTMLVideoElement>('.reel-player video');
const reelDialogTitle = reelDialog?.querySelector<HTMLElement>('.reel-dialog-title');
const reelSource = reelDialog?.querySelector<HTMLAnchorElement>('.reel-dialog-foot a');
let reelTrigger: HTMLButtonElement | null = null;

function closeReel() {
  reelDialog?.close();
}
function cleanReel() {
  if (reelIframe) { reelIframe.src = 'about:blank'; reelIframe.hidden = false; }
  if (reelVideo) { reelVideo.pause(); reelVideo.removeAttribute('src'); reelVideo.load(); reelVideo.hidden = true; }
  reelTrigger?.focus({ preventScroll: true });
  reelTrigger = null;
}

document.querySelectorAll<HTMLButtonElement>('.reel-play').forEach((button) => {
  button.addEventListener('click', () => {
    if (!reelDialog || !reelIframe || !reelVideo) return;
    const source = button.dataset.videoSrc;
    if (!source) return;
    reelTrigger = button;
    if (reelDialogTitle) reelDialogTitle.textContent = button.dataset.videoTitle ?? 'Selected film';
    if (reelSource && button.dataset.sourceHref) reelSource.href = button.dataset.sourceHref;
    const isFile = /\.(?:mp4|webm|ogg)(?:\?.*)?$/i.test(source);
    reelVideo.hidden = !isFile;
    reelIframe.hidden = isFile;
    if (isFile) {
      reelVideo.src = source;
    } else {
      reelIframe.src = source;
    }
    reelDialog.showModal();
  });
});
reelDialog?.querySelector<HTMLButtonElement>('.reel-close')?.addEventListener('click', closeReel);
reelDialog?.addEventListener('click', (event) => { if (event.target === reelDialog) closeReel(); });
reelDialog?.addEventListener('close', cleanReel);

// Pointer polish: no permanent animation loop or expensive shader.
const homeCursor = document.querySelector<HTMLElement>('.home-cursor');
const canPointerMotion = !reducedMotion && window.matchMedia('(pointer: fine)').matches;
if (homeCursor && canPointerMotion) {
  let cursorFrame = 0;
  let cursorX = -100;
  let cursorY = -100;
  document.addEventListener('pointermove', (event) => {
    cursorX = event.clientX;
    cursorY = event.clientY;
    homeCursor.classList.add('cursor-visible');
    if (cursorFrame) return;
    cursorFrame = requestAnimationFrame(() => {
      const size = homeCursor.classList.contains('cursor-active') ? 55 : 37;
      homeCursor.style.transform = `translate3d(${cursorX - size / 2}px,${cursorY - size / 2}px,0)`;
      cursorFrame = 0;
    });
  }, { passive: true });
  document.querySelectorAll<HTMLElement>('a, button, .collage-panel').forEach((element) => {
    element.addEventListener('pointerenter', () => homeCursor.classList.add('cursor-active'));
    element.addEventListener('pointerleave', () => homeCursor.classList.remove('cursor-active'));
  });
  document.addEventListener('pointerout', (event) => {
    if (!event.relatedTarget) homeCursor.classList.remove('cursor-visible');
  });
  window.addEventListener('blur', () => homeCursor.classList.remove('cursor-visible'));
}

const stage = document.querySelector<HTMLElement>('.hero-collage');
if (stage && !reducedMotion) {
  let stageFrame = 0;
  const setStageMotion = () => {
    const rect = stage.getBoundingClientRect();
    if (rect.bottom > 0 && rect.top < window.innerHeight) {
      const amount = Math.max(-45, Math.min(45, (window.innerHeight / 2 - rect.top - rect.height / 2) * .09));
      stage.style.setProperty('--main-shift', `${amount.toFixed(1)}px`);
      stage.style.setProperty('--second-shift', `${(-amount * .45).toFixed(1)}px`);
      stage.style.setProperty('--stage-shift', `${(-amount * .2).toFixed(1)}px`);
    }
    stageFrame = 0;
  };
  window.addEventListener('scroll', () => {
    if (!stageFrame) stageFrame = requestAnimationFrame(setStageMotion);
  }, { passive: true });
  setStageMotion();
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
