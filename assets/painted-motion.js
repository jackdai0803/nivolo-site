// Positions are measured on a 180 × 390 copy of each portrait. The transparent
// scene uses the painting's cover crop on Home, banners, and website stages.
const scenes = {
  classic: { birds: [8, 62, 145, 36], waves: [60, 147, 110], lights: [[30, 116, 3]] },
  deepsea: { bubbles: [25, 158], waves: [85, 157, 128] },
  snowy: { snow: [82, 66], lights: [[26, 126, 4], [59, 125, 2.5]] },
  blaze: { embers: [141, 126], dayLights: [[141, 125, 6]], lights: [[141, 130, 5]] },
  rainy: { rain: [63, 148], waves: [64, 153, 82], lights: [[148, 81, 4]] },
  melting: { waves: [68, 155, 100], lights: [[105, 106, 4], [162, 102, 4], [77, 117, 2]] },
  sleepy: { motes: [48, 93], dayLights: [[70, 115, 3]], lights: [[115, 95, 4], [69, 114, 2.5]] },
  focused: { motes: [89, 98], dayLights: [[144, 83, 7]], lights: [[144, 83, 8], [96, 100, 2]] },
  love: { petals: [19, 39, '#e58b90'], lights: [[30, 59, 7], [171, 102, 3]] },
  sick: { motes: [68, 81], dayLights: [[160, 95, 7]], lights: [[160, 97, 8]] },
  party: { petals: [29, 45, '#eea486'], lights: [[164, 103, 3]], fireflies: [112, 111] },
  starstruck: { stars: [51, 26], lights: [[131, 94, 3], [150, 91, 2]] },
  champion: { birds: [37, 76, 128, 53], lights: [[42, 45, 4], [26, 63, 3], [115, 157, 3]] },
  ghost: { motes: [99, 103], fireflies: [73, 118] },
  glitch: { motes: [113, 105], lights: [[68, 123, 2], [34, 92, 3, '#b7b0ff']] },
  porcelain: { birds: [41, 62, 111, 37], lights: [[108, 101, 2.5], [138, 91, 3]] },
  jade: { waves: [67, 158, 98], lights: [[105, 97, 3], [138, 92, 4], [63, 132, 2]] },
  kintsugi: { motes: [66, 87], lights: [[101, 42, 7]] },
  gold: { waves: [67, 154, 94], lights: [[150, 48, 4], [142, 102, 4]] },
  'early-supporter': { motes: [71, 90], lights: [[146, 100, 4], [58, 122, 3]] },
  anubis: { birds: [8, 84, 99, 60], lights: [[158, 129, 4], [93, 126, 4]] },
  horus: { birds: [67, 63, 164, 41], lights: [[164, 90, 4], [22, 122, 4]] },
  athena: { birds: [38, 83, 111, 56], lights: [[105, 92, 3], [147, 99, 3]] },
  poseidon: { bubbles: [129, 139], waves: [83, 156, 125] },
  artemis: { birds: [34, 87, 117, 69], waves: [86, 154, 81] },
  apollo: { birds: [23, 86, 97, 62], lights: [[150, 88, 4], [54, 141, 2]] },
  zeus: { birds: [36, 96, 158, 70], lights: [[42, 106, 5], [118, 124, 4]] },
  medusa: { motes: [73, 104], lights: [[158, 123, 4], [47, 125, 3]] },
  hades: { waves: [91, 153, 112], dayLights: [[129, 94, 3]], lights: [[130, 94, 4], [174, 89, 4]] },
  'plum-blossom': { petals: [36, 44, '#d9819a'], lights: [[29, 57, 7], [119, 99, 3]] },
  jasmine: { petals: [28, 41, '#fff0bd'], lights: [[144, 21, 4], [87, 96, 3]] },
  camellia: { petals: [150, 54, '#db7271'], lights: [[18, 73, 4]] },
  magnolia: { petals: [29, 43, '#f8dfdf'], lights: [[28, 136, 4]] },
  orchid: { waves: [76, 154, 84], lights: [[141, 45, 6]] },
  osmanthus: { petals: [42, 37, '#eec166'], lights: [[126, 114, 3]], fireflies: [81, 116] },
  crabapple: { petals: [47, 40, '#ebaaa0'], lights: [[29, 74, 5], [79, 31, 3]] },
  peony: { petals: [22, 90, '#e99199'], lights: [[34, 43, 6], [63, 62, 3]] },
  'white-lotus': { waves: [76, 150, 103], lights: [[130, 153, 6], [35, 134, 3]] },
  'tree-peony': { petals: [146, 58, '#de9385'], lights: [[141, 84, 6]] },
  'spider-lily': { waves: [81, 152, 97], fireflies: [135, 109] },
};

const svgNS = 'http://www.w3.org/2000/svg';
let instance = 0;
function element(parent, tag, attributes) {
  const node = document.createElementNS(svgNS, tag);
  for (const [key, value] of Object.entries(attributes)) node.setAttribute(key, value);
  parent.append(node);
  return node;
}

