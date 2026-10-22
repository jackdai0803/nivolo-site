/* Updated source snapshot: Nivolo OpalGem, 2026-10-21.
   Exact app colour, shape, texture, shadow and reflection rules.
   Only React markup is adapted to DOM nodes for this static site. */
(() => {
const _pebbleClamp = (n) => Math.max(0, Math.min(255, Math.round(n)));
const pebbleAdjustColor = (hex, amt) => {
  const h = (hex || "#5FC4E8").replace("#", "");
  const r = parseInt(h.slice(0, 2), 16), g = parseInt(h.slice(2, 4), 16), b = parseInt(h.slice(4, 6), 16);
  const target = amt < 0 ? 0 : 255, p = Math.abs(amt);
  const mix = (c) => _pebbleClamp(c + (target - c) * p);
  return `rgb(${mix(r)}, ${mix(g)}, ${mix(b)})`;
};

const goalPatternVariant = (id) => { let h = 0; const s = String(id || ""); for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) >>> 0; return h % 6; };
const _hashInt = (str) => {
  let h = 2166136261;
  const s = String(str || "");
  for (let i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 16777619); }
  return h >>> 0;
};
const _hslToHex = (h, s, l) => {
  s /= 100; l /= 100;
  const k = (n) => (n + h / 30) % 12;
  const a = s * Math.min(l, 1 - l);
  const f = (n) => Math.round(255 * (l - a * Math.max(-1, Math.min(k(n) - 3, Math.min(9 - k(n), 1)))));
  const hex = (v) => v.toString(16).padStart(2, "0");
  return `#${hex(f(0))}${hex(f(8))}${hex(f(4))}`;
};
// Keep the existing teal → blue → violet palette. The 76.5° step cycles
// through 248 base colours, with alternating lightness for variety.
const GEM_HUE_BASE = 168, GEM_HUE_SPAN = 124;
const gemHue = (n) => GEM_HUE_BASE + (((n * 76.5) % GEM_HUE_SPAN) + GEM_HUE_SPAN) % GEM_HUE_SPAN;
const gemColorForIndex = (i) => _hslToHex(gemHue(i), 54, i % 2 ? 66 : 57);
const gemColorFor = (seed) => gemColorForIndex(_hashInt(seed) % 248);

