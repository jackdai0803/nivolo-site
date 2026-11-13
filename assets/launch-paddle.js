import { myths } from './mythic-catalog.js?v=20261111-mythic';
import { makeMyth } from './mythic-art.js?v=20261113-power-alignment';
import { idleAt, neutralPose } from './nivo-rig.js?v=20261112-nivo-soft-edge';

import { makeClassicSkin, heroLooks } from './nivo-skins.js?v=20261112-nivo-soft-edge';
import { withLightweightIdle } from './nivo-idle.js?v=20261112-nivo-soft-edge';
import { makeFlower, flowers } from './flower-art.js?v=20261112-nivo-soft-edge';

// The launch page owns this rig so the flipper and its paddle share one motion.
const container = document.querySelector('[data-launch-nivo]');
const card = document.getElementById('launchCard');
if (container && card) {
  const artwork = new URL('./nivo-body.png', import.meta.url).href;
  let appearance = 'classic';
  const strings = { en: { transform: 'Transform Nivo' }, zh: { transform: '变换 Nivo 的外观' } };
  const t = key => strings[document.documentElement.lang.startsWith('zh') ? 'zh' : 'en'][key];
  container.setAttribute('aria-label', t('transform'));
  container.replaceChildren();
  const looks = [...heroLooks, ...flowers, ...myths, { id: 'early-supporter' }];
  const characters = new Map();
  function mount(index) {
    if (characters.has(index)) return characters.get(index);
    const look = looks[index].id;
    const layer = document.createElement('span');
    layer.className = 'launch-nivo-layer';
    layer.setAttribute('aria-hidden', 'true');
    layer.style.opacity = '0';
    layer.dataset.look = look;
    container.append(layer);
    const flower = flowers.find(item => item.id === look);
    const flowerRig = flower && makeFlower(layer, flower, `launch-nivo-${look}`);
    const myth = myths.find(item => item.id === look);
    const mythRig = myth && makeMyth(layer, myth, `launch-nivo-${look}`);
    const sourceRig = mythRig ? { render: pose => mythRig.render(pose, pose.skinTimeMs, pose.skinMotion) } : flowerRig
      ? { render: pose => flowerRig.render(pose, pose.skinTimeMs, pose.skinMotion) }
      : makeClassicSkin(layer, looks[index], `launch-nivo-${look}`);
    const rig = withLightweightIdle(sourceRig, layer, look);
    const wing = layer.querySelector('[data-part="right-flipper"]');
    wing.insertAdjacentHTML('afterbegin', `<g data-launch-paddle opacity="0" aria-hidden="true">
      <rect x="1024" y="524" width="30" height="330" rx="15" fill="#e0c99f"/>
      <rect x="1028" y="745" width="22" height="102" rx="11" fill="#397250"/>
      <circle cx="1039" cy="487" r="119" fill="#345e48"/>
      <circle cx="1039" cy="478" r="119" fill="#f6f6ec"/>
      <circle cx="1039" cy="478" r="102" fill="#4a9363"/>
      <path d="M958 446 A90 90 0 0 1 1096 409" fill="none" stroke="#7bbb8c" stroke-width="8" stroke-linecap="round"/>
      <path data-launch-paddle-check pathLength="1" d="m988 478 34 34 69-78" fill="none" stroke="#fffef4" stroke-width="27" stroke-linecap="round" stroke-linejoin="round"/>
    </g>`);
    const character = { look, layer, rig, startedAt: idleClock, paddle: wing.querySelector('[data-launch-paddle]'), check: wing.querySelector('[data-launch-paddle-check]') };
    characters.set(index, character);
    return character;
  }
  container.dataset.nivoAppearance = appearance;
  // All looks reuse the approved body artwork.
  let artworkReady = false;
  const preload = new Image();
  preload.src = artwork;
  preload.decode().then(() => { artworkReady = true; container.disabled = false; }).catch(() => {});
  const preference = window.matchMedia('(prefers-reduced-motion: reduce)');
  let frame = 0;
  let visible = true;
  let joined = false;
  let started = 0;
  let animateArrival = false;
  const HOLD_MS = 4400;
  const FIRST_HOLD_MS = 700;
  const CHANGE_MS = 1000;
  // Show the first colour change while the visitor starts entering their email.
  let clock = HOLD_MS - FIRST_HOLD_MS;
  let idleClock = 0;
  let direction = 1;
  let manualChange = false;
  let previous = null;
  const ease = value => { const p = Math.max(0, Math.min(1, value)); return p * p * (3 - 2 * p); };

  function render(now) {
    cancelAnimationFrame(frame);
    if (previous !== null && visible && !document.hidden && !preference.matches && (!joined || manualChange) && artworkReady) {
      const delta = Math.max(0, Math.min(40, now - previous));
      idleClock += delta;
      const cycle = HOLD_MS + CHANGE_MS;
      const before = Math.floor(clock / cycle);
      clock += delta * direction;
      if (direction < 0 && clock % cycle <= HOLD_MS) {
        clock = before * cycle;
        direction = 1;
        manualChange = false;
      } else if (Math.floor(clock / cycle) !== before) {
        manualChange = false;
      }
    }
    previous = now;
    const cycle = HOLD_MS + CHANGE_MS;
    const phase = Math.max(0, (clock % cycle - HOLD_MS) / CHANGE_MS);
    const blend = ease((phase - .32) / .28);
    const fromIndex = Math.floor(clock / cycle) % looks.length;
    const toIndex = (fromIndex + 1) % looks.length;
    const currentIndex = preference.matches ? looks.findIndex(look => look.id === appearance) : fromIndex;
    mount(currentIndex);
    if (!preference.matches && phase > 0) mount(toIndex);
    if (!preference.matches) appearance = looks[blend >= .5 ? toIndex : fromIndex].id;
    container.dataset.nivoAppearance = appearance;
    container.style.transform = 'none';
    const elapsed = now - started;
    const progress = joined ? (animateArrival && !preference.matches ? ease(elapsed / 750) : 1) : 0;
    const pose = joined ? neutralPose() : preference.matches ? neutralPose() : idleAt(idleClock);
    if (!joined && !preference.matches && phase > 0) {
      // A little anticipation and lift keeps Nivo round and facing the visitor.
      const poses = [[0, 0, 1, 0], [.2, 12, 1.045, -2], [.48, -34, .975, 2], [.72, -8, 1.02, -.8], [1, 0, 1, 0]];
      const index = Math.max(0, poses.findIndex((point, i) => i < poses.length - 1 && phase <= poses[i + 1][0]));
      const a = poses[index], b = poses[index + 1];
      const amount = ease((phase - a[0]) / (b[0] - a[0]));
      pose.y += a[1] + (b[1] - a[1]) * amount;
      pose.sx = a[2] + (b[2] - a[2]) * amount;
      pose.sy = 1 / pose.sx;
      pose.rotate += a[3] + (b[3] - a[3]) * amount;
      pose.blink = Math.max(pose.blink, Math.sin(Math.PI * ease((phase - .22) / .42)));
    }
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
    pose.skinTimeMs = idleClock;
    pose.skinMotion = visible && !document.hidden && !preference.matches && !joined;
    pose.skinReacting = joined;
    for (const [index, character] of characters) {
      const { look, layer, rig, paddle, check } = character;
      const opacity = preference.matches ? Number(index === currentIndex) : index === fromIndex ? 1 - blend : index === toIndex ? blend : 0;
      if (opacity === 0 && index !== currentIndex && !(phase > 0 && index === toIndex)) {
        layer.remove();
        characters.delete(index);
        continue;
      }
      layer.style.opacity = String(opacity);
      rig.render(look === 'focused' ? { ...pose, skinTimeMs: idleClock - character.startedAt } : pose);
      // Keep the paddle upright as the flipper lifts; its handle stays in the grip.
      paddle.setAttribute('transform', `rotate(${-pose.right + 80 - 66 * progress} 1039 819)`);
      paddle.setAttribute('opacity', String(joined ? Math.min(1, progress * 6) : 0));
      check.style.strokeDasharray = '1';
      check.style.strokeDashoffset = String(1 - (animateArrival && !preference.matches ? ease((elapsed - 420) / 300) : 1));
    }
    if (visible && !document.hidden && !preference.matches && (!joined || manualChange || (animateArrival && elapsed < 950))) {
      frame = requestAnimationFrame(render);
    }
  }
  container.addEventListener('click', () => {
    if (!artworkReady) return;
    const cycle = HOLD_MS + CHANGE_MS;
    if (preference.matches) {
      appearance = looks[(looks.findIndex(look => look.id === appearance) + 1) % looks.length].id;
      container.dataset.nivoAppearance = appearance;
      clock = looks.findIndex(look => look.id === appearance) * cycle;
      direction = 1;
      manualChange = false;
    } else {
      // Reverse from the current frame if tapped again during a change.
      if (clock % cycle > HOLD_MS) direction *= -1;
      else { clock = Math.floor(clock / cycle) * cycle + HOLD_MS; direction = 1; }
      manualChange = true;
    }
    previous = null;
    render(performance.now());
  });
  function update() {
    const next = card.classList.contains('is-joined');
    if (next !== joined) {
      joined = next;
      clock = looks.findIndex(look => look.id === appearance) * (HOLD_MS + CHANGE_MS);
      direction = 1;
      manualChange = false;
      started = performance.now();
      animateArrival = joined && card.classList.contains('is-celebrating');
    }
    previous = null;
    render(performance.now());
  }
  new MutationObserver(update).observe(card, { attributes: true, attributeFilter: ['class'] });
  new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; update(); }).observe(container);
  preference.addEventListener('change', () => {
    clock = looks.findIndex(look => look.id === appearance) * (HOLD_MS + CHANGE_MS);
    direction = 1;
    manualChange = false;
    update();
  });
  document.addEventListener('visibilitychange', update);
  window.addEventListener('pagehide', () => cancelAnimationFrame(frame));
  window.addEventListener('pageshow', update);
  update();
}
