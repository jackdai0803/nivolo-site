(() => {
  const film = document.querySelector('.home-film');
  const video = film.querySelector('video');
  const cover = film.querySelector('.film-cover');
  const action = cover.querySelector('[data-film-action]');
  const link = document.querySelector('[data-film-link]');
  const phone = matchMedia('(max-width: 600px)');
  const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
  let inView = false;
  let autoPlayPending = true;
  const lang = document.documentElement.lang.startsWith('zh') ? 'zh' : 'en';
  const copy = {
    en: { link: 'Watch the film ↓', play: 'Play film', replay: 'Replay film', title: 'Nivolo in nine seconds', description: 'Nivo shows how to choose a goal, log progress, and collect an opal.' },
    zh: { link: '观看短片 ↓', play: '播放短片', replay: '重播短片', title: '用九秒认识 Nivolo', description: '跟着 Nivo 选择目标、记录进度，并在完成目标后收藏欧泊。' },
  };
  const t = key => copy[lang][key];

  function selectFilm() {
    const format = phone.matches ? 'tall' : 'wide';
    if (film.dataset.format === format) return;
    const base = 'assets/home-film/' + format + '-' + lang;
    film.dataset.format = format;
    video.poster = base + '.webp';
    video.src = base + '.mp4';
  }

  function showCover(replay) {
    selectFilm();
    video.controls = false;
    cover.hidden = false;
    action.textContent = t(replay ? 'replay' : 'play');
  }

  function playFilm() {
    autoPlayPending = false;
    cover.hidden = true;
    video.controls = true;
    if (video.ended) video.currentTime = 0;
    video.play().catch(() => {
      if (video.paused && !video.error && !autoPlayPending) showCover(false);
    });
  }

  link.textContent = t('link');
  film.setAttribute('aria-label', t('title'));
  video.setAttribute('aria-label', t('description'));
  cover.addEventListener('click', playFilm);
  link.addEventListener('click', playFilm);
  video.addEventListener('ended', () => {
    video.load();
    showCover(true);
  });
  phone.addEventListener('change', () => {
    if (!cover.hidden) selectFilm();
  });
  function updatePlayback() {
    if (!inView || document.hidden) {
      if (!video.paused) {
        autoPlayPending = true;
        video.pause();
      }
    } else if (autoPlayPending && !reducedMotion.matches) {
      playFilm();
    }
  }

  showCover(false);
  document.addEventListener('visibilitychange', updatePlayback);
  reducedMotion.addEventListener('change', () => {
    if (reducedMotion.matches) video.pause();
    else updatePlayback();
  });
  new IntersectionObserver(([entry]) => {
    inView = entry.isIntersecting;
    updatePlayback();
  }).observe(film);
})();
