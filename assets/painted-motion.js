// Shared by the app and nivolo.app. Travel is in pixels and anchors are percentages.
const scenes = {
  //                     day / night ink                travel     anchor    size  seconds
  classic:        ['snow',    '#FCFFFF', '#BDE7FF',    15,  46,   18, 19,    7, 12],
  deepsea:        ['ring',    '#D9FCFF', '#67E9FC',    10, -55,   19, 73,   10, 10],
  snowy:          ['snow',    '#F5FCFF', '#D9EDFF',    44,  19,   12, 24,   11,  8],
  blaze:          ['ember',   '#FBD06F', '#FF985E',   -11, -44,   78, 67,    7,  8],
  rainy:          ['drop',    '#D3F2FF', '#91C9F9',   -15,  68,   21, 18,   14,  6],
  melting:        ['drop',    '#FFF1D3', '#FFD4A6',     2,  28,   83, 38,   10, 10],
  sleepy:         ['crescent','#FFF1CD', '#E7D4FF',    -9, -20,   79, 25,   13, 14],
  focused:        ['page',    '#FCF0D3', '#FFE4B3',    36,  12,   19, 46,   13, 14],
  love:           ['heart',   '#E75E8D', '#FF9CCB',    12, -35,   23, 54,   13, 11],
  sick:           ['mist',    '#F4F0DB', '#D9EAB8',     3, -30,   75, 66,   24, 13],
  party:          ['ribbon',  '#E26C99', '#FBB4EA',   -30,  36,   81, 17,   11,  8],
  starstruck:     ['star',    '#FFF4BA', '#BAEAFF',     5,   1,   18, 26,   16, 10],
  champion:       ['star',    '#FFE294', '#FFDC86',     7, -23,   82, 30,   12, 11],
  ghost:          ['mist',    '#EDE7FF', '#B5BCFF',    33, -10,   12, 65,   41, 16],
  glitch:         ['pixel',   '#54E2E8', '#FF5CDA',    20,  -3,   13, 36,    9,  7],
  porcelain:      ['petal',   '#78B3EB', '#B4D7FF',    24, -17,   17, 56,   11, 15],
  jade:           ['leaf',    '#BBD48A', '#8AE6B5',   -22,  20,   83, 22,   13, 12],
  kintsugi:       ['seam',    '#FFD673', '#FFC974',    20,  -9,   19, 43,   17, 12],
  gold:           ['star',    '#EDD877', '#FFF1A3',   -10,  10,   85, 52,   16, 13],
  'early-supporter': ['comet','#FFCC67', '#FFE4A4',   -32,  15,   80, 24,   22, 15],
  anubis:         ['ember',   '#FFDA9B', '#F4C37F',    31,  -6,   19, 67,    5, 11],
  horus:          ['feather', '#F2DCAB', '#B4DFF8',    24,  25,   20, 31,   17, 13],
  athena:         ['leaf',    '#A0B96C', '#CBEA9D',   -15,  33,   80, 35,   10, 15],
  poseidon:       ['ripple',  '#DDFCFD', '#7FDEF2',    -8,  -4,   76, 65,   48, 13],
  artemis:        ['comet',   '#E9F8D6', '#C1E0FF',    29, -12,   18, 25,   19, 11],
  apollo:         ['ray',     '#FFE39A', '#FFD18D',    15,  13,   77, 26,   39, 14],
  zeus:           ['bolt',    '#FFEDB9', '#D8E6FF',    -4,   8,   85, 22,   16, 15],
  medusa:         ['mist',    '#BDD988', '#9EE9BA',   -29,  10,   85, 62,   27, 14],
  hades:          ['ember',   '#C28EED', '#DD9DFD',     5, -50,   17, 69,    9, 11],
  'plum-blossom': ['petal',   '#E38CA7', '#FFB8D6',    18,  42,   19, 25,    9, 14],
  jasmine:       ['flower',   '#FFFDF0', '#E7F6BE',    20, -28,   15, 46,    8, 11],
  camellia:      ['petal',    '#DC6D79', '#F6A1A5',   -15,  30,   83, 31,   15, 12],
  magnolia:      ['feather',  '#FFF8DF', '#F2E5FF',    13,  38,   16, 35,   15, 16],
  orchid:        ['drop',     '#D4CEFF', '#CAB2FA',   -19,  39,   82, 28,    9, 12],
  osmanthus:     ['flower',   '#EDB449', '#FFD688',    17,  28,   18, 26,    7, 10],
  crabapple:     ['petal',    '#F0978F', '#F5AC9E',     9,  29,   81, 26,   10, 13],
  peony:         ['petal',    '#E785A3', '#FBC2D7',    24, -16,   17, 58,   14, 15],
  'white-lotus': ['ripple',   '#F6FFE4', '#CBECFF',      0,  -3,   18, 66,   38, 16],
  'tree-peony':  ['petal',    '#CD689B', '#F495CC',   -26,  34,   84, 39,   14, 14],
  'spider-lily': ['ember',    '#F69083', '#FF9D83',    16, -24,   20, 66,    6, 13],
};

