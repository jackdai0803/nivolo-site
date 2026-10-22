// The approved PNG is the artwork for EVERY part. No raster pixel is edited.
// Curved masks separate the torso from flippers. Flipper roots stay behind it.
export const EYES = [
  { name: 'left', cx: 489, cy: 604, rx: 94, ry: 98 },
  { name: 'right', cx: 799, cy: 511, rx: 98, ry: 98 },
];
export const CELEBRATION_MS = 1120;
export const SMALL_WIN_MS = 720;
export const BLINK_MS = 290;
const clamp = (n, lo = 0, hi = 1) => Math.max(lo, Math.min(hi, n));
const ease = (n) => { const x = clamp(n); return x * x * (3 - 2 * x); };
export function blinkAt(ms) {
  if (ms < 0 || ms >= BLINK_MS) return 0;
  const p = ms / BLINK_MS;
  return p < .38 ? ease(p / .38) : 1 - ease((p - .38) / .62);
}
export function neutralPose() {
  return { x: 0, y: 0, rotate: 0, sx: 1, sy: 1, left: 0, right: 0, blink: 0, happy: 0, sparkle: 0 };
}
export function idleAt(ms) {
  const t = ms / 1000;
  const pose = neutralPose();
  pose.y = -14 * (1 - Math.cos(t * Math.PI * 2 / 5.4));
  pose.rotate = .65 * Math.sin(t * Math.PI * 2 / 7.1);
  pose.left = 1.3 * Math.sin(t * Math.PI * 2 / 5.4);
  pose.right = -pose.left;
  // One brief blink every 6.4 seconds, never continuous eye squeezing.
  pose.blink = blinkAt(ms % 6400 - 2450);
  return pose;
}
const bounce = [
  [0, 0, 1, 1, 0, 0, 0],
  [.16, 14, 1.045, .96, -5, 5, 0],
  [.44, -80, .975, 1.03, 46, -55, 1],
  [.66, -48, 1, 1, 34, -42, 1],
  [.84, 8, 1.025, .98, 8, -10, .3],
  [1, 0, 1, 1, 0, 0, 0],
];
export function celebrationAt(ms) {
  const pose = neutralPose();
  if (ms < 0 || ms >= CELEBRATION_MS) return pose;
  const p = ms / CELEBRATION_MS;
  const index = bounce.findIndex((frame, i) => i < bounce.length - 1 && p < bounce[i + 1][0]);
  const a = bounce[Math.max(0, index)], b = bounce[Math.max(0, index) + 1];
  const k = ease((p - a[0]) / (b[0] - a[0]));
  const v = a.map((n, i) => n + (b[i] - n) * k);
  [pose.y, pose.sx, pose.sy, pose.left, pose.right, pose.happy] = v.slice(1);
  pose.blink = pose.happy;
  pose.sparkle = clamp((p - .18) / .18) * clamp((.95 - p) / .36);
  return pose;
}

// Acknowledges one action: ~4px lift at home size, modest flipper movement,
// and two faint glints. The full celebration keeps its larger lift and burst.
const smallWinFrames = [
  [0, 0, 1, 1, 0, 0, 0],
  [.14, 5, 1.018, .984, -2, 2, 0],
  [.4, -24, .99, 1.01, 12, -18, 1],
  [.64, -10, 1, 1, 8, -12, 1],
  [.82, 2, 1.01, .99, 2, -3, 0],
  [1, 0, 1, 1, 0, 0, 0],
];
export function smallWinAt(ms) {
  const pose = neutralPose();
  if (ms <= 0 || ms >= SMALL_WIN_MS) return pose;
  const p = ms / SMALL_WIN_MS;
  const index = smallWinFrames.findIndex((frame, i) => i < smallWinFrames.length - 1 && p < smallWinFrames[i + 1][0]);
  const a = smallWinFrames[index], b = smallWinFrames[index + 1];
  const k = ease((p - a[0]) / (b[0] - a[0]));
  const values = a.map((value, i) => value + (b[i] - value) * k);
  [pose.y, pose.sx, pose.sy, pose.left, pose.right, pose.happy] = values.slice(1);
  pose.blink = pose.happy;
  pose.sparkle = .55 * clamp((p - .14) / .16) * clamp((.74 - p) / .28);
  pose.sparkleLimit = 2;
  return pose;
}

const ellipse = (e, attrs = '') => `<ellipse cx="${e.cx}" cy="${e.cy}" rx="${e.rx}" ry="${e.ry}" ${attrs}/>`;
// Each cut follows a continuous torso edge and meets the PNG silhouette again.
// Do not terminate a cut with a straight segment through opaque artwork: that
// leaves a stationary scrap visible when a flipper rotates away.
// Begin above the original shoulder kink (around y=750), with a smooth curve
// already inside the old outline before reaching it. Joining at the kink itself
// preserves a tiny tooth in the rest/anticipation poses.
export const LEFT_SHOULDER_CUT = [[252, 640], [252, 710], [297, 780]];
const [shoulderStart, shoulderControl, shoulderEnd] = LEFT_SHOULDER_CUT;
const leftTip = `M0 ${shoulderStart[1]} H${shoulderStart[0]} Q${shoulderControl.join(' ')} ${shoulderEnd.join(' ')} C316 810 318 860 333 888 C343 902 351 913 351 920 H0 Z`;
const rightTip = 'M985 640 H1254 V910 H934 C961 852 984 737 985 640 Z';
const leftWing = 'M310 755 C290 752 257 772 229 803 C204 828 192 853 211 875 C231 900 275 902 310 884 C335 869 349 843 344 811 C339 783 325 762 310 755 Z';
const rightWing = 'M969 716 C993 721 1023 757 1045 795 C1065 828 1075 852 1057 871 C1036 892 995 882 964 866 C936 851 927 821 933 785 C937 751 950 725 969 716 Z';

