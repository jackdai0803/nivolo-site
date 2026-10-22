import { createRig, idleAt, neutralPose } from './nivo-rig.js';

// Snapshot of the shared app rig. Refresh both files when its artwork changes.
const preference = window.matchMedia('(prefers-reduced-motion: reduce)');
const artwork = new URL('./nivo-body.png', import.meta.url).href;
document.querySelectorAll('[data-nivo]').forEach((container, index) => {
  const rig = createRig(container, artwork, 'site-nivo-' + index, 'Nivo');
  let frame = 0;
  let clock = 0;
  let previous = null;
  let visible = false;
  const render = (now) => {
    if (previous !== null) clock += Math.min(40, now - previous);
    previous = now;
    rig.render(preference.matches ? neutralPose() : idleAt(clock));
    if (visible && !document.hidden && !preference.matches) frame = requestAnimationFrame(render);
  };
  const resume = () => {
    cancelAnimationFrame(frame);
    previous = null;
    rig.render(neutralPose());
    if (visible && !document.hidden && !preference.matches) frame = requestAnimationFrame(render);
  };
  const observer = new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; resume(); });
  observer.observe(container);
  document.addEventListener('visibilitychange', resume);
  preference.addEventListener('change', resume);
  window.addEventListener('pagehide', () => {
    cancelAnimationFrame(frame);
  });
  window.addEventListener('pageshow', resume);
  rig.render(neutralPose());
});