const shapes = {
  snow: { clipPath: 'polygon(45% 0,55% 0,55% 40%,89% 19%,95% 28%,61% 50%,95% 72%,89% 81%,55% 60%,55% 100%,45% 100%,45% 60%,11% 81%,5% 72%,39% 50%,5% 28%,11% 19%,45% 40%)' },
  ring: { background: 'none', border: '1px solid', borderRadius: '50%', boxShadow: 'inset 0 1px 3px currentColor' },
  ripple: { aspectRatio: '4 / 1', background: 'none', border: '1px solid', borderRadius: '50%' },
  ember: { borderRadius: '75% 25% 65% 35%', background: 'radial-gradient(ellipse at 35% 63%, #FFF1C8, currentColor 51%, transparent 75%)' },
  drop: { aspectRatio: '1 / 3.6', clipPath: 'polygon(48% 0,52% 0,69% 86%,58% 100%,42% 100%,31% 86%)', background: 'linear-gradient(transparent, currentColor)' },
  crescent: { background: 'none', borderRadius: '50%', boxShadow: 'inset -3px -2px currentColor' },
  page: { aspectRatio: '1.1 / 1', borderRadius: '20% 2% 30% 5%', background: 'linear-gradient(135deg, transparent, currentColor 45%, #fff8 52%, currentColor 60%)' },
  heart: { clipPath: 'polygon(50% 94%, 10% 59%, 1% 42%, 3% 22%, 15% 9%, 32% 8%, 50% 25%, 68% 8%, 85% 9%, 97% 22%, 99% 42%, 90% 59%)' },
  mist: { aspectRatio: '4 / 1', borderRadius: '50%', background: 'radial-gradient(ellipse, currentColor, transparent 70%)' },
  ribbon: { aspectRatio: '1 / 2.2', background: 'linear-gradient(140deg, currentColor 20%, #ffdf8e 54%, currentColor 73%)', clipPath: 'polygon(6% 0,100% 16%,49% 53%,90% 87%,12% 100%,28% 60%,0 38%)' },
  star: { clipPath: 'polygon(50% 0,60% 39%,100% 50%,60% 61%,50% 100%,40% 61%,0 50%,40% 39%)' },
  pixel: { clipPath: 'polygon(0 0,100% 0,100% 32%,58% 32%,58% 66%,86% 66%,86% 100%,0 100%,0 66%,36% 66%,36% 32%,0 32%)' },
  petal: { aspectRatio: '1.2 / 1', borderRadius: '75% 40% 75% 30%', background: 'linear-gradient(145deg, #fff9, currentColor)' },
  leaf: { aspectRatio: '1.5 / 1', borderRadius: '0 80% 0 80%', background: 'linear-gradient(35deg, currentColor 46%, #fff8 50%, currentColor 55%)' },
  seam: { clipPath: 'polygon(0 36%,37% 62%,61% 31%,100% 49%,100% 59%,63% 42%,38% 74%,0 48%)' },
  comet: { aspectRatio: '3.3 / 1', borderRadius: '50%', background: 'linear-gradient(90deg, transparent, currentColor 80%, #FFF5DB)' },
  feather: { aspectRatio: '1.7 / 1', background: 'linear-gradient(35deg, currentColor 43%, #fff8 48%, currentColor 53%)', borderRadius: '90% 12% 82% 10%' },
  ray: { aspectRatio: '4 / 1', background: 'radial-gradient(ellipse, currentColor, transparent 72%)' },
  bolt: { clipPath: 'polygon(62% 0,14% 57%,47% 53%,30% 100%,88% 40%,55% 43%)' },
  flower: { clipPath: 'polygon(50% 20%,72% 0,92% 17%,82% 45%,100% 72%,75% 92%,52% 76%,27% 100%,4% 80%,17% 51%,0 23%,24% 4%)' },
};

