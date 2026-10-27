(() => {
  'use strict';
  const language = new URLSearchParams(location.search).get('lang');
  if (language === 'zh' || language === 'en') document.documentElement.lang = language;
  const zh = document.documentElement.lang.startsWith('zh');
  const copy = {
    edition: ['The Founder’s Edition', '创始珍藏系列'],
    iconLabel: ['Early Supporter icon', '早期支持者图标'],
    featureTitle: ['Twenty originals.\nTwenty first supporters.', '二十幅原创。\n献给最初的二十位支持者。'],
    featureBody: ['Little worlds to get lost in. Discover twenty ceramic-mosaic paintings, each with a different place, a golden detail, and a familiar little face.', '走进值得流连的小世界。二十幅陶瓷马赛克画作，每幅都有不同的风景、一点金色细节，以及那张熟悉的小脸。'],
    featureNote: ['The complete collection · 20 paintings', '完整系列 · 二十幅画作'],
    featureAlt: ['Nivo holding a golden star beneath an emerald aurora, in a ceramic mosaic painting', '陶瓷马赛克画中，Nivo 在翡翠色极光下捧着一颗金星'],
    viewCollection: ['View the collection', '欣赏完整系列'],
    explore: ['Explore the Founder’s Gallery', '探索创始珍藏画廊'],
    skip: ['Skip to paintings', '跳至画作'],
    back: ['← Back to Nivolo', '← 返回 Nivolo'],
    galleryTitle: ['Twenty little worlds.\nOne small beginning.', '二十个小世界。\n一个小小的开始。'],
    intro: ['A collection for Nivolo’s first twenty supporters. From familiar shores to faraway mountains, a little Nivo in every scene.', '献给 Nivolo 最初二十位支持者的珍藏。从熟悉的海岸到遥远的山峰，每一处风景都有小小的 Nivo。'],
    medium: ['Ceramic mosaic', '陶瓷马赛克'],
    twenty: ['20 original artworks', '二十幅原创画作'],
    collection: ['The complete collection', '完整珍藏系列'],
    openHint: ['Select a painting to look closer ↗', '选择一幅画，细细欣赏 ↗'],
    footer: ['Small steps. Beautiful places. A beginning worth keeping.', '小小的脚步，美丽的风景，值得珍藏的开始。'],
    more: ['Explore Nivolo’s other keepsakes →', '探索 Nivolo 的其他珍藏 →'],
    close: ['Close painting', '关闭画作'],
    previous: ['Previous painting', '上一幅画'],
    next: ['Next painting', '下一幅画'],
    viewerHint: ['Move or drag gently to tilt · Use the arrows to explore', '移动指针或轻轻拖动可倾斜画框 · 使用箭头浏览'],
    stillHint: ['Use the arrows to explore', '使用箭头浏览画作'],
    view: ['View', '欣赏'],
    pageTitle: ['Founder’s Gallery — Nivolo', '创始珍藏画廊 — Nivolo'],
    allPaintings: ['The twenty paintings', '二十幅珍藏画作'],
    home: ['Nivolo home', 'Nivolo 首页'],
  };
  const t = (key) => copy[key][zh ? 1 : 0];
  document.querySelectorAll('[data-founder-copy]').forEach((element) => {
    const lines = t(element.dataset.founderCopy).split('\n');
    element.replaceChildren();
    lines.forEach((line, index) => {
      if (index) element.append(document.createElement('br'));
      element.append(document.createTextNode(line));
    });
  });
  document.querySelectorAll('[data-founder-label]').forEach((el) => el.setAttribute('aria-label', t(el.dataset.founderLabel)));
  document.querySelectorAll('[data-founder-alt]').forEach((el) => { el.alt = t(el.dataset.founderAlt); });
  if (zh) document.querySelectorAll('a[href^="founders.html"], a[href^="index.html"]').forEach((link) => {
    const url = new URL(link.href);
    url.searchParams.set('lang', 'zh');
    link.href = url.href;
  });
  const catalog = document.getElementById('founders-catalog');
  if (!catalog) return;
  document.title = t('pageTitle');
  document.querySelector('.founder-wordmark').setAttribute('aria-label', t('home'));
  document.getElementById('paintings').setAttribute('aria-label', t('allPaintings'));
  const paintings = JSON.parse(catalog.textContent);
  const localized = (item, field) => item[field][zh ? 1 : 0];
  const links = [...document.querySelectorAll('[data-painting]')];
  links.forEach((link, index) => {
    const item = paintings[index];
    link.setAttribute('aria-label', `${t('view')} ${localized(item, 'title')}`);
    link.querySelector('img').alt = localized(item, 'description');
    const caption = link.closest('article').querySelector('.founder-caption');
    caption.querySelector('h2').textContent = localized(item, 'title');
    caption.querySelector('p').textContent = localized(item, 'place');
  });

  const viewer = document.querySelector('.founder-viewer');
  if (typeof viewer.showModal !== 'function') return; // Full-image links remain usable.
  const image = document.getElementById('painting-image');
  const frame = viewer.querySelector('.founder-frame');
  const stage = viewer.querySelector('.founder-stage');
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const controls = [...viewer.querySelectorAll('[data-direction]')];
  let current = 0;
  let opener;
  let bounds;
  let pointer;
  let raf = 0;
  let pendingTilt;
  const resetTilt = () => {
    cancelAnimationFrame(raf);
    raf = 0;
    pointer = undefined;
    bounds = undefined;
    frame.style.removeProperty('--tilt-x');
    frame.style.removeProperty('--tilt-y');
  };
  const updateMotion = () => {
    resetTilt();
    viewer.querySelector('.founder-viewer-hint').textContent = t(reduced.matches ? 'stillHint' : 'viewerHint');
  };
  updateMotion();
  reduced.addEventListener('change', updateMotion);
  const glint = () => {
    if (reduced.matches || !viewer.open) return;
    frame.classList.remove('is-glinting');
    requestAnimationFrame(() => {
      if (viewer.open && !reduced.matches) frame.classList.add('is-glinting');
    });
  };
  frame.addEventListener('animationend', () => frame.classList.remove('is-glinting'));
  image.addEventListener('load', () => {
    image.style.visibility = '';
    frame.removeAttribute('aria-busy');
    glint();
  });
  image.addEventListener('error', () => {
    image.style.visibility = '';
    frame.removeAttribute('aria-busy'); // The descriptive alt remains available.
  });
  function display(index) {
    if (index < 0 || index >= paintings.length) return;
    current = index;
    const item = paintings[current];
    resetTilt();
    frame.classList.remove('is-glinting');
    image.style.visibility = 'hidden';
    frame.setAttribute('aria-busy', 'true');
    image.alt = localized(item, 'description');
    image.src = `assets/founders/${item.id}.webp`;
    document.getElementById('painting-title').textContent = localized(item, 'title');
    document.getElementById('painting-place').textContent = localized(item, 'place');
    document.getElementById('painting-description').textContent = localized(item, 'description');
    document.getElementById('painting-position').textContent = `${item.id} / 20`;
    controls[0].disabled = current === 0;
    controls[1].disabled = current === paintings.length - 1;
  }
  links.forEach((link, index) => link.addEventListener('click', (event) => {
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || event.button !== 0) return;
    event.preventDefault();
    opener = link;
    viewer.showModal();
    document.documentElement.classList.add('founder-viewer-open');
    display(index);
  }));
  viewer.querySelector('.founder-close').addEventListener('click', () => viewer.close());
  viewer.addEventListener('close', () => {
    resetTilt();
    frame.classList.remove('is-glinting');
    document.documentElement.classList.remove('founder-viewer-open');
    opener?.focus({ preventScroll: true });
  });
  // Only a press AND release on the backdrop closes it; a drag out does not.
  let backdropPressed = false;
  const outside = (event) => {
    const rect = viewer.getBoundingClientRect();
    return event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom;
  };
  viewer.addEventListener('pointerdown', (event) => { backdropPressed = event.target === viewer && outside(event); });
  viewer.addEventListener('click', (event) => {
    if (backdropPressed && event.target === viewer && outside(event)) viewer.close();
    backdropPressed = false;
  });
  controls.forEach((control) => control.addEventListener('click', () => display(current + Number(control.dataset.direction))));
  viewer.addEventListener('keydown', (event) => {
    if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
      event.preventDefault();
      display(current + (event.key === 'ArrowLeft' ? -1 : 1));
    }
  });
  stage.addEventListener('pointerenter', () => { bounds = stage.getBoundingClientRect(); });
  stage.addEventListener('pointerdown', (event) => {
    if (reduced.matches || !event.isPrimary || event.button !== 0) return;
    bounds = stage.getBoundingClientRect();
    pointer = event.pointerId;
    stage.setPointerCapture(pointer);
  });
  stage.addEventListener('pointermove', (event) => {
    if (reduced.matches || !bounds || (event.pointerType !== 'mouse' && pointer !== event.pointerId)) return;
    const x = Math.max(-1, Math.min(1, (event.clientX - bounds.left) / bounds.width * 2 - 1));
    const y = Math.max(-1, Math.min(1, (event.clientY - bounds.top) / bounds.height * 2 - 1));
    pendingTilt = [-y * 3, x * 3];
    if (!raf) raf = requestAnimationFrame(() => {
      frame.style.setProperty('--tilt-x', `${pendingTilt[0]}deg`);
      frame.style.setProperty('--tilt-y', `${pendingTilt[1]}deg`);
      raf = 0;
    });
  });
  ['pointerleave', 'pointerup', 'pointercancel', 'lostpointercapture'].forEach((event) => stage.addEventListener(event, resetTilt));
  window.addEventListener('resize', resetTilt);
})();