export function createRig(container, source, id, label) {
  const image = (attrs = '') => `<use href="#${id}-art" ${attrs}/>`;
  const mask = (name, cuts) => `<mask id="${id}-${name}" maskUnits="userSpaceOnUse" x="0" y="0" width="1254" height="1254" style="mask-type:luminance"><rect width="1254" height="1254" fill="white"/>${cuts}</mask>`;
  container.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="160 170 970 970" role="img" aria-label="${label}">
    <defs>
      <image id="${id}-art" href="${source}" width="1254" height="1254"/>
      <clipPath id="${id}-beak-window"><path d="M574 661 Q565 621 600 592 Q661 546 739 595 L737 632 Q737 714 660 716 Q612 710 591 665 Z"/></clipPath>
      <clipPath id="${id}-left-wing"><path d="${leftWing}"/></clipPath>
      <clipPath id="${id}-right-wing"><path d="${rightWing}"/></clipPath>
      ${EYES.map(e => `<clipPath id="${id}-${e.name}-eye">${ellipse(e)}</clipPath>`).join('')}
      ${mask('body-mask', `<path d="${leftTip}" fill="black"/><path d="${rightTip}" fill="black"/>`)}
    </defs>
    <g class="character" data-part="motion">
      <g data-part="left-flipper">${image(`clip-path="url(#${id}-left-wing)"`)}</g>
      <g data-part="right-flipper">${image(`clip-path="url(#${id}-right-wing)"`)}</g>
      <!-- The torso covers rotating roots; the original white face lives here. -->
      <g data-part="body">${image(`mask="url(#${id}-body-mask)"`)}</g>
      ${EYES.map(e => `<g data-part="${e.name}-eye-assembly">
        ${ellipse(e, 'fill="#ffffff"')}
        <g data-part="${e.name}-eye">${image(`clip-path="url(#${id}-${e.name}-eye)"`)}</g>
        <path data-part="${e.name}-lid" fill="none" stroke="#111111" stroke-width="16" stroke-linecap="round" opacity="0" transform="translate(${e.cx} ${e.cy}) rotate(-17)" d="M-59 8 Q0 38 59 8"/>
      </g>`).join('')}
      <g data-part="beak">${image(`clip-path="url(#${id}-beak-window)"`)}</g>
    </g>
    <g data-part="SparkleBurst" fill="#f5bb43" opacity="0" aria-hidden="true">
      ${[[228,365],[1000,320],[1100,635],[210,665],[350,215],[1030,960]].map(([x,y],i)=>`<path data-sparkle="${i}" data-x="${x}" data-y="${y}" d="M0 -16 Q3 -3 14 0 Q3 3 0 16 Q-3 3 -14 0 Q-3 -3 0 -16Z" transform="translate(${x} ${y})"/>`).join('')}
    </g>
  </svg>`;
  const nodes = Object.fromEntries([...container.querySelectorAll('[data-part]')].map(el => [el.dataset.part, el]));
  const sparkles = [...container.querySelectorAll('[data-sparkle]')];
  return {
    render(pose) {
      nodes.motion.setAttribute('transform', `translate(${pose.x} ${pose.y}) translate(635 650) rotate(${pose.rotate}) scale(${pose.sx} ${pose.sy}) translate(-635 -650)`);
      nodes['left-flipper'].setAttribute('transform', `rotate(${pose.left} 320 815)`);
      nodes['right-flipper'].setAttribute('transform', `rotate(${pose.right} 965 785)`);
      for (const eye of EYES) {
        const openness = Math.max(.025, 1 - pose.blink);
        const node = nodes[`${eye.name}-eye`];
        node.setAttribute('transform', `translate(${eye.cx} ${eye.cy}) rotate(-17) scale(1 ${openness}) rotate(17) translate(${-eye.cx} ${-eye.cy})`);
        node.setAttribute('opacity', String(clamp(openness / .22)));
        const lid = nodes[`${eye.name}-lid`];
        lid.setAttribute('opacity', String(clamp((pose.blink - .62) / .3)));
        lid.setAttribute('d', pose.happy > .2 ? 'M-59 10 Q0 -43 59 10' : 'M-59 8 Q0 38 59 8');
      }
      nodes.SparkleBurst.setAttribute('opacity', String(pose.sparkle));
      for (const [index, star] of sparkles.entries()) {
        star.setAttribute('opacity', index < (pose.sparkleLimit ?? sparkles.length) ? '1' : '0');
        const x = Number(star.dataset.x), y = Number(star.dataset.y);
        const drift = pose.sparkle * 26;
        star.setAttribute('transform', `translate(${x + Math.sign(x - 635) * drift} ${y - drift}) scale(${.7 + pose.sparkle * .4})`);
      }
    },
    setLabel(text) { container.querySelector('svg').setAttribute('aria-label', text); },
  };
}