// Each rectangle follows a feature in the original portrait painting (x, y, width,
// height in percent). The crop can change from a tall Home to a wide Profile cover.
const paintedDetails = {
  anubis: ['leaves', 0, 0, 46, 19], apollo: ['leaves', 0, 0, 45, 25],
  artemis: ['water', 9, 30, 83, 30], athena: ['leaves', 0, 0, 60, 23],
  blaze: ['fire', 62, 24, 38, 18], camellia: ['leaves', 65, 0, 35, 29],
  champion: ['leaves', 0, 0, 47, 20], classic: ['cloud', 6, 2, 72, 18],
  crabapple: ['leaves', 0, 0, 66, 22], deepsea: ['water', 3, 28, 94, 36],
  'early-supporter': ['leaves', 0, 0, 41, 32], focused: ['light', 70, 24, 30, 20],
  ghost: ['mist', 17, 26, 71, 25], glitch: ['water', 2, 31, 94, 30],
  gold: ['light', 51, 12, 47, 28], hades: ['water', 12, 28, 76, 33],
  horus: ['leaves', 0, 0, 54, 18], jade: ['leaves', 0, 0, 52, 27],
  jasmine: ['leaves', 0, 0, 51, 20], kintsugi: ['light', 39, 17, 59, 27],
  love: ['leaves', 0, 0, 61, 20], magnolia: ['leaves', 0, 0, 62, 23],
  medusa: ['leaves', 0, 0, 54, 23], melting: ['water', 12, 31, 81, 30],
  orchid: ['water', 8, 31, 83, 30], osmanthus: ['leaves', 0, 0, 61, 24],
  party: ['leaves', 0, 0, 54, 24], peony: ['leaves', 0, 11, 37, 28],
  'plum-blossom': ['leaves', 0, 0, 74, 29], porcelain: ['leaves', 54, 0, 46, 17],
  poseidon: ['water', 4, 31, 90, 35], rainy: ['water', 8, 30, 83, 30],
  sick: ['light', 63, 19, 37, 27], sleepy: ['light', 63, 20, 34, 22],
  snowy: ['cloud', 4, 2, 78, 18], 'spider-lily': ['water', 10, 30, 80, 28],
  starstruck: ['cloud', 1, 7, 76, 20], 'tree-peony': ['leaves', 53, 0, 47, 27],
  'white-lotus': ['water', 4, 31, 92, 32], zeus: ['cloud', 33, 5, 66, 23],
};

function animatePainting(layer, [kind, x, y, width, height], artwork, cropY, night) {
  const frame = document.createElement('div');
  // Reproduce object-fit: cover in source coordinates. Keeping the mask on
  // the small detail avoids allocating a second full-screen painted texture.
  Object.assign(frame.style, {
    position: 'absolute', left: '50%', top: cropY, translate: `-50% calc(-1 * ${cropY})`,
    width: 'max(100cqw, 46.1538cqh)', aspectRatio: '852 / 1846',
  });
  layer.prepend(frame);
  const detail = document.createElement('div');
  detail.dataset.paintedDetail = kind;
  Object.assign(detail.style, {
    position: 'absolute', left: `${x}%`, top: `${y}%`, width: `${width}%`, height: `${height}%`,
    backgroundImage: `url("${artwork}")`,
    backgroundSize: `${10000 / width}% ${10000 / height}%`,
    backgroundPosition: `${100 * x / (100 - width)}% ${100 * y / (100 - height)}%`,
    maskImage: 'radial-gradient(ellipse closest-side, black 46%, transparent 100%)',
  });
  frame.append(detail);
  // Move foliage about its stem, stretch ripples across the water, and vary
  // the luminosity of a lamp or fire without shifting the painted fixture.
  const light = kind === 'light' || kind === 'fire';
  const poses = {
    leaves: ['rotate(-1.6deg) skewX(-1.2deg)', 'rotate(2deg) skewX(1.5deg)'],
    water: ['scaleX(.96) skewY(-.8deg) translateY(-1%)', 'scaleX(1.04) skewY(.9deg) translateY(1%)'],
    cloud: ['translateX(-3.4%)', 'translateX(3.4%)'],
    mist: ['translate(-3%, 1%) scale(.97)', 'translate(3%, -1%) scale(1.04)'],
  };
  detail.style.transformOrigin = kind === 'leaves' ? (x === 0 ? '8% 18%' : '93% 18%') : 'center';
  if (light) {
    detail.style.backgroundImage = `radial-gradient(ellipse, ${night ? '#ffce79aa' : '#ffdf95b0'}, transparent 70%)`;
    detail.style.backgroundSize = '100% 100%';
  }
  const frames = light ? [{ opacity: .12 }, { opacity: .85 }, { opacity: .44 }, { opacity: 1 }]
    : poses[kind].map(transform => ({ transform }));
  const duration = { fire: 1700, water: 3400, leaves: 3000, mist: 5800, cloud: 6800, light: 3300 }[kind];
  return detail.animate(frames, { duration, direction: 'alternate', iterations: Infinity, easing: 'ease-in-out' });
}

