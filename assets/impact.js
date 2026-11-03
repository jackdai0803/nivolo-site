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
  let frame = 0;
  let measureNeeded = true;
  const clamp = (value) => Math.max(0, Math.min(1, value));
  const ease = (value) => { const p = clamp(value); return p * p * (3 - 2 * p); };
  // Scroll controls the fade itself. Holding still holds the exact same frame;
  // reversing the gesture retraces it, with no timed digit spin to finish.
  const paint = (progress) => {
    const opacity = [1, 0, 0];
    const transitions = [[0.28, 0.40], [0.62, 0.74]];
    transitions.forEach(([start, end], index) => {
      if (progress < start) return;
      const phase = clamp((progress - start) / (end - start));
      opacity[index] = 1 - ease(phase / 0.55);
      opacity[index + 1] = ease((phase - 0.45) / 0.55);
    });
    stats.forEach((stat, index) => {
      stat.style.opacity = String(opacity[index]);
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
    const inView = window.scrollY + window.innerHeight > top && window.scrollY < top + section.offsetHeight;
    if (inView) paint(progress);
  };
  const schedule = () => { if (!frame) frame = requestAnimationFrame(update); };
  const measure = () => { measureNeeded = true; schedule(); };
  const configure = () => {
    section.classList.toggle('is-scroll-story', !motion.matches);
    summary.hidden = motion.matches;
    stats.forEach((stat, index) => {
      stat.style.opacity = motion.matches ? '' : String(index === 0 ? 1 : 0);
      if (motion.matches) stat.removeAttribute('aria-hidden');
      else stat.setAttribute('aria-hidden', 'true');
    });
    measure();
  };
  window.addEventListener('scroll', schedule, { passive: true });
  window.addEventListener('resize', measure);
  window.addEventListener('load', measure, { once: true });
  document.fonts?.ready.then(measure);
  motion.addEventListener('change', configure);
  document.addEventListener('visibilitychange', () => { if (!document.hidden) measure(); });
  configure();
})();
