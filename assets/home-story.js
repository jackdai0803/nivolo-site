(() => {
  const section = document.querySelector('.home-story');
  if (!section) return;
  const copy = {
    en: { another: 'Try another opal', minutes: '15 min', title: 'Small steps add up.', link: 'See how it works ↓', goal: 'Choose a goal', goalBody: 'Pick something you’d love to do, like playing your first song on guitar.', log: 'Log a little practice', logBody: 'Practiced chord changes for 15 minutes? That counts.', keep: 'Keep the opal', keepBody: 'When you can play the song, finish the goal. Its opal is yours to keep.' },
    zh: { another: '换一颗欧泊', minutes: '15 分钟', title: '每一小步，都算数。', link: '看看怎么用 ↓', goal: '选一个目标', goalBody: '从你想做的事开始，比如学会用吉他弹一首歌。', log: '记下今天的练习', logBody: '练了十五分钟换和弦？这就是进步。', keep: '收藏你的欧泊', keepBody: '等你能弹完整首歌，就把目标标为完成，收下属于它的欧泊。' },
  };
  const lang = document.documentElement.lang.startsWith('zh') ? 'zh' : 'en';
  const t = key => copy[lang][key];
  for (const element of document.querySelectorAll('[data-story-copy]')) {
    element.textContent = t(element.dataset.storyCopy);
  }

  const gemButton = section.querySelector('.story-gem-button');
  const gem = gemButton.querySelector('[data-app-opal]');
  let variation = 0;
  gemButton.addEventListener('click', () => {
    variation += 1;
    gem.dispatchEvent(new CustomEvent('gem-variation', { detail: variation }));
    gem.style.setProperty('--gem-hue', (variation * 89 % 360) + 'deg');
  });

  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const poses = [
    ['translateY(6px) rotate(-5deg)', 'translateY(-3px) rotate(2deg)', 'none'],
    ['translateY(8px) rotate(-7deg)', 'translateY(-2px) rotate(-2deg)', 'rotate(-3deg)'],
    ['translateY(7px) rotate(-14deg) scale(.93)', 'translateY(-3px) rotate(-4deg)', 'none'],
  ];
  const art = [...section.querySelectorAll('.story-illustration > *')];
  const observer = new IntersectionObserver(entries => {
    for (const entry of entries) {
      if (!entry.isIntersecting) continue;
      observer.unobserve(entry.target);
      if (!reduced.matches) {
        const index = art.indexOf(entry.target);
        entry.target.animate(poses[index].map(transform => ({ transform })), {
          duration: 780, delay: index * 75, easing: 'ease-in-out',
        });
      }
    }
  }, { threshold: .35 });
  for (const element of art) observer.observe(element);
  reduced.addEventListener('change', () => {
    if (reduced.matches) {
      for (const element of art) element.getAnimations().forEach(animation => animation.cancel());
    }
  });
})();
