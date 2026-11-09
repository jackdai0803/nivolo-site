import { createRig, idleAt, neutralPose } from './nivo-rig.js?v=8';
import { makeClassicSkin, heroLooks } from './nivo-skins.js?v=1';

const strings = {
  en: { transform: 'Transform Nivo', pause: 'Pause animation', resume: 'Resume animation', off: 'Sound: off', on: 'Sound: on' },
  zh: { transform: '变换 Nivo 的外观', pause: '暂停动画', resume: '继续动画', off: '声音：关', on: '声音：开' },
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
  hint?.remove();
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
  const looks = play ? heroLooks : [{ id: deepSea ? 'deepsea' : 'classic', name: 'Nivo' }];
  if (play) container.replaceChildren();
  const characters = new Map();
  const mount = (lookIndex) => {
    if (characters.has(lookIndex)) return characters.get(lookIndex);
    const look = looks[lookIndex];
    const layer = play ? document.createElement('span') : container;
    if (play) {
      layer.className = 'nivo-look';
      layer.dataset.look = look.id;
      container.append(layer);
    }
    const rig = play
      ? makeClassicSkin(layer, look, `site-nivo-${index}-${look.id}`)
      : createRig(layer, artwork, `site-nivo-${index}-${look.id}`, 'Nivo', look.id, deepSeaArtwork);
    if (play) {
      // Fit the visible body, not the PNG canvas: Deep-Sea's silhouette is
      // 1019px tall versus Classic's 875px. Preserve its own face/glow rig.
      layer.querySelector('svg').setAttribute('viewBox', look.id === 'deepsea'
        ? '87 59 1130 1130' : '160 170 970 970');
    } else if (deepSea) layer.querySelector('svg').setAttribute('viewBox', '0 0 1254 1254');
    const character = { look, layer, rig, opacity: lookIndex === 0 ? 1 : 0, from: 0 };
    characters.set(lookIndex, character);
    return character;
  };
  mount(0);
  if (play) container.dataset.nivoAppearance = looks[0].id;
  let frame = 0;
  let clock = 0;
  let previous = null;
  let visible = false;
  let progress = 1;
  let target = 0;
  let hop = 0;
  let ready = false;
  let paused = false;
  let lastChange = 0;
  let pauseButton;
  const advance = () => {
    target = (target + 1) % looks.length;
    mount(target);
    for (const character of characters.values()) character.from = character.opacity;
    progress = 0;
    lastChange = clock;
    container.dataset.nivoAppearance = looks[target].id;
  };
  const ease = value => { const p = Math.max(0, Math.min(1, value)); return p * p * (3 - 2 * p); };
  const render = (now) => {
    cancelAnimationFrame(frame);
    const delta = previous === null ? 0 : Math.min(40, now - previous);
    const moving = visible && !document.hidden && !preference.matches && !paused;
    if (moving) clock += delta;
    if (play && ready && moving && clock - lastChange >= 4000) advance();
    previous = now;
    progress = preference.matches || paused ? 1 : Math.min(1, progress + delta / 560);
    const blend = ease(progress);
    const pose = preference.matches || paused ? neutralPose() : deepSea ? plusIdleAt(clock) : idleAt(clock);
    if (play) {
      // Follow the current hop when another click redirects the reveal.
      hop = preference.matches || paused ? 0 : hop + (Math.sin(progress * Math.PI) * 24 - hop) * (1 - Math.exp(-delta / 70));
      pose.y -= hop;
      pose.sx *= 1 - hop / 1400;
      pose.sy *= 1 + hop / 1400;
      pose.blink = Math.max(pose.blink, (hop / 24) ** 6);
      pose.skinTimeMs = clock;
      pose.skinMotion = moving;
    }
    for (const [lookIndex, character] of characters) {
      const { look, layer, rig } = character;
      if (play) {
        character.opacity = character.from * (1 - blend) + (lookIndex === target ? blend : 0);
        layer.style.opacity = String(character.opacity);
        if (progress === 1 && lookIndex !== target) {
          layer.remove();
          characters.delete(lookIndex);
          continue;
        }
      }
      rig.render(play && look.id === 'deepsea' ? { ...pose, left: 0, right: 0 } : pose);
    }
    if (moving) frame = requestAnimationFrame(render);
  };
  const resume = () => {
    previous = null;
    if (pauseButton) pauseButton.style.display = preference.matches ? 'none' : '';
    render(performance.now());
  };
  if (play) {
    play.setAttribute('aria-label', t('transform'));
    if (controls) {
      pauseButton = document.createElement('button');
      pauseButton.type = 'button';
      pauseButton.className = 'nivo-sound';
      pauseButton.textContent = t('pause');
      pauseButton.setAttribute('aria-pressed', 'false');
      pauseButton.style.display = preference.matches ? 'none' : '';
      controls.prepend(pauseButton);
      pauseButton.addEventListener('click', () => {
        paused = !paused;
        pauseButton.textContent = t(paused ? 'resume' : 'pause');
        pauseButton.setAttribute('aria-pressed', String(paused));
        resume();
      });
    }
    // Every collection skin shares these two images; decode before enabling.
    Promise.all([artwork, deepSeaArtwork].map(src => {
      const preload = new Image();
      preload.src = src;
      return preload.decode();
    })).then(() => { play.disabled = false; ready = true; lastChange = clock; }).catch(() => {});
    play.addEventListener('click', () => {
      render(performance.now());
      advance();
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
