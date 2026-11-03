// Artwork is captured from the app's real GemArtwork layers after ios:sync.
// Keep the existing hosts so the demo, spin interaction and collector share it.
(() => {
  const GEM_ART_VERSION = "fa93d27a93e2";
  const GEM_VARIANTS = {"version":"130670968f3c","shapes":["pebble","kite","crystal","cushion","triangle","teardrop","round","nugget","baguette","marquise","shield"],"stones":["soft","moonstone","lagoon","aurora"]};
  const artwork = new URL(`screens/current-gem-art.webp?v=${GEM_ART_VERSION}`, document.currentScript.src).href;
  const variants = new Image();
  variants.src = new URL(`screens/current-gem-variants.webp?v=${GEM_VARIANTS.version}`, document.currentScript.src).href;
  const ready = variants.decode().then(() => true, () => false);
  document.querySelectorAll('[data-app-opal], .collector-gem--current').forEach(host => {
    const collector = host.classList.contains('collector-gem--current');
    const size = Number(host.dataset.opalSize) || (collector ? 92 : 118);
    const wrap = document.createElement('span');
    wrap.className = 'opal-wrap';
    wrap.style.width = wrap.style.height = `${size}px`;
    const image = document.createElement('img');
    image.className = (collector || host.hasAttribute('data-opal-static')) ? 'opal-artwork' : 'opal-artwork opal-bob';
    image.src = artwork;
    image.alt = '';
    image.width = image.height = 512;
    image.draggable = false;
    wrap.append(image);
    host.replaceChildren(wrap);
    let requestedVersion = 0;
    let surface;
    host.addEventListener('gem-variation', async event => {
      const version = requestedVersion = event.detail;
      if (!await ready || version !== requestedVersion) return;
      const column = version % GEM_VARIANTS.shapes.length;
      const row = version % GEM_VARIANTS.stones.length;
      if (!surface) {
        surface = document.createElement('span');
        surface.className = image.className;
        surface.style.backgroundImage = `url("${variants.src}")`;
        surface.style.backgroundSize = `${GEM_VARIANTS.shapes.length * 100}% ${GEM_VARIANTS.stones.length * 100}%`;
        wrap.replaceChildren(surface);
      }
      surface.style.backgroundPosition = `${column * 100 / (GEM_VARIANTS.shapes.length - 1)}% ${row * 100 / (GEM_VARIANTS.stones.length - 1)}%`;
      host.dataset.gemShape = GEM_VARIANTS.shapes[column];
      host.dataset.gemTexture = GEM_VARIANTS.stones[row];
    });
  });
})();