// ─── Category textures ──────────────────────────────────────────────
// Texture = the goal's CATEGORY (every Fitness stone is banded), while hue
// stays per-goal. Nearby translucent colours give the mineral its veins.
const CATEGORY_TEXTURE = {
  happy:      "plain",     // General
  determined: "bands",     // Fitness
  focused:    "sash",      // Study
  excited:    "twotone",   // Creative
  silly:      "spots",     // Fun
  love:       "rings",     // Passion
  proud:      "core",      // Career
  curious:    "crescent",  // Explore
};
const textureForFace = (faceId) => CATEGORY_TEXTURE[faceId] || "plain";
const goalTexture = (goal) => textureForFace(goal.iconFace || "happy");
const _hexToHsl = (hex) => {
  const s0 = (hex || "#5FC4E8").replace("#", "");
  const r = parseInt(s0.slice(0, 2), 16) / 255, g = parseInt(s0.slice(2, 4), 16) / 255, b = parseInt(s0.slice(4, 6), 16) / 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b), d = max - min;
  const l = (max + min) / 2;
  const s = d === 0 ? 0 : d / (1 - Math.abs(2 * l - 1));
  let h = 0;
  if (d !== 0) {
    if (max === r) h = 60 * (((g - b) / d) % 6);
    else if (max === g) h = 60 * ((b - r) / d + 2);
    else h = 60 * ((r - g) / d + 4);
  }
  return [(h + 360) % 360, s * 100, l * 100];
};
const opalVeinColor = (hex) => _hslToHex((_hexToHsl(hex)[0] + 26) % 360, 38, 77);
// Broad, translucent mineral seams leave the body shading visible.
// Percentage stops scale down to 44px without adding tiny repeated lines.
// Reflected light is painted separately, always white in either theme.
const buildOpalFire = (texture, c, acc) => {
  const hi = pebbleAdjustColor(c, 0.38), lo = pebbleAdjustColor(c, -0.22), mid = pebbleAdjustColor(c, 0.08);
  const BODY = `radial-gradient(ellipse at 30% 20%, ${hi} 0%, ${mid} 42%, ${c} 66%, ${lo} 100%)`;
  const vein = `${acc}B3`, mist = `${acc}66`;
  switch (texture) {
    case "bands":    return `linear-gradient(155deg, transparent 25%, ${vein} 34% 39%, transparent 48% 61%, ${mist} 67% 71%, transparent 80%), ${BODY}`;
    case "sash":     return `linear-gradient(126deg, transparent 27%, ${mist} 36%, ${vein} 42% 50%, ${mist} 56%, transparent 65%), ${BODY}`;
    case "twotone":  return `radial-gradient(ellipse at 95% 52%, ${vein} 0% 24%, ${mist} 48%, transparent 76%), ${BODY}`;
    case "spots":    return `radial-gradient(ellipse 24% 18% at 32% 58%, ${vein} 20%, transparent 100%), radial-gradient(ellipse 18% 23% at 68% 39%, ${vein} 16%, transparent 100%), radial-gradient(ellipse 21% 16% at 64% 76%, ${mist} 20%, transparent 100%), ${BODY}`;
    case "rings":    return `radial-gradient(ellipse at 14% 78%, transparent 23%, ${vein} 29% 32%, transparent 39% 50%, ${mist} 56% 59%, transparent 66%), ${BODY}`;
    case "core":     return `radial-gradient(ellipse at 51% 58%, ${hi} 0% 12%, ${vein} 29%, transparent 62%), ${BODY}`;
    case "crescent": return `radial-gradient(ellipse at 72% 35%, ${mid} 0% 28%, transparent 46%), radial-gradient(ellipse at 48% 57%, ${vein} 0% 28%, transparent 52%), ${BODY}`;
    case "holo":     return `radial-gradient(ellipse at 72% 62%, #E6B6D9B3 0%, transparent 58%), radial-gradient(ellipse at 22% 74%, #A5E5D8B3 0%, transparent 58%), radial-gradient(ellipse at 66% 18%, #E9D5B199 0%, transparent 52%), ${BODY}`;
    default:         return BODY;
  }
};

const OPAL_SHAPES = [
  "60% 40% 55% 45% / 64% 58% 42% 36%",
  "46% 54% 58% 42% / 60% 62% 38% 40%",
  "58% 42% 48% 52% / 56% 64% 36% 44%",
  "52% 48% 60% 40% / 62% 54% 46% 38%",
  "44% 56% 52% 48% / 58% 60% 40% 42%",
  "56% 44% 50% 50% / 66% 56% 44% 34%",
];

const node = (className, styles = {}) => {
    const element = document.createElement("div");
    element.className = className;
    Object.assign(element.style, styles);
    return element;
  };
  document.querySelectorAll("[data-app-opal]").forEach((host) => {
    const size = Number(host.dataset.opalSize) || 118;
    const h = Math.round(size * 0.84);
    const goalId = host.dataset.opalGoal || "goal";
    const color = gemColorFor(goalId);
    const variant = goalPatternVariant(goalId);
    const shape = OPAL_SHAPES[((variant % OPAL_SHAPES.length) + OPAL_SHAPES.length) % OPAL_SHAPES.length];
    const wrap = node("opal-wrap", { width: size + "px", height: h + "px" });
    const halo = node("opal-halo", {
      width: Math.round(size * 1.2) + "px", height: h + "px",
      filter: "blur(" + Math.round(size * 0.1) + "px)",
      background: "radial-gradient(ellipse, " + color + "20 0%, transparent 68%)"
    });
    const bob = node(host.hasAttribute("data-opal-static") ? "" : "opal-bob", { position: "relative", zIndex: 1 });
    const gem = node("opal-gem", {
      width: size + "px", height: h + "px", borderRadius: shape,
      boxShadow: "0 " + Math.max(2, Math.round(size * 0.05)) + "px " + Math.round(size * 0.09) + "px rgba(12,35,52,0.18)"
    });
    gem.append(node("opal-fire", { background: buildOpalFire(host.dataset.opalTexture || "plain", color, opalVeinColor(color)) }), node("opal-light"), node("opal-sheen"), node("opal-gloss"));
    bob.append(gem);
    wrap.append(halo, bob);
    host.replaceChildren(wrap);
  });
})();
