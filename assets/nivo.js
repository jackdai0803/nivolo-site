import { createRig, idleAt, neutralPose } from './nivo-rig.js?v=8';

const strings = {
  en: { transform: 'Transform Nivo', hint: 'Tap to transform', off: 'Sound: off', on: 'Sound: on' },
  zh: { transform: '变换 Nivo 的外观', hint: '点我变身', off: '声音：关', on: '声音：开' },
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
const deepSeaArtwork = new URL('./nivo-deepsea.webp', import.meta.url).href;
// A calm swimming loop with a short hello, only for the Plus card.
const plusIdleAt = (ms) => {
  const pose = idleAt(ms);
  const seconds = ms / 1000;
  pose.y *= 1.7;
  pose.rotate = 2.2 * Math.sin(seconds * Math.PI * 2 / 7.1);
  pose.left *= 3;
  pose.right *= 3;
  const wave = (ms % 11200 - 1800) / 2200;
  if (wave > 0 && wave < 1) {
    const lift = Math.sin(wave * Math.PI) ** 2;
    pose.right -= lift * (24 + 8 * Math.sin(wave * Math.PI * 6));
  }
  return pose;
};
document.querySelectorAll('[data-nivo]').forEach((container, index) => {
  const deepSea = container.dataset.nivoAppearance === 'deepsea';
  const play = container.closest('[data-nivo-play]');
  const looks = play ? ['classic', 'deepsea'] : [deepSea ? 'deepsea' : 'classic'];
  if (play) container.replaceChildren();
  const characters = looks.map(look => {
    const layer = play ? document.createElement('span') : container;
    if (play) {
      layer.className = 'nivo-look';
      layer.style.opacity = look === 'classic' ? '1' : '0';
      container.append(layer);
    }
    const rig = createRig(layer, artwork, `site-nivo-${index}-${look}`, 'Nivo', look, deepSeaArtwork);
    if (play) layer.querySelector('svg').setAttribute('viewBox', '160 170 970 970');
    else if (deepSea) layer.querySelector('svg').setAttribute('viewBox', '0 0 1254 1254');
    return { look, layer, rig };
  });
  let frame = 0;
  let clock = 0;
  let previous = null;
  let visible = false;
  let progress = 0;
  let target = 0;
  const ease = value => { const p = Math.max(0, Math.min(1, value)); return p * p * (3 - 2 * p); };
  const render = (now) => {
    cancelAnimationFrame(frame);
    const delta = previous === null ? 0 : Math.min(40, now - previous);
    clock += delta;
    previous = now;
    progress = preference.matches ? target : progress + Math.sign(target - progress) * Math.min(Math.abs(target - progress), delta / 900);
    const blend = ease((progress - .28) / .44);
    const pose = preference.matches ? neutralPose() : deepSea ? plusIdleAt(clock) : idleAt(clock);
    if (play) {
      // One gentle hop follows the reveal, including when a tap reverses it.
      const lift = Math.sin(progress * Math.PI);
      pose.y -= 28 * lift;
      pose.sx *= 1 - .02 * lift;
      pose.sy *= 1 + .02 * lift;
      pose.blink = Math.max(pose.blink, lift ** 6);
      container.dataset.nivoAppearance = blend >= .5 ? 'deepsea' : 'classic';
    }
    for (const {look, layer, rig} of characters) {
      if (play) layer.style.opacity = String(look === 'deepsea' ? blend : 1 - blend);
      rig.render(play && look === 'deepsea' ? { ...pose, left: 0, right: 0 } : pose);
    }
    if (visible && !document.hidden && !preference.matches) frame = requestAnimationFrame(render);
  };
  const resume = () => {
    previous = null;
    render(performance.now());
  };
  if (play) {
    play.setAttribute('aria-label', t('transform'));
    if (hint) {
      hint.classList.add('nivo-hint-bubble');
      play.append(hint);
    }
    // Enable discovery only once both looks can appear without a blank frame.
    const preload = new Image();
    preload.src = deepSeaArtwork;
    preload.decode().then(() => { play.disabled = false; }).catch(() => {});
    play.addEventListener('click', () => {
      target = 1 - target;
      play.classList.add('has-transformed');
      render(performance.now());
      pop();
    });
  }
  const observer = new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; resume(); });
  observer.observe(container);
  document.addEventListener('visibilitychange', resume);
  preference.addEventListener('change', resume);
  window.addEventListener('pagehide', () => cancelAnimationFrame(frame));
  window.addEventListener('pageshow', resume);
  render(performance.now());
});
