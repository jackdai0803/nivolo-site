// Artwork is captured from the app's real GemArtwork layers after ios:sync.
// Keep the existing hosts so the demo, spin interaction and collector share it.
(() => {
  const GEM_ART_VERSION = "fa93d27a93e2";
  const artwork = new URL(`screens/current-gem-art.webp?v=${GEM_ART_VERSION}`, document.currentScript.src).href;
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
  });
})();
