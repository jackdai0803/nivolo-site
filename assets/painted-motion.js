// Positions are measured on a 180 × 390 copy of each portrait. The transparent
// scene uses the painting's cover crop on Home, banners, and website stages.
// Shared entries run in both themes. Each theme completes a set of three subjects.
const scenes = {
  classic: {
    waves: [60, 147, 110],
    day: { birds: [8, 62, 145, 36], snow: [40, 72] },
    night: { lights: [[30, 116, 3]], stars: [109, 45] },
  },
  deepsea: {
    bubbles: [25, 158], waves: [85, 157, 128],
    day: { fish: [150, 105, -70] },
    night: { fish: [135, 116, -68] },
  },
  snowy: {
    snow: [82, 66],
    day: { birds: [15, 66, 89, 47], mist: [22, 140, 34] },
    night: { lights: [[26, 126, 4], [59, 125, 2.5]], stars: [103, 47] },
  },
  blaze: {
    embers: [141, 126],
    day: { lights: [[141, 125, 6]], smoke: [141, 121] },
    night: { lights: [[141, 130, 5]], smoke: [141, 125] },
  },
  rainy: {
    rain: [63, 148], waves: [64, 153, 82],
    day: { drizzle: [42, 83] },
    night: { lights: [[148, 81, 4]] },
  },
  melting: {
    waves: [68, 155, 100],
    day: { petals: [23, 43, '#ec986f'], birds: [59, 62, 132, 46] },
    night: { lights: [[105, 106, 4], [162, 102, 4], [77, 117, 2]], mist: [29, 138, 38] },
  },
  sleepy: {
    day: { motes: [48, 93], lights: [[70, 115, 3]], beam: [54, 53, 19, 52] },
    night: { lights: [[115, 95, 4], [69, 114, 2.5]], moth: [113, 88], stars: [34, 57] },
  },
  focused: {
    day: { motes: [89, 98], lights: [[144, 83, 7]], beam: [64, 43, 22, 63] },
    night: { lights: [[144, 83, 8], [96, 100, 2]], motes: [98, 100], moth: [141, 79] },
  },
  love: {
    day: { petals: [19, 39, '#e58b90'], butterfly: [41, 109], motes: [131, 92] },
    night: { lights: [[30, 59, 7], [171, 102, 3]], petals: [16, 43, '#dd8d9d'], fireflies: [132, 117] },
  },
  sick: {
    steam: [52, 108],
    day: { motes: [68, 81], lights: [[160, 95, 7]] },
    night: { lights: [[160, 97, 8]], moth: [149, 83] },
  },
  party: {
    day: { petals: [29, 45, '#eea486'], butterfly: [121, 107], motes: [54, 85] },
    night: { lights: [[164, 103, 3]], fireflies: [112, 111], petals: [27, 48, '#f3ba97'] },
  },
  starstruck: {
    stars: [51, 26],
    day: { meteor: [101, 40], birds: [22, 95, 73, 82] },
    night: { lights: [[131, 94, 3], [150, 91, 2]], meteor: [91, 45] },
  },
  champion: {
    day: { birds: [37, 76, 128, 53], waves: [77, 121, 61], motes: [49, 83] },
    night: { lights: [[42, 45, 4], [26, 63, 3], [115, 157, 3]], waves: [76, 119, 64], stars: [98, 50] },
  },
  ghost: {
    mist: [39, 126, 48],
    day: { motes: [99, 103], butterfly: [126, 100] },
    night: { fireflies: [73, 118], moth: [127, 85] },
  },
  glitch: {
    mist: [37, 134, 41],
    day: { motes: [113, 105], beam: [133, 52, -18, 67] },
    night: { lights: [[68, 123, 2], [34, 92, 3, '#b7b0ff']], fireflies: [119, 103] },
  },
  porcelain: {
    day: { birds: [41, 62, 111, 37], motes: [43, 92], butterfly: [121, 110] },
    night: { lights: [[108, 101, 2.5], [138, 91, 3]], moth: [136, 83], stars: [85, 47] },
  },
  jade: {
    waves: [67, 158, 98],
    day: { butterfly: [116, 117], mist: [29, 104, 48] },
    night: { lights: [[105, 97, 3], [138, 92, 4], [63, 132, 2]], fireflies: [43, 128] },
  },
  kintsugi: {
    day: { motes: [66, 87], beam: [38, 45, 31, 78], petals: [133, 78, '#f1d3ad'] },
    night: { lights: [[101, 42, 7]], moth: [104, 44], motes: [59, 108] },
  },
  gold: {
    waves: [67, 154, 94],
    day: { beam: [75, 49, -22, 68], bubbles: [150, 138] },
    night: { lights: [[150, 48, 4], [142, 102, 4]], stars: [70, 46] },
  },
  'early-supporter': {
    day: { motes: [71, 90], beam: [69, 42, -22, 71], butterfly: [117, 108] },
    night: { lights: [[146, 100, 4], [58, 122, 3]], moth: [146, 94], fireflies: [57, 113] },
  },
  anubis: {
    day: { birds: [8, 84, 99, 60], motes: [57, 116], beam: [88, 54, -26, 71] },
    night: { lights: [[158, 129, 4], [93, 126, 4]], embers: [158, 125], stars: [82, 60] },
  },
  horus: {
    day: { birds: [67, 63, 164, 41], waves: [120, 109, 47], motes: [64, 128] },
    night: { lights: [[164, 90, 4], [22, 122, 4]], embers: [164, 87], stars: [92, 50] },
  },
  athena: {
    day: { birds: [38, 83, 111, 56], butterfly: [40, 111], motes: [134, 115] },
    night: { lights: [[105, 92, 3], [147, 99, 3]], moth: [147, 95], stars: [76, 47] },
  },
  poseidon: {
    bubbles: [129, 139], waves: [83, 156, 125],
    day: { fish: [145, 121, -67] },
    night: { fish: [143, 127, -65] },
  },
  artemis: {
    waves: [86, 154, 81],
    day: { birds: [34, 87, 117, 69], mist: [35, 123, 48] },
    night: { stars: [66, 63], mist: [39, 123, 48] },
  },
  apollo: {
    day: { birds: [23, 86, 97, 62], petals: [26, 40, '#efd9ae'], butterfly: [59, 112] },
    night: { lights: [[150, 88, 4], [54, 141, 2]], moth: [145, 84], stars: [84, 43] },
  },
  zeus: {
    day: { birds: [36, 96, 158, 70], motes: [52, 120], beam: [78, 64, 24, 56] },
    night: { lights: [[42, 106, 5], [118, 124, 4]], embers: [42, 104], stars: [106, 44] },
  },
  medusa: {
    day: { motes: [73, 104], butterfly: [56, 117], mist: [119, 125, 41] },
    night: { lights: [[158, 123, 4], [47, 125, 3]], fireflies: [61, 109], mist: [91, 134, 48] },
  },
  hades: {
    waves: [91, 153, 112], mist: [61, 129, 55],
    day: { lights: [[129, 94, 3]] },
    night: { lights: [[130, 94, 4], [174, 89, 4]] },
  },
  'plum-blossom': {
    day: { petals: [36, 44, '#d9819a'], snow: [106, 77], birds: [64, 64, 143, 43] },
    night: { lights: [[29, 57, 7], [119, 99, 3]], snow: [101, 73], petals: [48, 58, '#dc91a8'] },
  },
  jasmine: {
    day: { petals: [28, 41, '#fff0bd'], butterfly: [125, 78], beam: [76, 53, -19, 60] },
    night: { lights: [[144, 21, 4], [87, 96, 3]], moth: [86, 87], petals: [26, 39, '#eee5cb'] },
  },
  camellia: {
    day: { petals: [150, 54, '#db7271'], butterfly: [126, 98], motes: [47, 93] },
    night: { lights: [[18, 73, 4]], moth: [22, 64], petals: [148, 50, '#dc8388'] },
  },
  magnolia: {
    day: { petals: [29, 43, '#f8dfdf'], birds: [64, 70, 147, 49], butterfly: [38, 115] },
    night: { lights: [[28, 136, 4]], petals: [30, 47, '#ecdce9'], fireflies: [117, 117] },
  },
  orchid: {
    waves: [76, 154, 84],
    day: { butterfly: [125, 92], mist: [36, 129, 48] },
    night: { lights: [[141, 45, 6]], mist: [44, 128, 46] },
  },
  osmanthus: {
    day: { petals: [42, 37, '#eec166'], butterfly: [49, 99], birds: [72, 65, 135, 53] },
    night: { lights: [[126, 114, 3]], fireflies: [81, 116], petals: [36, 43, '#efbe69'] },
  },
  crabapple: {
    day: { petals: [47, 40, '#ebaaa0'], butterfly: [50, 111], birds: [62, 68, 140, 52] },
    night: { lights: [[29, 74, 5], [79, 31, 3]], petals: [42, 43, '#e8acaf'], moth: [30, 71] },
  },
  peony: {
    day: { petals: [22, 90, '#e99199'], butterfly: [55, 109], motes: [122, 107] },
    night: { lights: [[34, 43, 6], [63, 62, 3]], petals: [18, 89, '#d79aa8'], fireflies: [124, 112] },
  },
  'white-lotus': {
    waves: [76, 150, 103],
    day: { mist: [26, 124, 48], butterfly: [129, 117] },
    night: { lights: [[130, 153, 6], [35, 134, 3]], fireflies: [124, 111] },
  },
  'tree-peony': {
    day: { petals: [146, 58, '#de9385'], butterfly: [126, 101], motes: [41, 108] },
    night: { lights: [[141, 84, 6]], petals: [147, 60, '#e3aa96'], moth: [137, 79] },
  },
  'spider-lily': {
    waves: [81, 152, 97], mist: [39, 127, 60],
    day: { butterfly: [126, 105] },
    night: { fireflies: [135, 109] },
  },
};

