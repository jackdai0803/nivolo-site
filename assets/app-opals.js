// Artwork is captured from the app's real GemArtwork layers after ios:sync.
// Keep the existing hosts so the demo, spin interaction and collector share it.
(() => {
  const GEM_ART_VERSION = "9f50c1fe6f8f";
  const GEM_VARIANTS = {"version":"993d5518aae8","shapes":["pebble","kite","crystal","cushion","triangle","teardrop","round","nugget","baguette","marquise","shield"],"stones":["soft","moonstone","lagoon","aurora"]};
  const artwork = new URL(`screens/current-gem-art.webp?v=${GEM_ART_VERSION}`, document.currentScript.src).href;
  const variantArtwork = new URL(`screens/current-gem-variants.webp?v=${GEM_VARIANTS.version}`, document.currentScript.src).href;
  let variantsReady;
  function loadVariants() {
    if (!variantsReady) {
      const variants = new Image();
      variants.src = variantArtwork;
      variantsReady = variants.decode().then(() => true, () => {
        variantsReady = undefined;
        return false;
      });
    }
    return variantsReady;
  }
  document.querySelectorAll('[data-app-opal], .collector-gem--current').forEach(host => {
    const collector = host.classList.contains('collector-gem--current');
    const interactive = host.closest('.step-art--gem');
    const size = Number(host.dataset.opalSize) || (collector ? 92 : 118);
    const wrap = document.createElement('span');
    wrap.className = 'opal-wrap';
    wrap.style.width = wrap.style.height = `${size}px`;
    const image = document.createElement('img');
    image.className = (interactive || collector || host.hasAttribute('data-opal-static')) ? 'opal-artwork' : 'opal-artwork opal-bob';
    image.src = artwork;
    image.alt = '';
    image.width = image.height = 512;
    image.draggable = false;
    wrap.append(image);
    host.replaceChildren(wrap);
    if (!interactive) return;

    const glint = document.createElement('span');
    glint.className = 'gem-glint-mask';
    glint.style.setProperty('--gem-glint-source', `url("${artwork}")`);
    const beam = document.createElement('span');
    beam.className = 'gem-glint-beam';
    glint.append(beam);
    wrap.append(glint);

    let requestedVersion = 0;
    let surface;
    host.addEventListener('gem-variation', async event => {
      const version = requestedVersion = event.detail;
      if (wrap.hasAttribute('data-gem-glint')) {
        for (const animation of wrap.getAnimations({ subtree: true })) animation.play();
      } else {
        wrap.setAttribute('data-gem-glint', '');
      }
      const ready = await loadVariants();
      if (!ready || version !== requestedVersion) return;
      const column = version % GEM_VARIANTS.shapes.length;
      const row = version % GEM_VARIANTS.stones.length;
      if (!surface) {
        surface = document.createElement('span');
        surface.className = image.className;
        surface.style.backgroundImage = `url("${variantArtwork}")`;
        surface.style.backgroundSize = `${GEM_VARIANTS.shapes.length * 100}% ${GEM_VARIANTS.stones.length * 100}%`;
        glint.style.setProperty('--gem-glint-source', surface.style.backgroundImage);
        glint.style.setProperty('--gem-glint-size', surface.style.backgroundSize);
        image.replaceWith(surface);
      }
      surface.style.backgroundPosition = `${column * 100 / (GEM_VARIANTS.shapes.length - 1)}% ${row * 100 / (GEM_VARIANTS.stones.length - 1)}%`;
      glint.style.setProperty('--gem-glint-position', surface.style.backgroundPosition);
      host.dataset.gemShape = GEM_VARIANTS.shapes[column];
      host.dataset.gemTexture = GEM_VARIANTS.stones[row];
    });
  });
})();
