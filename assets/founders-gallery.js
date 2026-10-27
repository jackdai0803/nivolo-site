(() => {
  'use strict';
  const language = new URLSearchParams(location.search).get('lang');
  if (language === 'zh' || language === 'en') document.documentElement.lang = language;
  const zh = document.documentElement.lang.startsWith('zh');
  const copy = {
    edition: ['The Founder’s Edition', '创始珍藏系列'],
    iconLabel: ['Early Supporter icon', '早期支持者图标'],
    featureTitle: ['Twenty originals.\nOur first paying supporters.', '二十幅原创。\n献给最初的付费支持者。'],
    featureBody: ['Our first twenty paying members receive the Early Supporter icon and one numbered ceramic-mosaic painting each. Any paid membership counts. Free trials and launch-list signups do not reserve a place.', '最初二十位付费会员，每人获赠初代支持者图标与一幅编号陶瓷马赛克画作。任何付费会员方案均可。免费试用与加入上线通知名单不占名额。'],
    featureNote: ['The complete collection · 20 paintings', '完整系列 · 二十幅画作'],
    featureAlt: ['Nivo holding a golden star beneath an emerald aurora, in a ceramic mosaic painting', '陶瓷马赛克画中，Nivo 在翡翠色极光下捧着一颗金星'],
    viewCollection: ['View the collection', '欣赏完整系列'],
    explore: ['Explore the Founder’s Gallery', '探索创始珍藏画廊'],
    skip: ['Skip to paintings', '跳至画作'],
    back: ['← Back to Nivolo', '← 返回 Nivolo'],
    galleryTitle: ['Twenty little worlds.\nOne small beginning.', '二十个小世界。\n一个小小的开始。'],
    intro: ['One numbered painting and the Early Supporter icon for each of Nivolo’s first twenty paying members. Your supporter number matches your painting. Free trials and launch-list signups do not reserve a place.', '献给 Nivolo 最初二十位付费会员，每人一幅编号画作与初代支持者图标。你的支持者编号对应你的画作编号。免费试用与加入上线通知名单不占名额。'],
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
    save: ['Save painting', '保存画作'],
    readNote: ['Read Nivo’s note ↻', '阅读 Nivo 的手记 ↻'],
    seeFront: ['Return to painting ↻', '返回画作正面 ↻'],
    journal: ['From Nivo’s travel journal', '摘自 Nivo 的旅行手记'],
    firstLight: ['The First Light', '初光'],
    storyOpening: ['I came to the lake before sunrise, carrying one small star. For a while, the water held more light than the sky.', '日出之前，我带着一颗小星星来到湖边。有那么一会儿，湖水里的光比天空还多。'],
    storyEnding: ['I kept the mountains quiet and let the green ribbons wander. The little star was the last thing I painted—something warm to carry into a new beginning.', '我让群山静静地待着，让绿色的光带自由游走。那颗小星星是我最后画上的——带着这一点温暖，走向新的开始。'],
    artCredit: ['Created by Jack with AI-assisted artwork. Nivo is our fictional painter.', '由 Jack 借助 AI 创作。Nivo 是我们的虚构画家。'],
    saving: ['Preparing signed painting…', '正在准备签名画作…'],
    saveFailed: ['Could not save. Please try again.', '保存失败，请重试。'],
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
  const front = viewer.querySelector('.founder-front');
  const story = document.getElementById('painting-story');
  const flip = document.getElementById('painting-flip');
  const download = document.getElementById('painting-download');
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const controls = [...viewer.querySelectorAll('[data-direction]')];
  let current = 0;
  let opener;
  let bounds;
  let pointer;
  let raf = 0;
  let pendingTilt;
  let showingStory = false;
  let turnAnimation;
  function showStory(show, animate = false) {
    showingStory = show;
    front.hidden = show;
    story.hidden = !show;
    viewer.classList.toggle('is-reading', show);
    viewer.setAttribute('aria-labelledby', show ? 'painting-story-title' : 'painting-title');
    if (show) viewer.removeAttribute('aria-describedby');
    else viewer.setAttribute('aria-describedby', 'painting-description');
    flip.setAttribute('aria-expanded', String(show));
    flip.textContent = t(show ? 'seeFront' : 'readNote');
    turnAnimation?.cancel();
    resetTilt();
    if (animate && !reduced.matches) turnAnimation = frame.animate([
      { opacity: .35, transform: `rotateY(${show ? -10 : 10}deg)` },
      { opacity: 1, transform: 'rotateY(0deg)' },
    ], { duration: 340, easing: 'ease-out' });
  }
  flip.addEventListener('click', () => showStory(!showingStory, true));
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
    showStory(false);
    flip.hidden = item.id !== '01';
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
    download.href = `assets/founders/${item.id}.webp`;
    download.download = `nivolo-founders-${item.id}.webp`;
    controls[0].disabled = current === 0;
    controls[1].disabled = current === paintings.length - 1;
  }
  // Export the same signature placement shown on every front, without altering source art.
  let saving = false;
  download.addEventListener('click', async (event) => {
    event.preventDefault();
    if (saving) return;
    saving = true;
    const item = paintings[current];
    const status = document.getElementById('painting-save-status');
    status.textContent = t('saving');
    download.setAttribute('aria-disabled', 'true');
    try {
      const art = new Image();
      const signature = new Image();
      art.src = `assets/founders/${item.id}.webp`;
      signature.src = 'assets/nivo-signature-gold.webp';
      await Promise.all([art.decode(), signature.decode()]);
      const canvas = document.createElement('canvas');
      canvas.width = art.naturalWidth;
      canvas.height = art.naturalHeight;
      const context = canvas.getContext('2d');
      context.drawImage(art, 0, 0);
      const width = canvas.width * .11;
      const height = width * signature.naturalHeight / signature.naturalWidth;
      context.shadowColor = '#281f11b3';
      context.shadowOffsetY = 1;
      context.shadowBlur = 1;
      context.drawImage(signature, canvas.width * .96 - width, canvas.height * .96 - height, width, height);
      const blob = await new Promise((resolve) => canvas.toBlob(resolve, 'image/png'));
      if (!blob) throw new Error('Image export failed');
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `nivolo-founders-${item.id}-signed.png`;
      document.body.append(link);
      link.click();
      link.remove();
      setTimeout(() => URL.revokeObjectURL(url), 60000);
      status.textContent = '';
    } catch {
      status.textContent = t('saveFailed');
    } finally {
      saving = false;
      download.removeAttribute('aria-disabled');
    }
  });
  links.forEach((link, index) => link.addEventListener('click', (event) => {
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || event.button !== 0) return;
    event.preventDefault();
    opener = link;
    viewer.showModal();
    document.documentElement.classList.add('founder-viewer-open');
    display(index);
  }));
  // A winner arrives from their in-app card with their permanent painting ID.
  // The gallery stays public; this link displays artwork, never grants an award.
  const assigned = new URLSearchParams(location.search).get('painting');
  const assignedIndex = paintings.findIndex((item) => item.id === assigned);
  if (assignedIndex !== -1) {
    opener = links[assignedIndex];
    viewer.showModal();
    document.documentElement.classList.add('founder-viewer-open');
    display(assignedIndex);
  }
  viewer.querySelector('.founder-close').addEventListener('click', () => viewer.close());
  viewer.addEventListener('close', () => {
    showStory(false);
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
    if (reduced.matches || showingStory || !event.isPrimary || event.button !== 0) return;
    bounds = stage.getBoundingClientRect();
    pointer = event.pointerId;
    stage.setPointerCapture(pointer);
  });
  stage.addEventListener('pointermove', (event) => {
    if (reduced.matches || showingStory || !bounds || (event.pointerType !== 'mouse' && pointer !== event.pointerId)) return;
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
