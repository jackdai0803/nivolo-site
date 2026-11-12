import { createRig, idleAt, neutralPose, smallWinAt, celebrationAt, SMALL_WIN_MS, CELEBRATION_MS } from './nivo-rig.js?v=20261112-nivo-soft-edge';
import { makeClassicSkin, heroLooks } from './nivo-skins.js?v=20261112-nivo-soft-edge';
import { withLightweightIdle } from './nivo-idle.js?v=20261112-nivo-soft-edge';

const strings = {
  en: { pause: 'Pause animation', resume: 'Resume animation', off: 'Sound: off', on: 'Sound: on' },
  zh: { pause: '暂停动画', resume: '继续动画', off: '声音：关', on: '声音：开' },
};
const t = (key) => strings[document.documentElement.lang.startsWith('zh') ? 'zh' : 'en'][key];
const controls = document.querySelector('[data-nivo-controls]');
const soundButton = controls?.querySelector('[data-nivo-sound]');
const pauseButton = controls ? document.createElement('button') : null;
let cyclePaused = false;
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
  pauseButton.type = 'button';
  pauseButton.className = 'nivo-sound';
  pauseButton.textContent = t('pause');
  pauseButton.setAttribute('aria-pressed', 'false');
  controls.prepend(pauseButton);
  pauseButton.addEventListener('click', () => {
    cyclePaused = !cyclePaused;
    pauseButton.textContent = t(cyclePaused ? 'resume' : 'pause');
    pauseButton.setAttribute('aria-pressed', String(cyclePaused));
  });
  soundButton.querySelector('[data-nivo-sound-label]').textContent = t('off');
  soundButton.addEventListener('click', () => {
    soundOn = !soundOn;
    soundButton.setAttribute('aria-pressed', String(soundOn));
    soundButton.querySelector('[data-nivo-sound-label]').textContent = t(soundOn ? 'on' : 'off');
    if (soundOn) pop();
    else { audio?.close().catch(() => {}); audio = undefined; }
  });
}

// Snapshot of the shared app rig. Refresh both files when its artwork changes.
const preference = window.matchMedia('(prefers-reduced-motion: reduce)');
const artwork = new URL('./nivo-body.png', import.meta.url).href;
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
  const autoCycle = container.hasAttribute('data-nivo-cycle');
  const demoNivo = container.hasAttribute('data-demo-nivo');
  const looks = autoCycle ? heroLooks : [{ id: deepSea ? 'deepsea' : 'classic', name: 'Nivo' }];
  if (autoCycle) container.replaceChildren();
  const characters = new Map();
  const mount = (lookIndex) => {
    if (characters.has(lookIndex)) return characters.get(lookIndex);
    const look = looks[lookIndex];
    const layer = autoCycle ? document.createElement('span') : container;
    if (autoCycle) {
      layer.className = 'nivo-look';
      layer.dataset.look = look.id;
      container.append(layer);
    }
    const sourceRig = autoCycle
      ? makeClassicSkin(layer, look, `site-nivo-${index}-${look.id}`)
      : createRig(layer, artwork, `site-nivo-${index}-${look.id}`, 'Nivo', look.id);
    const rig = withLightweightIdle(sourceRig, layer, look.id);
    const character = { look, layer, rig, startedAt: 0, opacity: lookIndex === 0 ? 1 : 0, from: 0 };
    characters.set(lookIndex, character);
    return character;
  };
  mount(0);
  if (autoCycle) container.dataset.nivoAppearance = looks[0].id;
  let frame = 0;
  let clock = 0;
  let previous = null;
  let visible = false;
  let progress = 1;
  let target = 0;
  let hop = 0;
  let ready = false;
  let lastChange = 0;
  let reactionStep = 0;
  let reactionStart = 0;
  const advance = () => {
    target = (target + 1) % looks.length;
    mount(target).startedAt = clock;
    for (const character of characters.values()) character.from = character.opacity;
    progress = 0;
    lastChange = clock;
    container.dataset.nivoAppearance = looks[target].id;
  };
  const ease = value => { const p = Math.max(0, Math.min(1, value)); return p * p * (3 - 2 * p); };
  const render = (now) => {
    cancelAnimationFrame(frame);
    const delta = previous === null ? 0 : Math.min(40, now - previous);
    const paused = autoCycle && cyclePaused;
    const moving = visible && !document.hidden && !preference.matches && !paused;
    if (moving) clock += delta;
    if (autoCycle && ready && moving && clock - lastChange >= (looks[target].id === 'focused' ? 8000 : 2500)) {
      advance();
      if (!demoNivo) pop();
    }
    previous = now;
    progress = preference.matches || paused ? 1 : Math.min(1, progress + delta / 560);
    const blend = ease(progress);
    const elapsed = now - reactionStart;
    const finished = reactionStep === 3;
    const reacting = reactionStep > 0 && elapsed < (finished ? CELEBRATION_MS : SMALL_WIN_MS);
    let pose;
    if (preference.matches || paused) {
      pose = neutralPose();
      if (reactionStep) Object.assign(pose, { happy: 1, blink: 1, left: 12, right: -12 });
    } else if (reacting) {
      pose = finished ? celebrationAt(elapsed) : smallWinAt(elapsed);
    } else {
      pose = deepSea ? plusIdleAt(clock) : idleAt(clock);
    }
    if (autoCycle) {
      hop = preference.matches || paused || reacting ? 0 : hop + (Math.sin(progress * Math.PI) * 24 - hop) * (1 - Math.exp(-delta / 70));
      pose.y -= hop;
      pose.sx *= 1 - hop / 1400;
      pose.sy *= 1 + hop / 1400;
      pose.blink = Math.max(pose.blink, (hop / 24) ** 6);
      pose.skinTimeMs = clock;
      pose.skinMotion = moving;
      pose.skinReacting = reacting;
    }
    for (const [lookIndex, character] of characters) {
      const { look, layer, rig } = character;
      if (autoCycle) {
        character.opacity = character.from * (1 - blend) + (lookIndex === target ? blend : 0);
        layer.style.opacity = String(character.opacity);
        if (progress === 1 && lookIndex !== target) {
          layer.remove();
          characters.delete(lookIndex);
          continue;
        }
      }
      rig.render(look.id === 'focused' ? { ...pose, skinTimeMs: clock - character.startedAt } : pose);
    }
    if (moving) frame = requestAnimationFrame(render);
  };
  const resume = () => {
    previous = null;
    if (autoCycle && controls) controls.hidden = preference.matches;
    render(performance.now());
  };
  if (autoCycle) {
    pauseButton?.addEventListener('click', resume);
    // Decode the shared artwork before the first automatic change.
    const preload = new Image();
    preload.src = artwork;
    preload.decode().then(() => { ready = true; lastChange = clock; }).catch(() => {});
  }
  if (demoNivo) {
    container.addEventListener('nivo-reaction', ({ detail }) => {
      reactionStep = detail;
      reactionStart = performance.now();
      lastChange = clock;
      resume();
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