const svgNS = 'http://www.w3.org/2000/svg';
let instance = 0;
function element(parent, tag, attributes) {
  const node = document.createElementNS(svgNS, tag);
  for (const [key, value] of Object.entries(attributes)) node.setAttribute(key, value);
  parent.append(node);
  return node;
}

export function mountPaintedMotion(host, look, { night = false, before = null, paused = false, artwork, cropY = '50%' } = {}) {
  const recipe = scenes[look];
  if (!recipe) return;
  const scene = { ...recipe, ...(night ? recipe.night : recipe.day) };
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
  if (scene.lights && artwork) {
    // Extract the lit glass or flame from the same registered portrait. Only
    // the opacity of its fixed highlight changes. The painting is the dim frame.
    const paintId = `${prefix}-lamp-source`;
    element(defs, 'image', { id: paintId, href: artwork, width: 180, height: 390, preserveAspectRatio: 'none' });
    const featherId = `${prefix}-lamp-edge`;
    const feather = element(defs, 'radialGradient', { id: featherId });
    for (const [offset, alpha] of [[0, 1], [.46, .95], [.74, .45], [1, 0]]) {
      element(feather, 'stop', { offset, 'stop-color': 'white', 'stop-opacity': alpha });
    }
    for (const [i, [x, y, radius, cool]] of scene.lights.entries()) {
      const reach = radius * 3;
      const bounds = { x: x - reach, y: y - reach, width: reach * 2, height: reach * 2 };
      const filterId = `${prefix}-lamp-bloom-${i}`;
      const filter = element(defs, 'filter', { id: filterId, filterUnits: 'userSpaceOnUse', 'color-interpolation-filters': 'sRGB', ...bounds });
      // Bright paint supplies the alpha. White light can only lift the
      // underlying pixels, even over a pale Day theme or a softened banner.
      const intensity = cool ? '.35 .9 .5 0 -.75' : '1.1 .65 -.1 0 -.71';
      element(filter, 'feColorMatrix', { type: 'matrix', values: `0 0 0 0 1  0 0 0 0 1  0 0 0 0 1  ${intensity}`, result: 'litPaint' });
      element(filter, 'feGaussianBlur', { in: 'litPaint', stdDeviation: radius * .34, result: 'spill' });
      const merge = element(filter, 'feMerge', {});
      element(merge, 'feMergeNode', { in: 'spill' });
      element(merge, 'feMergeNode', { in: 'litPaint' });
      const maskId = `${prefix}-lamp-mask-${i}`;
      const mask = element(defs, 'mask', { id: maskId, maskUnits: 'userSpaceOnUse', ...bounds });
      element(mask, 'circle', { cx: x, cy: y, r: reach, fill: `url(#${featherId})` });
      const light = element(svg, 'g', { mask: `url(#${maskId})` });
      element(light, 'use', { href: `#${paintId}`, filter: `url(#${filterId})` });
      const peak = night ? .47 : .35;
      loop(light, 'lamplight', [
        { opacity: 0 }, { opacity: peak, offset: .42 }, { opacity: peak * .72, offset: .65 }, { opacity: 0 },
      ], 6200 + i * 1130, .12 + i * .27);
    }
  }

  if (scene.birds) {
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
        { opacity: night ? .65 : .85, transform: 'translate(0,0) scale(1.03,1.16)', offset: .45 },
        { opacity: 0, transform: 'translate(2.5px,1.4px) scale(1.28,.55)' },
      ], 3400 + i * 347, [.12,.63,.37,.82,.49][i]);
    }
  }
  if (scene.rain) {
    const [x, y] = scene.rain;
    for (const [i, dx] of [-39, 6, 43, -10].entries()) {
      const ring = element(placed(x + dx, y + i * 4), 'ellipse', { rx: 5, ry: 1.13, fill: 'none', stroke: night ? '#c0dbf8' : '#e3f4ef', 'stroke-width': .46 });
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
  function softGlow(name, color) {
    const id = `${prefix}-${name}`;
    const gradient = element(defs, 'radialGradient', { id });
    for (const [offset, opacity] of [[0, .88], [.45, .48], [1, 0]]) {
      element(gradient, 'stop', { offset, 'stop-color': color, 'stop-opacity': opacity });
    }
    return `url(#${id})`;
  }

  if (scene.fish) {
    const [x, y, distance] = scene.fish;
    for (const [i, size] of [1, .65, .82].entries()) {
      const swimmer = element(placed(x + i * 6, y + [0, -3, 2][i]), 'g', {});
      const fish = element(swimmer, 'g', { transform: `scale(${distance < 0 ? -size : size} ${size})`, fill: night ? '#74b7cb' : '#307f98' });
      element(fish, 'path', { d: 'M-2.8 0Q-.7 -2.35 2.1 -1.2Q3.45 -.73 3.85 -.13Q2.7 1.25 .15 1.29Q-1.4 1.2 -2.8 0Z' });
      const tail = element(fish, 'path', { d: 'M-2.3 0Q-3.6 -.95 -4.7 -1.45L-4.25 0L-4.7 1.34Q-3.3 .85 -2.3 0Z' });
      tail.style.transformBox = 'fill-box';
      tail.style.transformOrigin = 'right center';
      loop(tail, 'fish', [{ transform: 'scaleX(1)' }, { transform: 'scaleX(.53)' }, { transform: 'scaleX(1)' }], 490 + i * 83, i * .19);
      loop(swimmer, 'fish', [
        { transform: 'translate(0,0)', opacity: 0 },
        { transform: `translate(${distance * .2}px,-2px)`, opacity: .78, offset: .18 },
        { transform: `translate(${distance * .63}px,1px)`, opacity: .78, offset: .56 },
        { transform: `translate(${distance}px,-1px)`, opacity: 0, offset: .9 },
        { transform: `translate(${distance}px,-1px)`, opacity: 0 },
      ], 10300 + i * 237, .2, 'linear');
    }
  }

  if (scene.butterfly || scene.moth) {
    const isMoth = Boolean(scene.moth);
    const kind = isMoth ? 'moth' : 'butterfly';
    const [x, y] = scene[kind];
    const insect = element(placed(x, y), 'g', {});
    const wings = element(insect, 'g', { fill: isMoth ? '#f7dbad' : '#eab36c', stroke: isMoth ? '#917a6b' : '#9b624e', 'stroke-width': .24 });
    for (const sign of [-1, 1]) {
      element(wings, 'path', { transform: `scale(${sign} 1)`, d: 'M0 0Q.7 -2.4 2.45 -2.6Q3.6 -1.4 1.6 -.03Q2.3 1.12 1.3 1.6Q.45 1.65 0 0Z' });
    }
    element(insect, 'path', { d: 'M0 -1.25L.12 1.2', stroke: '#6a5548', 'stroke-width': .35, 'stroke-linecap': 'round' });
    loop(wings, kind, [{ transform: 'scaleX(.32)' }, { transform: 'scaleX(1)' }, { transform: 'scaleX(.32)' }], isMoth ? 290 : 510, .12);
    const reach = x > 90 ? -1 : 1;
    const poses = isMoth ? [[0,0,14],[4,-5,28],[7,-1,8],[2,3,-22],[0,0,14]]
      : [[0,0,-15],[5,-6,10],[13,-4,20],[8,2,-8],[0,0,-15]];
    loop(insect, kind, poses.map(([dx, dy, turn]) => ({
      transform: `translate(${dx * reach}px,${dy}px) rotate(${turn * reach}deg)`, opacity: .86,
    })), isMoth ? 3700 : 5400, .24);
  }

  if (scene.mist) {
    const [x, y, width] = scene.mist;
    const fill = softGlow('mist', night ? '#c0cafa' : '#fff9e6');
    for (const [i, scale] of [1, .64].entries()) {
      const wisp = element(placed(x + i * 14, y - i * 3), 'ellipse', { rx: width / 2 * scale, ry: 3.8 * scale, fill });
      loop(wisp, 'mist', [
        { transform: 'translate(-8px,1px) scaleX(.85)', opacity: 0 },
        { transform: 'translate(0,0) scaleX(1)', opacity: .65 },
        { transform: 'translate(10px,-1px) scaleX(1.1)', opacity: 0 },
      ], 8200 + i * 960, .28 + i * .43);
    }
  }
  if (scene.beam) {
    const [x, y, dx, dy] = scene.beam;
    const shaft = element(svg, 'g', { transform: `translate(${x + dx / 2} ${y + dy / 2}) rotate(${-Math.atan2(dx, dy) * 180 / Math.PI})` });
    const ray = element(shaft, 'ellipse', { rx: 5.6, ry: Math.hypot(dx, dy) / 2, fill: softGlow('sunbeam', '#fff5c7') });
    loop(ray, 'sunbeam', [{ opacity: .14 }, { opacity: .7 }, { opacity: .14 }], 7200, .24);
  }
  if (scene.steam || scene.smoke) {
    const kind = scene.steam ? 'steam' : 'smoke';
    const [x, y] = scene[kind];
    for (const [i, dx] of [-1, 1.7].entries()) {
      const curl = element(placed(x + dx, y), 'path', {
        d: 'M0 0C-3 -3.2 2.7 -4.4 .9 -7.3S-1.6 -11 .7 -13.4C-.4 -10.4 1.8 -9 1.9 -7.2S-1.3 -2.9 0 0Z',
        fill: kind === 'steam' ? '#fffae7' : night ? '#d8c9d1' : '#a29a95',
      });
      loop(curl, kind, [
        { transform: 'translateY(2px) scale(.5,.5)', opacity: 0 },
        { transform: 'translateY(-1px) scale(.98,1.07)', opacity: .84, offset: .4 },
        { transform: 'translate(3px,-5px) scale(1.4,1.35)', opacity: 0 },
      ], 3200 + i * 620, .31 + i * .48);
    }
  }
  if (scene.drizzle) {
    const [x, y] = scene.drizzle;
    for (const [i, dx] of [-29,-13,8,23,47,66,89,111].entries()) {
      const drop = element(placed(x + dx, y + (i % 3) * 12), 'path', { d: 'M0 0l-1.25 4.7', stroke: '#d8edeb', 'stroke-width': .65, 'stroke-linecap': 'round' });
      loop(drop, 'drizzle', [
        { transform: 'translate(0,0)', opacity: 0 }, { transform: 'translate(-2px,7px)', opacity: .82, offset: .25 },
        { transform: 'translate(-6px,22px)', opacity: 0 },
      ], 1000 + i * 47, (i * .37) % 1, 'linear');
    }
  }
  if (scene.meteor) {
    const [x, y] = scene.meteor;
    const streak = element(placed(x, y), 'path', { d: 'M0 0Q-4 -1.4 -10 -6Q-4 -2.9 .6 -.65Q1.6 .3 0 0Z', fill: '#fff4cf' });
    loop(streak, 'meteor', [
      { transform: 'translate(0,0)', opacity: 0 }, { transform: 'translate(5px,3px)', opacity: .88, offset: .07 },
      { transform: 'translate(32px,19px)', opacity: 0, offset: .24 }, { transform: 'translate(32px,19px)', opacity: 0 },
    ], 9600, .02, 'linear');
  }

  // Small airborne details start at the flower, fire, or pocket of water
  // that produces them. Their travel is in the painting's own coordinates.
  const air = [
    ['petals', scene.petals, 4, 26, 20, 6200],
    ['snow', scene.snow, 8, -16, 27, 5400],
    ['embers', scene.embers, 4, 4, -14, 3300],
    ['bubbles', scene.bubbles, 5, 2, -24, 4900],
    ['motes', scene.motes, 4, 7, -5, 6100],
    ['fireflies', scene.fireflies, 4, 6, -3, 4900],
  ];
  for (const [kind, origin, count, dx, dy, duration] of air) {
    if (!origin) continue;
    const [x,y,tint] = origin;
    for (let i=0; i<count; i++) {
      const spread = kind === 'snow' ? 22 : kind === 'embers' ? 1.7 : 6;
      // A small increase in silhouette keeps the finest marks legible at phone size.
      const size = (.75 + i % 3 * .18) * (kind === 'embers' ? 1 : 1.12);
      const parent = placed(x + (i - (count-1)/2) * spread, y + i%3*2, size);
      const mark = kind === 'petals'
        ? element(parent, 'path', { d:'M-1.6 -.7Q-.5 -1.5 .2 -.65Q1.5 -1.25 1.35 -.22Q1.1 1.15 -.5 1Q-1.5 .6 -1.6 -.7Z', fill:tint })
        : element(parent, 'circle', { r: kind === 'bubbles' ? 1.15 : .66, fill: kind === 'bubbles' ? '#c1ffff22' : kind === 'embers' ? '#ffac58' : kind === 'fireflies' ? '#ffe78a' : '#fff9de',
          stroke: kind === 'bubbles' ? '#b4efff' : 'none', 'stroke-width': .36 });
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