export function mountPaintedMotion(host, look, { night = false, before = null, paused = false, artwork, cropY = '50%' } = {}) {
  const scene = scenes[look];
  if (!scene) return;
  const [shape, dayInk, nightInk, dx, dy, x, y, size, seconds] = scene;
  const layer = document.createElement('div');
  layer.dataset.paintedMotion = look;
  layer.setAttribute('aria-hidden', 'true');
  Object.assign(layer.style, { position: 'absolute', inset: '0', containerType: 'size', overflow: 'hidden', pointerEvents: 'none', color: night ? nightInk : dayInk });
  host.insertBefore(layer, before);

  const motion = matchMedia('(prefers-reduced-motion: reduce)');
  const shimmer = ['star', 'pixel', 'seam', 'ray', 'bolt'].includes(shape);
  const turn = ['snow', 'petal', 'leaf', 'feather', 'ribbon', 'page', 'heart', 'flower'].includes(shape);
  const count = shape === 'bolt' || look === 'early-supporter' ? 1 : shimmer ? 3 : 5;
  const animations = Array.from({ length: count }, (_, index) => {
    const mark = document.createElement('span');
    Object.assign(mark.style, {
      position: 'absolute', left: `${[x, 100 - x, x + (x < 50 ? 10 : -10), 38, 64][index]}%`,
      top: `${[y, 16 + y * .47, 52 + y * .25, 7 + y * .3, 39 + y * .3][index]}%`,
      width: `${size * [1, .76, .58, .65, .51][index]}px`, aspectRatio: '1', background: 'currentColor', opacity: '0',
      ...shapes[shape],
    });
    layer.append(mark);
    const angle = turn ? (index % 2 ? -1 : 1) * 38 : 0;
    const peak = shape === 'bolt' ? .37 : night ? .72 : .61;
    const pose = (distance, scale) => `translate(${dx * distance * 1.35}px, ${dy * distance * 1.35}px) rotate(${angle * distance}deg) scale(${scale})`;
    const duration = (seconds * .65 + index * .43) * 1000;
    const animation = mark.animate([
      { opacity: 0, transform: pose(0, .6) },
      { opacity: peak, transform: pose(.4, 1), offset: shimmer ? .41 : .38 },
      { opacity: shimmer ? .12 : peak * .62, transform: pose(.73, shape === 'ripple' ? 1.45 : .9), offset: .68 },
      { opacity: 0, transform: pose(1, shape === 'ripple' ? 1.9 : .7) },
    ], { duration, delay: -duration * [.25, .54, .81, .12, .66][index], iterations: Infinity, easing: 'ease-in-out' });
    animation.pause();
    return animation;
  });
  if (artwork) {
    const details = [paintedDetails[look]];
    if (look === 'classic') details.push(['water', 4, 32, 92, 19]);
    for (const region of details) {
      const animation = animatePainting(layer, region, artwork, cropY, night);
      animation.pause();
      animations.push(animation);
    }
  }
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
