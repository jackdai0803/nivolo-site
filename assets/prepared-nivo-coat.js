// Swap in the prepared coat after decoding; the original rig is the fallback.
const coatDecodes = new Map();
export function applyPreparedNivoCoat(svg, source) {
 const coat = svg?.querySelector('defs g[id$="-art"][mask]');
 if (!source || !coat || coat.querySelector('[data-effect]')) return;
 if (!coatDecodes.has(source)) {
  const image = new Image();
  image.src = source;
  coatDecodes.set(source, image.decode().then(() => true, () => {
   coatDecodes.delete(source);
   return false;
  }));
 }
 void coatDecodes.get(source).then(ready => {
  if (!ready || !coat.isConnected || !coat.hasAttribute('mask')) return;
  const image = document.createElementNS(svg.namespaceURI, 'image');
  image.setAttribute('width', '1254');
  image.setAttribute('height', '1254');
  image.setAttribute('href', source);
  coat.replaceChildren(image);
  coat.removeAttribute('mask');
  coat.removeAttribute('style');
  const uid = coat.id.slice(0, -4);
  for (const name of ['coat-silhouette', 'coat-edge', 'plumage-mask', 'plumage-selection', 'opaque-art', 'coat-gradient']) {
   svg.querySelector(`[id="${uid}-${name}"]`)?.remove();
  }
 });
}
