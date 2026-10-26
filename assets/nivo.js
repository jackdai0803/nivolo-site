import { createRig, idleAt, neutralPose, celebrationAt, CELEBRATION_MS } from './nivo-rig.js';

const strings = {
  en: { squish: 'Give Nivo a little squish', hint: 'Go on, give Nivo a squish.', again: 'One more? Nivo thinks so.', off: 'Sound off', on: 'Sound on' },
  zh: { squish: '轻轻捏一下 Nivo', hint: '来，轻轻捏一下 Nivo。', again: '再来一次？Nivo 也这么想。', off: '声音已关闭', on: '声音已开启' },
};
const t = (key) => strings[document.documentElement.lang.startsWith('zh') ? 'zh' : 'en'][key];
const controls = document.querySelector('[data-nivo-controls]');
const hint = controls?.querySelector('[data-nivo-hint]');
const soundButton = controls?.querySelector('[data-nivo-sound]');
let soundOn = false;
let audio;
const pop = async () => {
  if (!soundOn) return;
  try {
    const Audio = window.AudioContext || window.webkitAudioContext;
    if (!Audio) return;
    const context = audio ??= new Audio();
    if (context.state !== 'running') await context.resume();
    if (!soundOn || audio !== context || document.hidden) return;
    const now = context.currentTime;
    [[0, 430, 160, .07, .12], [.085, 1175, 1175, .025, .25]].forEach(([delay, from, to, volume, length]) => {
      const tone = context.createOscillator();
      const gain = context.createGain();
      tone.type = 'sine';
      tone.frequency.setValueAtTime(from, now + delay);
      tone.frequency.exponentialRampToValueAtTime(to, now + delay + length);
      gain.gain.setValueAtTime(0, now + delay);
      gain.gain.linearRampToValueAtTime(volume, now + delay + .006);
      gain.gain.exponentialRampToValueAtTime(.0001, now + delay + length);
      tone.connect(gain); gain.connect(context.destination);
      tone.start(now + delay); tone.stop(now + delay + length);
      tone.onended = () => { tone.disconnect(); gain.disconnect(); };
    });
  } catch { /* Sound is an optional extra; the visual response always works. */ }
};
if (controls) {
  hint.textContent = t('hint');
  soundButton.querySelector('[data-nivo-sound-label]').textContent = t('off');
  soundButton.addEventListener('click', () => {
    soundOn = !soundOn;
    soundButton.setAttribute('aria-pressed', String(soundOn));
    soundButton.querySelector('[data-nivo-sound-label]').textContent = t(soundOn ? 'on' : 'off');
    if (soundOn) pop();
    else { audio?.close().catch(() => {}); audio = undefined; }
  });
  controls.hidden = false;
}

// Snapshot of the shared app rig. Refresh both files when its artwork changes.
const preference = window.matchMedia('(prefers-reduced-motion: reduce)');
const artwork = new URL('./nivo-body.png', import.meta.url).href;
document.querySelectorAll('[data-nivo]').forEach((container, index) => {
  const rig = createRig(container, artwork, 'site-nivo-' + index, 'Nivo');
  let frame = 0;
  let clock = 0;
  let previous = null;
  let visible = false;
  let reactionStart = null;
  let settleTimer;
  let lastTap = -Infinity;
  const play = container.closest('[data-nivo-play]');
  const render = (now) => {
    if (previous !== null) clock += Math.min(40, now - previous);
    previous = now;
    const elapsed = reactionStart === null ? CELEBRATION_MS : now - reactionStart;
    if (elapsed >= CELEBRATION_MS) reactionStart = null;
    rig.render(preference.matches ? neutralPose() : reactionStart !== null ? celebrationAt(elapsed) : idleAt(clock));
    if (visible && !document.hidden && !preference.matches) frame = requestAnimationFrame(render);
  };
  const resume = () => {
    cancelAnimationFrame(frame);
    clearTimeout(settleTimer);
    reactionStart = null;
    play?.classList.remove('is-delighted');
    if (play && hint) hint.textContent = t('hint');
    previous = null;
    rig.render(neutralPose());
    if (visible && !document.hidden && !preference.matches) frame = requestAnimationFrame(render);
  };
  if (play) {
    play.disabled = false;
    play.setAttribute('aria-label', t('squish'));
    play.addEventListener('click', () => {
      const now = performance.now();
      if (now - lastTap < 250) return;
      lastTap = now;
      clearTimeout(settleTimer);
      hint.textContent = t('again');
      play.classList.add('is-delighted');
      if (preference.matches) {
        rig.render({ ...neutralPose(), happy: 1, blink: 1, left: 18, right: -18 });
      } else {
        reactionStart = now;
        if (!visible) { visible = true; previous = null; frame = requestAnimationFrame(render); }
      }
      pop();
      settleTimer = setTimeout(() => {
        play.classList.remove('is-delighted');
        hint.textContent = t('hint');
        if (preference.matches) rig.render(neutralPose());
      }, CELEBRATION_MS + 600);
    });
  }
  const observer = new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; resume(); });
  observer.observe(container);
  document.addEventListener('visibilitychange', resume);
  preference.addEventListener('change', resume);
  window.addEventListener('pagehide', () => {
    cancelAnimationFrame(frame);
    clearTimeout(settleTimer);
  });
  window.addEventListener('pageshow', resume);
  rig.render(neutralPose());
});
