import { createRig, idleAt, neutralPose } from './nivo-rig.js?v=4';

// The launch page owns this rig so the flipper and its paddle share one motion.
const container = document.querySelector('[data-launch-nivo]');
const card = document.getElementById('launchCard');
if (container && card) {
  const rig = createRig(container, new URL('./nivo-body.png', import.meta.url).href, 'launch-nivo', 'Nivo');
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
  const paddle = wing.querySelector('[data-launch-paddle]');
  const check = wing.querySelector('[data-launch-paddle-check]');
  const preference = window.matchMedia('(prefers-reduced-motion: reduce)');
  let frame = 0;
  let visible = true;
  let joined = false;
  let started = 0;
  let animateArrival = false;
  const ease = value => { const p = Math.max(0, Math.min(1, value)); return p * p * (3 - 2 * p); };

  function render(now) {
    cancelAnimationFrame(frame);
    const elapsed = now - started;
    const progress = joined ? (animateArrival && !preference.matches ? ease(elapsed / 750) : 1) : 0;
    const pose = joined ? neutralPose() : preference.matches ? neutralPose() : idleAt(now);
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
      started = performance.now();
      animateArrival = joined && card.classList.contains('is-celebrating');
    }
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
