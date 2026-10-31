(() => {
  // A few short reactions keep the opening playful without a permanent loop.
  const reducedMotion = matchMedia("(prefers-reduced-motion: reduce)");
  const copy = {
    en: { goal: 'Preview a new goal', action: 'Preview logging an action', gem: 'Give the goal gem a spin', previous: 'Previous app screen', next: 'Next app screen', browse: 'Browse app screens', progress: 'Progress through app screenshots' },
    zh: { goal: '预览新目标', action: '预览记录行动', gem: '转动目标宝石', previous: '上一张应用截图', next: '下一张应用截图', browse: '浏览应用截图', progress: '应用截图浏览进度' },
  };
  const t = (key) => copy[document.documentElement.lang.startsWith('zh') ? 'zh' : 'en'][key];
  Object.assign(copy.en, {
    heroBody: 'Make room for what matters. One small step at a time.', heroReassurance: 'Free core tools · No account required', collectionTitle: 'Turn small steps into keepsakes.', faqTitle: 'Free habit tools. No account required.',
    heroJoin: 'Join the launch list', heroGet: 'Get the app', heroHow: 'Try a small step ↓',
    previewEyebrow: 'ONE SMALL STEP, TODAY', previewTitleFirst: 'Starting is', previewTitleSecond: 'the hard part.',
    previewBody: 'Give Nivo one small action. See what happens next.',
    previewStep: 'One clear step', previewStreak: 'Kinder streaks', previewRest: 'Rest without guilt',
    previewScreen: 'Your day in Nivolo', previewLabel: 'View the Nivolo home screen up close',
    previewAlt: 'Nivolo home screen with this week’s progress and the next step for Learn guitar.',
    previewCaption: 'Your day, one small step at a time. ↗',
    proofPrivate: 'Private by default', proofAccount: 'No account required', proofPhone: 'Designed for iPhone', proofFree: 'Core habit tools free',
    menu: 'Menu', navFeatures: 'Features', navPricing: 'Pricing', navFaq: 'FAQ', navSupport: 'Support',
    screens: 'See five more app screens', collection: 'Meet the rest of the collection',
    collectionPreview: 'A little face for every chapter', collectionClassic: 'Meet Classic.',
    collectionStory: 'Your first Nivo. There’s a whole collection of little personalities to discover as you go.', collectionLess: 'Show less',
    kindTitle: 'Room for real life.', kindBody: 'Planned rest days and a free weekly freeze keep your streak safe when life gets in the way.',
    krill: 'Meet the Krill', private: 'Private by design.', account: 'No cloud account. No ad trackers.',
    data: 'How AI and icon checks use data', questions: 'More questions', rewards: 'Rewards',
    yearlyNote: 'About $2.50/month · billed yearly · USD', monthlyNote: 'Or $29.99 a year (about $2.50/month) · USD',
  });
  Object.assign(copy.zh, {
    heroBody: '为重要的事留点空间。从一小步开始。', heroReassurance: '核心功能免费 · 无需账户', collectionTitle: '让小小行动，成为你的珍藏。', faqTitle: '核心习惯功能免费，无需账户。',
    heroJoin: '加入上线通知名单', heroGet: '获取应用', heroHow: '试着迈出一小步 ↓',
    previewEyebrow: '今天，迈出一小步', previewTitleFirst: '最难的，', previewTitleSecond: '是开始。',
    previewBody: '和 Nivo 一起迈出一小步，看看接下来会发生什么。',
    previewStep: '清晰的一步', previewStreak: '更温柔的坚持', previewRest: '安心休息',
    previewScreen: '你在 Nivolo 的一天', previewLabel: '放大查看 Nivolo 主屏幕',
    previewAlt: 'Nivolo 主屏幕，展示本周进度和“学习吉他”的下一步。',
    previewCaption: '每一天，都从一小步开始。↗',
    proofPrivate: '默认保护隐私', proofAccount: '无需账户', proofPhone: '为 iPhone 设计', proofFree: '核心习惯功能免费',
    menu: '菜单', navFeatures: '功能', navPricing: '价格', navFaq: '常见问题', navSupport: '支持',
    screens: '再看五张应用截图', collection: '认识收藏里的其他伙伴',
    collectionPreview: '每一段旅程，都有一张小小的脸', collectionClassic: '认识经典 Nivo。',
    collectionStory: '你的第一位 Nivo。随着你一步步前进，还有许多各具个性的小伙伴等你发现。', collectionLess: '收起收藏',
    kindTitle: '为生活留点余地。', kindBody: '提前安排休息日，每周还有一次免费的连续记录冻结，在忙碌时守护你的坚持。',
    krill: '认识磷虾', private: '隐私，融入设计。', account: '无需云端账户，没有广告追踪。',
    data: 'AI 和图标检查如何使用数据', questions: '更多问题', rewards: '奖励',
    yearlyNote: '约每月 $2.50 · 按年计费 · 美元', monthlyNote: '或每年 $29.99（约每月 $2.50）· 美元',
  });
  document.querySelectorAll('[data-site-copy]').forEach((element) => { element.textContent = t(element.dataset.siteCopy); });
  document.querySelectorAll('[data-site-store-label]').forEach((element) => {
    element.dataset.live = t('heroGet');
    element.dataset.soon = t('heroJoin');
    element.textContent = t(typeof APP_STORE_URL !== 'undefined' && APP_STORE_URL ? 'heroGet' : 'heroJoin');
  });
  document.querySelectorAll('[data-site-label]').forEach((element) => element.setAttribute('aria-label', t(element.dataset.siteLabel)));
  document.querySelectorAll('[data-site-alt]').forEach((element) => { element.alt = t(element.dataset.siteAlt); });
  document.querySelectorAll('[data-site-screen]').forEach((element) => { element.dataset.appScreen = t(element.dataset.siteScreen); });
  const phoneMenu = document.querySelector('.phone-menu');
  const phoneLayout = matchMedia('(max-width: 760px)');
  phoneMenu?.querySelectorAll('a').forEach((link) => link.addEventListener('click', () => { phoneMenu.open = false; }));
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && phoneMenu?.open) {
      phoneMenu.open = false;
      phoneMenu.querySelector('summary').focus();
    }
  });
  document.addEventListener('click', (event) => {
    if (phoneMenu?.open && !phoneMenu.contains(event.target)) phoneMenu.open = false;
  });
  phoneLayout.addEventListener('change', () => { if (phoneMenu) phoneMenu.open = false; });
  const reactions = new Map();
  const react = (element, frames, options = {}) => {
    if (!element || reducedMotion.matches) return;
    reactions.get(element)?.cancel();
    const animation = element.animate(frames, { duration: 500, easing: 'cubic-bezier(.2,.8,.2,1)', ...options });
    reactions.set(element, animation);
    animation.onfinish = () => reactions.delete(element);
  };

  // The illustrations are useful entry points, with plain artwork as fallback.
  document.querySelectorAll('.step-art').forEach((art, index) => {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = `${art.className} step-play`;
    button.setAttribute('aria-label', t(['goal', 'action', 'gem'][index]));
    while (art.firstChild) button.appendChild(art.firstChild);
    [...button.children].forEach((child) => child.setAttribute('aria-hidden', 'true'));
    const cue = document.createElement('span');
    cue.className = 'step-play-cue';
    cue.setAttribute('aria-hidden', 'true');
    cue.textContent = index === 2 ? '↻' : '↗';
    button.appendChild(cue);
    if (index < 2) button.dataset.appScreen = t(index === 0 ? 'goal' : 'action');
    else button.addEventListener('click', () => {
      react(button.querySelector('[data-app-opal]'), [
        { rotate: '0deg', scale: '1' },
        { rotate: '-18deg', scale: '.92', offset: .15 },
        { rotate: '335deg', scale: '1.16', offset: .72 },
        { rotate: '360deg', scale: '1' },
      ], { duration: 850 });
      button.querySelectorAll('.step-spark').forEach((spark) => react(spark, [
        { scale: '1', opacity: .65 }, { scale: '1.7', opacity: 1, offset: .5 }, { scale: '1', opacity: .65 },
      ], { duration: 700 }));
      // Colour remains a response when reduced motion is enabled.
      button.classList.toggle('is-polished');
    });
    art.replaceWith(button);
  });

  const rail = document.querySelector('.app-screen-rail');
  if (rail) {
    const controls = document.createElement('div');
    controls.className = 'gallery-controls';
    controls.setAttribute('role', 'group');
    controls.setAttribute('aria-label', t('browse'));
    const previous = document.createElement('button');
    const next = document.createElement('button');
    [previous, next].forEach((button, index) => {
      button.type = 'button';
      button.className = 'gallery-arrow';
      button.setAttribute('aria-label', t(index ? 'next' : 'previous'));
      button.innerHTML = `<span aria-hidden="true">${index ? '→' : '←'}</span>`;
    });
    const track = document.createElement('div');
    track.className = 'gallery-track';
    track.setAttribute('role', 'progressbar');
    track.setAttribute('aria-label', t('progress'));
    track.setAttribute('aria-valuemin', '0');
    track.setAttribute('aria-valuemax', '100');
    track.innerHTML = '<span></span>';
    controls.append(track, previous, next);
    rail.after(controls);
    let railFrame = 0;
    const updateRail = () => {
      railFrame = 0;
      const max = rail.scrollWidth - rail.clientWidth;
      const progress = max > 0 ? Math.max(0, Math.min(1, rail.scrollLeft / max)) : 1;
      track.style.setProperty('--gallery-progress', progress);
      track.setAttribute('aria-valuenow', String(Math.round(progress * 100)));
      previous.disabled = rail.scrollLeft < 2;
      next.disabled = rail.scrollLeft >= max - 2;
    };
    const queueRail = () => { if (!railFrame) railFrame = requestAnimationFrame(updateRail); };
    [previous, next].forEach((button, index) => button.addEventListener('click', () => {
      const cards = rail.querySelectorAll('.app-screen-card');
      const stride = cards[1].offsetLeft - cards[0].offsetLeft;
      rail.scrollBy({ left: (index ? 1 : -1) * stride, behavior: reducedMotion.matches ? 'instant' : 'smooth' });
    }));
    rail.addEventListener('scroll', queueRail, { passive: true });
    rail.closest('details')?.addEventListener('toggle', queueRail);
    addEventListener('resize', queueRail);
    updateRail();
  }

  document.querySelectorAll('.faq details').forEach((detail) => {
    detail.addEventListener('toggle', () => {
      if (detail.open) react(detail.querySelector('p'), [{ opacity: .25, translate: '0 -5px' }, { opacity: 1, translate: '0 0' }], { duration: 240 });
    });
  });
  const feature = document.querySelector(".editorial-feature");
  const finePointer = matchMedia("(hover: hover) and (pointer: fine)");
  let motionFrame = 0;
  let bounds;
  let x = 0;
  let y = 0;
  const resetScene = () => {
    cancelAnimationFrame(motionFrame);
    motionFrame = 0;
    bounds = null;
    feature?.style.removeProperty("--scene-x");
    feature?.style.removeProperty("--scene-y");
  };
  feature?.addEventListener("pointerenter", () => {
    if (!reducedMotion.matches && finePointer.matches) bounds = feature.getBoundingClientRect();
  });
  feature?.addEventListener("pointermove", (event) => {
    if (reducedMotion.matches || !finePointer.matches) return;
    if (!bounds) bounds = feature.getBoundingClientRect();
    x = Math.max(-1, Math.min(1, (event.clientX - bounds.left) / bounds.width * 2 - 1));
    y = Math.max(-1, Math.min(1, (event.clientY - bounds.top) / bounds.height * 2 - 1));
    if (!motionFrame) motionFrame = requestAnimationFrame(() => {
      feature.style.setProperty("--scene-x", `${x * 14}px`);
      feature.style.setProperty("--scene-y", `${y * 10}px`);
      motionFrame = 0;
    });
  });
  feature?.addEventListener("pointerleave", resetScene);
  addEventListener("resize", resetScene);
  addEventListener("scroll", resetScene, { passive: true });
  const arrivals = new Set();
  if (feature) {
    const arrival = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return;
      if (!reducedMotion.matches) feature.querySelectorAll(".editorial-sticker span").forEach((sticker, index) => {
        const animation = sticker.animate([
          { scale: ".88", rotate: "-5deg" },
          { scale: "1.04", rotate: "2deg", offset: .65 },
          { scale: "1", rotate: "0deg" },
        ], { duration: 620, delay: index * 100, easing: "cubic-bezier(.2,.8,.2,1)" });
        arrivals.add(animation);
        animation.onfinish = () => arrivals.delete(animation);
      });
      arrival.disconnect();
    }, { threshold: .3 });
    arrival.observe(feature);
  }
  reducedMotion.addEventListener("change", () => {
    resetScene();
    if (reducedMotion.matches) {
      reactions.forEach((animation) => animation.cancel());
      reactions.clear();
      arrivals.forEach((animation) => animation.cancel());
      arrivals.clear();
    }
  });
  finePointer.addEventListener("change", resetScene);

  const pricing = document.querySelector(".collector-pricing");
  if (pricing) {
    const billing = pricing.querySelector(".collector-billing");
    const price = pricing.querySelector("[data-plus-price]");
    const period = pricing.querySelector("[data-plus-period]");
    const note = pricing.querySelector("[data-plus-price-note]");
    const options = billing.querySelectorAll("[data-billing-period]");
    options.forEach((button) => {
      button.addEventListener("click", () => {
        if (button.getAttribute('aria-pressed') === 'true') return;
        const yearly = button.dataset.billingPeriod === "yearly";
        options.forEach((option) => option.setAttribute("aria-pressed", String(option === button)));
        price.textContent = yearly ? "$29.99" : "$4.99";
        period.textContent = yearly ? "/ year" : "/ month";
        note.textContent = t(yearly ? 'yearlyNote' : 'monthlyNote');
        react(price, [{ scale: '.92', opacity: .5 }, { scale: '1.04', opacity: 1, offset: .65 }, { scale: '1', opacity: 1 }]);
      });
    });
    billing.hidden = false;
  }

  const screenDialog = document.querySelector("#app-screen-dialog");
  if (screenDialog) {
    const image = screenDialog.querySelector("img");
    const title = screenDialog.querySelector("h2");
    document.querySelectorAll("[data-app-screen]").forEach((button) => {
      button.addEventListener("click", () => {
        const source = button.querySelector("img");
        image.src = source.src;
        image.alt = source.alt;
        title.textContent = button.dataset.appScreen;
        screenDialog.showModal();
        react(screenDialog, [{ opacity: 0, scale: '.94', translate: '0 16px' }, { opacity: 1, scale: '1', translate: '0 0' }], { duration: 320 });
      });
    });
    screenDialog.querySelector("[data-close-screen]").addEventListener("click", () => screenDialog.close());
    screenDialog.addEventListener("click", (event) => {
      if (event.target !== screenDialog) return;
      const bounds = screenDialog.getBoundingClientRect();
      if (event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom) screenDialog.close();
    });
  }

  const chapter = document.querySelector(".midnight-chapter");
  if (!chapter) return;

  let frame = 0;
  const updateNavTheme = () => {
    frame = 0;
    const rect = chapter.getBoundingClientRect();
    document.body.classList.toggle("nav-on-midnight", rect.top <= 92 && rect.bottom >= 92);
  };
  const queueNavTheme = () => {
    if (!frame) frame = requestAnimationFrame(updateNavTheme);
  };

  addEventListener("scroll", queueNavTheme, { passive: true });
  addEventListener("resize", queueNavTheme, { passive: true });
  updateNavTheme();
})();
