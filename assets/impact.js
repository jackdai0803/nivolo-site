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
      pause: 'Pause motion', play: 'Play motion',
    },
    zh: {
      kicker: '每次一点，慢慢积累。', title: '从小小开始，到实在的进步。',
      body: '为那件你一直想开始的事。',
      daily: '分钟，每一天', dailyNote: '留一点时间，迈出第一步。',
      monthly: '分钟，每个月', monthlyNote: '一小步一小步，慢慢积累。',
      yearly: '小时，每一年', yearlyNote: '留给真正重要的事。',
      basis: '想象每天留出 5 分钟。按每月 30 天、每年 365 天计算。',
      pause: '暂停动画', play: '播放动画',
    },
  };
  const t = (key) => copy[document.documentElement.lang.startsWith('zh') ? 'zh' : 'en'][key];
  section.querySelectorAll('[data-impact-copy]').forEach((element) => {
    element.textContent = t(element.dataset.impactCopy);
  });
  const motion = matchMedia('(prefers-reduced-motion: reduce)');
  const toggle = section.querySelector('.small-impact-toggle');
  const numbers = [...section.querySelectorAll('[data-impact-number]')];
  const tracks = [];
  // Keep the final value available to assistive technology throughout each roll.
  numbers.forEach((number, group) => {
    const accessible = document.createElement('span');
    accessible.className = 'small-impact-accessible';
    accessible.textContent = number.textContent;
    const plus = number.querySelector('.small-impact-plus');
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
      tracks.push({ track, delay: group * 360 + column * 85 });
    });
    if (plus) { plus.setAttribute('aria-hidden', 'true'); number.append(plus); }
  });
  if (!Element.prototype.animate || !('IntersectionObserver' in window)) return;
  let visible = false;
  let paused = false;
  let timer;
  const animations = new Set();
  const animate = (element, frames, options) => {
    const animation = element.animate(frames, options);
    animations.add(animation);
    animation.onfinish = () => { animations.delete(animation); animation.cancel(); };
  };
  const stop = () => {
    clearTimeout(timer);
    animations.forEach((animation) => animation.cancel());
    animations.clear();
  };
  const cycle = () => {
    tracks.forEach(({ track, delay }) => animate(track, [
      { transform: 'translateY(0)' }, { transform: 'translateY(-90.9090909%)' },
    ], { duration: 1450, delay, easing: 'cubic-bezier(.2,.7,.15,1)' }));
    numbers.forEach((number, i) => animate(number, [
      { color: '#173d52' }, { color: '#397fa0', offset: .45 }, { color: '#173d52' },
    ], { duration: 1200, delay: i * 360 + 650, easing: 'ease-in-out' }));
    timer = setTimeout(cycle, 7500);
  };
  const sync = () => {
    stop();
    toggle.hidden = motion.matches;
    toggle.querySelector('[data-impact-toggle-label]').textContent = t(paused ? 'play' : 'pause');
    toggle.querySelector('[data-impact-toggle-icon]').textContent = paused ? '▶' : 'Ⅱ';
    if (visible && !paused && !motion.matches && !document.hidden) cycle();
  };
  toggle.addEventListener('click', () => { paused = !paused; sync(); });
  motion.addEventListener('change', sync);
  document.addEventListener('visibilitychange', sync);
  new IntersectionObserver(([entry]) => {
    visible = entry.isIntersecting;
    sync();
  }, { threshold: .15 }).observe(section);
  sync();
})();
