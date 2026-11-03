import { createRig, idleAt, neutralPose } from './nivo-rig.js?v=5';

// The launch page owns this rig so the flipper and its paddle share one motion.
const container = document.querySelector('[data-launch-nivo]');
const card = document.getElementById('launchCard');
if (container && card) {
  const artwork = new URL('./nivo-body.png', import.meta.url).href;
  const deepSeaArtwork = new URL('./nivo-deepsea.webp', import.meta.url).href;
  let appearance = 'classic';
  let rig, paddle, check;
  function setAppearance(next) {
    appearance = next;
    container.dataset.nivoAppearance = next;
    rig = createRig(container, artwork, 'launch-nivo', 'Nivo', next, deepSeaArtwork);
    // Both looks share the same scale and centre throughout the turn.
    container.querySelector('svg').setAttribute('viewBox', '160 170 970 970');
    const wing = container.querySelector('[data-part="right-flipper"]');
    wing.insertAdjacentHTML('afterbegin', `<g data-launch-paddle opacity="0" aria-hidden="true">
      <rect x="1024" y="524" width="30" height="330" rx="15" fill="#e0c99f"/>
      <rect x="1028" y="745" width="22" height="102" rx="11" fill="#397250"/>
      <circle cx="1039" cy="487" r="119" fill="#345e48"/>
      <circle cx="1039" cy="478" r="119" fill="#f6f6ec"/>
      <circle cx="1039" cy="478" r="102" fill="#4a9363"/>
      <path d="M958 446 A90 90 0 0 1 1096 409" fill="none" stroke="#7bbb8c" stroke-width="8" stroke-linecap="round"/>
      <path data-launch-paddle-check pathLength="1" d="m988 478 34 34 69-78" fill="none" stroke="#fffef4" stroke-width="27" stroke-linecap="round" stroke-linejoin="round"/>
    </g>`);
    paddle = wing.querySelector('[data-launch-paddle]');
    check = wing.querySelector('[data-launch-paddle-check]');
  }
  setAppearance('classic');
  // Do not turn away from Classic until the other artwork is decoded.
  let artworkReady = false;
  const preload = new Image();
  preload.src = deepSeaArtwork;
  preload.decode().then(() => { artworkReady = true; }).catch(() => {});
  const preference = window.matchMedia('(prefers-reduced-motion: reduce)');
  let frame = 0;
  let visible = true;
  let joined = false;
  let started = 0;
  let animateArrival = false;
  let clock = 0;
  let previous = null;
  const HOLD_MS = 4400;
  const TURN_MS = 1100;
  const ease = value => { const p = Math.max(0, Math.min(1, value)); return p * p * (3 - 2 * p); };

  function render(now) {
    cancelAnimationFrame(frame);
    if (previous !== null && visible && !document.hidden && !preference.matches && !joined && artworkReady) {
      clock += Math.min(40, now - previous);
    }
    previous = now;
    const cycle = HOLD_MS + TURN_MS;
    const turn = ease((clock % cycle - HOLD_MS) / TURN_MS);
    if (!joined && !preference.matches) {
      const next = (Math.floor(clock / cycle) + (turn >= .5 ? 1 : 0)) % 2 ? 'deepsea' : 'classic';
      if (next !== appearance) setAppearance(next);
      // Swap at the narrow edge of the turn so the new face unfolds upright.
      const angle = turn < .5 ? turn * 180 : (turn - 1) * 180;
      container.style.transform = `perspective(800px) translateY(${-12 * Math.sin(turn * Math.PI)}px) rotateY(${angle}deg)`;
    } else {
      container.style.transform = 'none';
    }
    const elapsed = now - started;
    const progress = joined ? (animateArrival && !preference.matches ? ease(elapsed / 750) : 1) : 0;
    const pose = joined ? neutralPose() : preference.matches ? neutralPose() : idleAt(clock);
    if (joined) {
      const lift = Math.sin(progress * Math.PI);
      pose.right = -78 * progress;
      pose.left = 14 * progress;
      pose.y = -32 * lift;
      pose.rotate = -2 * lift;
      pose.sx = 1 + .025 * Math.sin(progress * Math.PI * 2);
      pose.sy = 2 - pose.sx;
      pose.happy = lift;
      pose.blink = lift;
    }
    rig.render(pose);
    // Keep the paddle upright as the flipper lifts; its handle stays in the grip.
    paddle.setAttribute('transform', `rotate(${-pose.right + 80 - 66 * progress} 1039 819)`);
    paddle.setAttribute('opacity', String(joined ? Math.min(1, progress * 6) : 0));
    check.style.strokeDasharray = '1';
    check.style.strokeDashoffset = String(1 - (animateArrival && !preference.matches ? ease((elapsed - 420) / 300) : 1));
    if (visible && !document.hidden && !preference.matches && (!joined || (animateArrival && elapsed < 950))) {
      frame = requestAnimationFrame(render);
    }
  }
  function update() {
    const next = card.classList.contains('is-joined');
    if (next !== joined) {
      joined = next;
      if (!joined) clock = appearance === 'deepsea' ? HOLD_MS + TURN_MS : 0;
      started = performance.now();
      animateArrival = joined && card.classList.contains('is-celebrating');
    }
    previous = null;
    render(performance.now());
  }
  new MutationObserver(update).observe(card, { attributes: true, attributeFilter: ['class'] });
  new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; update(); }).observe(container);
  preference.addEventListener('change', update);
  document.addEventListener('visibilitychange', update);
  window.addEventListener('pagehide', () => cancelAnimationFrame(frame));
  window.addEventListener('pageshow', update);
  update();
}
