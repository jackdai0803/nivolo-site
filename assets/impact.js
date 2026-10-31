(() => {
  const section = document.querySelector('.small-impact');
  if (!section) return;
  const copy = {
    en: {
      kicker: 'A LITTLE, OFTEN.', title: 'Small starts. Meaningful progress.',
      body: 'For that thing you keep meaning to start.',
      daily: 'minutes a day', dailyNote: 'A little room to begin.',
      monthly: 'minutes a month', monthlyNote: 'Small steps, adding up.',
      yearly: 'hours a year', yearlyNote: 'For something that matters.',
      basis: 'Imagine setting aside 5 minutes every day. Based on a 30-day month and a 365-day year.',
      summary: 'Five minutes a day adds up to 150 minutes in a 30-day month and over 30 hours in a year.',
    },
    zh: {
      kicker: '每次一点，慢慢积累。', title: '从小小开始，到实在的进步。',
      body: '为那件你一直想开始的事。',
      daily: '分钟，每一天', dailyNote: '留一点时间，迈出第一步。',
      monthly: '分钟，每个月', monthlyNote: '一小步一小步，慢慢积累。',
      yearly: '小时，每一年', yearlyNote: '留给真正重要的事。',
      basis: '想象每天留出 5 分钟。按每月 30 天、每年 365 天计算。',
      summary: '每天五分钟，按每月三十天计算，每月累计一百五十分钟，一年超过三十小时。',
    },
  };
  const t = (key) => copy[document.documentElement.lang.startsWith('zh') ? 'zh' : 'en'][key];
  section.querySelectorAll('[data-impact-copy]').forEach((element) => {
    element.textContent = t(element.dataset.impactCopy);
  });
  const motion = matchMedia('(prefers-reduced-motion: reduce)');
  const stage = section.querySelector('.small-impact-stage');
  const stats = [...section.querySelectorAll('.small-impact-stat')];
  const summary = document.createElement('p');
  summary.className = 'small-impact-accessible';
  summary.textContent = t('summary');
  stage.append(summary);
  let top = 0;
  let travel = 1;
  let current = -1;
  let frame = 0;
  let measureNeeded = true;
  const animations = new Set();
  const tracks = [];
  // Each incoming figure rolls once, then stays still until the next scroll beat.
  stats.forEach((stat, group) => {
    const number = stat.querySelector('[data-impact-number]');
    const plus = number.querySelector('.small-impact-plus');
    const accessible = document.createElement('span');
    accessible.className = 'small-impact-accessible';
    accessible.textContent = number.textContent;
    number.replaceChildren(accessible);
    [...number.dataset.impactNumber].forEach((digit, column) => {
      const reel = document.createElement('span');
      reel.className = 'small-impact-reel';
      reel.setAttribute('aria-hidden', 'true');
      const track = document.createElement('span');
      track.className = 'small-impact-track';
      for (let i = 0; i <= 10; i++) {
        const face = document.createElement('span');
        face.textContent = String((Number(digit) + i) % 10);
        track.append(face);
      }
      reel.append(track);
      number.append(reel);
      tracks.push({ track, group, column });
    });
    if (plus) { plus.setAttribute('aria-hidden', 'true'); number.append(plus); }
  });
  const stop = () => {
    animations.forEach((animation) => animation.cancel());
    animations.clear();
  };
  const show = (index, roll) => {
    if (index === current) return;
    stop();
    current = index;
    stats.forEach((stat, i) => stat.classList.toggle('is-current', i === index));
    if (!roll || !Element.prototype.animate) return;
    tracks.filter((item) => item.group === index).forEach(({ track, column }) => {
      const animation = track.animate([
        { transform: 'translateY(0)' }, { transform: 'translateY(-90.9090909%)' },
      ], { duration: 1100, delay: column * 70, easing: 'cubic-bezier(.2,.7,.15,1)' });
      animations.add(animation);
      animation.onfinish = () => { animations.delete(animation); animation.cancel(); };
    });
  };
  const update = () => {
    frame = 0;
    if (motion.matches) return;
    if (measureNeeded) {
      top = section.getBoundingClientRect().top + window.scrollY;
      travel = Math.max(1, section.offsetHeight - stage.offsetHeight);
      measureNeeded = false;
    }
    const stickyTop = 100;
    const progress = Math.max(0, Math.min(1, (window.scrollY + stickyTop - top) / travel));
    const index = Math.min(2, Math.floor(progress * 3));
    const inView = window.scrollY + window.innerHeight > top && window.scrollY < top + section.offsetHeight;
    if (inView) show(index, !document.hidden);
  };
  const schedule = () => { if (!frame) frame = requestAnimationFrame(update); };
  const measure = () => { measureNeeded = true; schedule(); };
  const configure = () => {
    stop();
    section.classList.toggle('is-scroll-story', !motion.matches);
    summary.hidden = motion.matches;
    stats.forEach((stat, index) => {
      stat.classList.toggle('is-current', index === 0);
      if (motion.matches) stat.removeAttribute('aria-hidden');
      else stat.setAttribute('aria-hidden', 'true');
    });
    current = -1;
    measure();
  };
  window.addEventListener('scroll', schedule, { passive: true });
  window.addEventListener('resize', measure);
  window.addEventListener('load', measure, { once: true });
  document.fonts?.ready.then(measure);
  motion.addEventListener('change', configure);
  document.addEventListener('visibilitychange', () => { if (document.hidden) stop(); else schedule(); });
  configure();
})();
