import { deepseaIdle } from './deepsea-idle-data.js?v=1';

// The stills are captured from the approved rig, including its full glow.
// Keep event reactions live; idle motion and blinking reuse the captured art.
const artwork = new URL(`./deepsea-idle.webp?v=${deepseaIdle.version}`, import.meta.url).href;
let decoded;
let serial = 0;
function ready() {
  return decoded ||= (() => {
    const image = new Image(); image.src = artwork;
    return image.decode().then(() => true, () => false);
  })();
}
export function withLightweightIdle(rig, host, appearance) {
  if (appearance !== 'deepsea') return rig;
  const svg = host.querySelector('svg');
  const { x, y, width, height } = svg.viewBox.baseVal;
  // An HTML layer can move the cached pixels without painting the SVG.
  const layer = document.createElement('span');
  Object.assign(layer.style, { display: 'block', width: '100%', height: '100%', willChange: 'transform',
    transformOrigin: `${(635 - x) / width * 100}% ${(650 - y) / height * 100}%` });
  svg.before(layer);
  layer.append(svg);
  Object.assign(svg.style, { display: 'block', width: '100%', height: '100%', overflow: 'visible' });
  // An SVG viewport keeps each square frame fitted inside wide scene cards,
  // exactly like the original rig's preserveAspectRatio behavior.
  const still = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  still.setAttribute('viewBox', '0 0 1 1');
  still.setAttribute('role', 'img');
  still.setAttribute('aria-label', svg.getAttribute('aria-label') || 'Nivo');
  Object.assign(still.style, { display: 'none', width: '100%', height: '100%', overflow: 'hidden' });
  const image = document.createElementNS('http://www.w3.org/2000/svg', 'image');
  const clip = document.createElementNS('http://www.w3.org/2000/svg', 'clipPath');
  clip.id = `deepsea-idle-frame-${++serial}`;
  const bounds = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
  bounds.setAttribute('width', '1'); bounds.setAttribute('height', '1');
  clip.append(bounds);
  still.append(clip);
  image.setAttribute('href', artwork);
  image.setAttribute('width', String(deepseaIdle.frames));
  image.setAttribute('height', '1');
  image.setAttribute('clip-path', `url(#${clip.id})`);
  still.append(image);
  layer.append(still);
  let loaded = false, previousFrame;
  ready().then(success => { loaded = success; });
  return {
    render(pose) {
      if (!loaded || pose.skinReacting || pose.sparkle || pose.peek || pose.happy) {
        layer.style.transform = '';
        svg.style.display = 'block';
        still.style.display = 'none';
        rig.render(pose);
        return;
      }
      svg.style.display = 'none';
      still.style.display = 'block';
      layer.style.transform = `translate3d(${pose.x / width * 100}%, ${pose.y / height * 100}%, 0) rotate(${pose.rotate}deg) scale(${pose.sx}, ${pose.sy})`;
      const frame = Math.max(0, Math.min(deepseaIdle.frames - 1, Math.round(pose.blink * (deepseaIdle.frames - 1))));
      if (frame !== previousFrame) image.setAttribute('x', String(-frame));
      previousFrame = frame;
    },
  };
}