export function mountPaintedMotion(host, look, { night = false, before = null, paused = false, cropY = '50%' } = {}) {
  const scene = scenes[look];
  if (!scene) return;
  const layer = document.createElement('div');
  layer.dataset.paintedMotion = look;
  layer.setAttribute('aria-hidden', 'true');
  Object.assign(layer.style, { position: 'absolute', inset: '0', containerType: 'size', overflow: 'hidden', pointerEvents: 'none' });
  host.insertBefore(layer, before);
  const svg = element(layer, 'svg', { viewBox: '0 0 180 390', focusable: 'false' });
  Object.assign(svg.style, { position: 'absolute', left: '50%', top: cropY, translate: `-50% calc(-1 * ${cropY})`,
    width: 'max(100cqw, 46.1538cqh)', height: 'auto', aspectRatio: '180 / 390', maxWidth: 'none' });
  const defs = element(svg, 'defs', {});
  const prefix = 'painted-air-' + ++instance;
  const animations = [];
  function loop(node, kind, frames, duration, phase, easing = 'ease-in-out') {
    node.dataset.paintedDetail = kind;
    const animation = node.animate(frames, { duration, delay: -duration * phase, iterations: Infinity, easing });
    animation.pause();
    animations.push(animation);
  }
  function placed(x, y, scale = 1) {
    return element(svg, 'g', { transform: `translate(${x} ${y}) scale(${scale})` });
  }
  // Only the light changes intensity. The soft dark center lets a painted
  // lamp dim as the halo fades, while its housing and surroundings stay sharp.
  for (const [i, [x, y, radius, hue = '#ffc875']] of (night ? scene.lights || [] : scene.dayLights || []).entries()) {
    const lamp = placed(x, y, radius);
    for (const [bright, color] of [[false, '#46354a'], [true, hue]]) {
      const id = `${prefix}-${i}-${Number(bright)}`;
      const gradient = element(defs, 'radialGradient', { id });
      for (const [offset, alpha] of [[0, bright ? .95 : .85], [.22, .68], [.5, bright ? .25 : .36], [1, 0]]) {
        element(gradient, 'stop', { offset, 'stop-color': color, 'stop-opacity': alpha });
      }
      const glow = element(lamp, 'ellipse', { rx: bright ? 2.8 : 1.35, ry: bright ? 2.5 : 1.45, fill: `url(#${id})` });
      const levels = bright ? [.82, 1, .77, .04, .03, .68, .82] : [.04, 0, .08, .82, .84, .12, .04];
      loop(glow, 'lamplight', levels.map((opacity, n) => ({ opacity, offset: [0, .14, .31, .52, .65, .85, 1][n] })),
        6200 + i * 1130, .12 + i * .27);
    }
  }

  if (scene.birds && !night) {
    const [x, y, endX, endY] = scene.birds;
    for (const [i, size] of [1, .72, .54].entries()) {
      const bird = element(placed(x - i * 4, y + i * 2.4), 'g', {});
      const wings = element(bird, 'path', {
        d: 'M-3.8 -1.6 Q-2.3 -1.6 -.2 -.25 Q1.2 -2.4 3.4 -2.5 Q1.6 -1.55 .24 .45 Q-.15 .78 -.63 .32 Q-2 -1 -3.8 -1.6Z',
        fill: '#425668', transform: `scale(${size})`,
      });
      wings.style.transformBox = 'fill-box';
      wings.style.transformOrigin = '50% 87%';
      loop(wings, 'wingbeat', [1, .24, .97, .97, 1].map(v => ({ transform: `scale(${size}, ${size * v})` })), 730 + i * 97, .2 + i * .26);
      const dx = endX - x, dy = endY - y;
      loop(bird, 'flight', [
        { transform: 'translate(0,0)', opacity: 0 },
        { transform: `translate(${dx*.12}px,${dy*.12-1}px)`, opacity: .75, offset: .09 },
        { transform: `translate(${dx*.6}px,${dy*.6+1.2}px)`, opacity: .72, offset: .45 },
        { transform: `translate(${dx}px,${dy}px)`, opacity: 0, offset: .76 },
        { transform: `translate(${dx}px,${dy}px)`, opacity: 0 },
      ], 12500, .23, 'linear');
    }
  }
  if (scene.waves) {
    const [x, y, width] = scene.waves;
    for (const [i, across] of [-.31, .19, -.06, .32, -.24].entries()) {
      const crest = element(placed(x + width * across, y + [0, 3, 8, 13, 19][i]), 'path', {
        d: 'M-8 .2 Q-5 -.7 -2 -.24 T2 -.15 Q4 .1 6 -.35 L7 -.35 Q5.5 .45 3 .48 Q.6 .27 -1 .35 T-6 .52Z M8.2 -.32l2.4 -.24 -1.5 .47Z',
        fill: night ? '#d7e8ff' : '#fffcdf',
      });
      loop(crest, 'wave', [
        { opacity: 0, transform: 'translate(-2px,-.8px) scale(.45,.55)' },
        { opacity: night ? .65 : .85, transform: 'translate(0,0) scale(1,1)', offset: .45 },
        { opacity: 0, transform: 'translate(2.5px,1.4px) scale(1.28,.55)' },
      ], 3400 + i * 347, [.12,.63,.37,.82,.49][i]);
    }
  }
  if (scene.rain) {
    const [x, y] = scene.rain;
    for (const [i, dx] of [-39, 6, 43, -10].entries()) {
      const ring = element(placed(x + dx, y + i * 4), 'ellipse', { rx: 4.7, ry: 1.05, fill: 'none', stroke: night ? '#c0dbf8' : '#e3f4ef', 'stroke-width': .38 });
      loop(ring, 'raindrop', [{ transform: 'scale(.1)', opacity: 0 }, { transform: 'scale(.4)', opacity: .85, offset: .12 },
        { transform: 'scale(1.6)', opacity: 0, offset: .77 }, { opacity: 0 }], 2400 + i * 280, [.32,.81,.1,.62][i]);
    }
  }
  if (scene.stars) {
    const [x,y] = scene.stars;
    for (const [i,[dx,dy]] of [[0,0],[16,-13],[-20,11]].entries()) {
      const star = element(placed(x+dx,y+dy), 'path', { d:'M0 -2Q.2 -.22 1.65 0Q.22 .16 0 2Q-.2 .25 -1.65 0Q-.2 -.2 0 -2Z', fill:'#fff1bc' });
      loop(star, 'starlight', [{ opacity:.05 },{ opacity:.9 },{ opacity:.05 }], 4500+i*870, .2+i*.22);
    }
  }
  // Small airborne details start at the flower, fire, or pocket of water
  // that produces them. Their travel is in the painting's own coordinates.
  const air = [
    ['petals', !night && scene.petals, 4, 26, 20, 6200],
    ['snow', scene.snow, 8, -16, 27, 5400],
    ['embers', scene.embers, 4, 4, -14, 3300],
    ['bubbles', scene.bubbles, 5, 2, -24, 4900],
    ['motes', !night && scene.motes, 4, 7, -5, 6100],
    ['fireflies', night && scene.fireflies, 4, 6, -3, 4900],
  ];
  for (const [kind, origin, count, dx, dy, duration] of air) {
    if (!origin) continue;
    const [x,y,tint] = origin;
    for (let i=0; i<count; i++) {
      const spread = kind === 'snow' ? 22 : kind === 'embers' ? 1.7 : 6;
      const parent = placed(x + (i - (count-1)/2) * spread, y + i%3*2, .75 + i%3*.18);
      const mark = kind === 'petals'
        ? element(parent, 'path', { d:'M-1.6 -.7Q-.5 -1.5 .2 -.65Q1.5 -1.25 1.35 -.22Q1.1 1.15 -.5 1Q-1.5 .6 -1.6 -.7Z', fill:tint })
        : element(parent, 'circle', { r: kind === 'bubbles' ? 1.15 : .66, fill: kind === 'bubbles' ? '#c1ffff22' : kind === 'embers' ? '#ffac58' : kind === 'fireflies' ? '#ffe78a' : '#fff9de',
          stroke: kind === 'bubbles' ? '#b4efff' : 'none', 'stroke-width': .31 });
      loop(mark, kind, [
        { transform:'translate(0,0) rotate(0deg)', opacity:0 },
        { transform:`translate(${dx*.35+1.5}px,${dy*.35}px) rotate(18deg)`, opacity:.87, offset:.35 },
        { transform:`translate(${dx*.7-1}px,${dy*.7}px) rotate(-20deg)`, opacity:.61, offset:.7 },
        { transform:`translate(${dx}px,${dy}px) rotate(42deg)`, opacity:0 },
      ], duration + i*313, (.16+i*.23)%1);
    }
  }

  const motion = matchMedia('(prefers-reduced-motion: reduce)');
  let visible = false;
  const update = () => {
    const playing = visible && !paused && !document.hidden && !motion.matches;
    layer.style.display = motion.matches ? 'none' : '';
    for (const animation of animations) {
      if (playing && animation.playState === 'paused') animation.play();
      if (!playing && animation.playState !== 'paused') animation.pause();
    }
  };
  const observer = new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; update(); });
  observer.observe(host);
  motion.addEventListener('change', update);
  document.addEventListener('visibilitychange', update);
  update();
  return {
    setPaused(value) { paused = value; update(); },
    destroy() {
      observer.disconnect();
      motion.removeEventListener('change', update);
      document.removeEventListener('visibilitychange', update);
      animations.forEach(animation => animation.cancel());
      layer.remove();
    },
  };
}
