(() => {
  // A few short reactions keep the opening playful without a permanent loop.
  const reducedMotion = matchMedia("(prefers-reduced-motion: reduce)");
  const copy = {
    en: { goal: 'Preview a new goal', action: 'Preview logging an action', gem: 'See another gem version', gemHint: 'Tap to see another version', previous: 'Previous app screen', next: 'Next app screen', browse: 'Browse app screens', progress: 'Progress through app screenshots' },
    zh: { goal: '预览新目标', action: '预览记录行动', gem: '查看另一款宝石', gemHint: '轻点，看看另一款宝石', previous: '上一张应用截图', next: '下一张应用截图', browse: '浏览应用截图', progress: '应用截图浏览进度' },
  };
  const t = (key) => copy[document.documentElement.lang.startsWith('zh') ? 'zh' : 'en'][key];
  Object.assign(copy.en, {
    repairStory: 'A little bandage for a busy life. A streak freeze kept your place.',
    pearlName: "Pearl",
    pearlStory: "Fifty days of showing up. A little pearl, with all that quiet effort inside.",
    goalPlanning: "Name what matters and choose your next small steps. With Plus, Nivo can draft a plan to help you begin.",
    languages: "14 languages, including English and 简体中文",
    personalLooks: "Matching Nivo looks, app icons and home colours",
    reminders: "Weekly reminders on the days and times you choose",
    goalReminders: 'Weekly reminders for each goal, on the days and at the time you choose',
    reminderQuestion: 'Can I choose when Nivolo reminds me?',
    reminderAnswer: 'Yes. Set a daily check-in and separate weekly schedules for up to six goals. Nivolo stops reminders for a goal when you finish it. Manage notifications any time in Settings.',
    plusFlowers: "White Lotus, Tree Peony and Red Spider Lily editions",
    auroraFlame: "An exclusive Aurora streak flame",
    freeAnswer: "Yes, and there are no ads. Every core habit feature — unlimited goals, streaks, freezes, rest days, Krill, gems, Season in Review and the widget — is free. Nivolo Plus adds AI planning and insights, double Krill, Deep-Sea and three Plus flower editions, and a daily freeze. Achievement icons stay earned through progress; Krill keepsakes stay yours once unlocked.",

    featuredIcons: 'The Elements Collection',
    featuredIconsIntro: 'Jade, porcelain, gold, and pearl. Find your favourite finish.',
    featuredIconsNote: 'Unlock Porcelain, Jade, and Kintsugi with Krill. Earn Pearl with a 50-day streak.',
    pearlCard: 'A soft shimmer. A little pearl to treasure.', pearlUnlock: '50-day streak',
    pearlAlt: 'Nivo with pearlescent colours and an open shell holding a pearl',
    porcelainName: 'Porcelain', porcelainCard: 'Blue glaze, painted blossoms, and a pink bloom.',
    porcelainAlt: 'Nivo with a blue glaze, a pink flower, and painted blue blossoms',
    jadeName: 'Jade', jadeCard: 'A little dragon carved from jade.',
    jadeAlt: 'Nivo as a jade dragon with rounded horns and a curled tail',
    kintsugiName: 'Kintsugi', kintsugiCard: 'Every golden line is part of the story.',
    kintsugiAlt: 'Nivo on charcoal with gold repair lines',
    deepseaName: 'Deep-Sea', deepseaCard: 'A familiar face. A little ocean light.',
    deepseaMembership: 'Included with Nivolo Plus', deepseaBenefit: 'Exclusive Deep-Sea app icon',
    deepseaAlt: 'Nivo’s face glowing cyan and violet against midnight blue',
    deepseaCaption: 'Meet Deep-Sea Nivo. Give the app an ocean glow with matching backgrounds, Krill, an app icon, and a widget.',

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
    yearlyNote: 'About $4.17/month · billed yearly · USD · Final price shown in the App Store', monthlyNote: 'Or $49.99 a year (about $4.17/month) · USD · Final price shown in the App Store',
  });
  Object.assign(copy.zh, {
    repairStory: '为忙碌的生活贴上一块小绷带。一次冻结，守住了你的坚持。',
    pearlName: "珍珠",
    pearlStory: "坚持了五十天。一颗小珍珠，藏着每一天安静的努力。",
    goalPlanning: "写下在意的目标，选好接下来的一小步。Plus 中的 Nivo 还能帮你起草计划。",
    languages: "支持包括英语、简体中文在内的 14 种语言",
    personalLooks: "相配的 Nivo 外观、应用图标和主屏幕配色",
    reminders: "按你选择的日期和时间，每周提醒",
    goalReminders: '为每个目标选择每周提醒的日期和时间',
    reminderQuestion: '我可以选择 Nivolo 提醒我的时间吗？',
    reminderAnswer: '可以。你可以设置每日打卡提醒，并为最多六个目标分别安排每周提醒。完成目标后，Nivolo 会停止该目标的提醒。你可以随时在设置中管理通知。',
    plusFlowers: "白荷、牡丹与彼岸花系列",
    auroraFlame: "专属极光连续记录火焰",
    freeAnswer: "是的，而且没有广告。无限目标、连续记录、冻结、休息日、磷虾、宝石、时光回顾和小组件等核心功能均免费。Nivolo Plus 提供 AI 计划与洞察、双倍磷虾、深海与三款 Plus 花卉外观，以及每日冻结。成就图标仍需通过进步获得；用磷虾解锁的珍藏永久属于你。",

    featuredIcons: '元素系列',
    featuredIconsIntro: '翡翠、瓷器、黄金与珍珠。找到你喜欢的质感。',
    featuredIconsNote: '用磷虾解锁青花瓷、翡翠和金缮。连续记录 50 天，赢得珍珠。',
    pearlCard: '柔和的微光，一颗值得珍藏的小珍珠。', pearlUnlock: '连续记录 50 天',
    pearlAlt: '珠光色的 Nivo，身旁有一枚含着珍珠的贝壳',
    porcelainName: '青花瓷', porcelainCard: '一抹蓝釉，几朵青花，再点缀一朵粉花。',
    porcelainAlt: '蓝釉 Nivo，点缀粉花与青花纹样',
    jadeName: '翡翠', jadeCard: '一只用翡翠雕成的小龙。',
    jadeAlt: '圆圆的龙角、轻卷的尾巴，翡翠小龙 Nivo',
    kintsugiName: '金缮', kintsugiCard: '每一道金色修补，都是故事的一部分。',
    kintsugiAlt: '炭黑底色上的 Nivo，点缀金色修补纹',
    deepseaName: '深海', deepseaCard: '熟悉的小脸，点亮一片海。',
    deepseaMembership: 'Nivolo Plus 专属', deepseaBenefit: '深海专属应用图标',
    deepseaAlt: '午夜蓝背景中，Nivo 的小脸泛着青色和紫色的光',
    deepseaCaption: '认识深海 Nivo。让海洋微光点亮应用背景、磷虾、应用图标和小组件。',

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
    yearlyNote: '约每月 $4.17 · 按年计费 · 美元 · 最终价格以 App Store 为准', monthlyNote: '或每年 $49.99（约每月 $4.17）· 美元 · 最终价格以 App Store 为准',
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

  // Screens stay illustrative; only the gem responds to taps.
  document.querySelectorAll('.step-art').forEach((art, index) => {
    if (index < 2) return;
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
    else {
      const gem = button.querySelector('[data-app-opal]');
      const hint = button.querySelector('.step-gem-label small');
      hint.textContent = t('gemHint');
      hint.classList.add('step-gem-hint');
      let version = 0;
      let hue = 0;
      button.addEventListener('click', () => {
        // Always move far enough around the colour wheel to visibly change,
        // including taps that arrive before the previous animation finishes.
        hue = (hue + 75 + Math.random() * 50) % 360;
        version += 1;
        gem.dispatchEvent(new CustomEvent('gem-variation', { detail: version }));
        gem.style.setProperty('--gem-hue', `${hue}deg`);
        gem.style.setProperty('--gem-saturation', String([.78, 1.08, .9][version % 3]));
        gem.dataset.gemVersion = String(version);
        react(gem, [
          { rotate: '0deg', scale: '1' },
          { rotate: '-8deg', scale: '.94', offset: .25 },
          { rotate: '0deg', scale: '1' },
        ], { duration: 320 });
        button.querySelectorAll('.step-spark').forEach((spark) => react(spark, [
          { scale: '1', opacity: .65 }, { scale: '1.7', opacity: 1, offset: .5 }, { scale: '1', opacity: .65 },
        ], { duration: 700 }));
        // Artwork and colour still change when reduced motion is enabled.
        button.classList.toggle('is-polished');
      });
    }
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
        price.textContent = yearly ? "$49.99" : "$7.99";
        period.textContent = yearly ? "/ year" : "/ month";
        note.textContent = t(yearly ? 'yearlyNote' : 'monthlyNote');
        react(price, [{ scale: '.92', opacity: .5 }, { scale: '1.04', opacity: 1, offset: .65 }, { scale: '1', opacity: 1 }]);
      });
    });
    billing.hidden = false;
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
