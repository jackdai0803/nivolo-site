(() => {
  const reducedMotion = matchMedia("(prefers-reduced-motion: reduce)");
  const card = document.querySelector(".collector-plan--plus");
  const art = card?.querySelector(".collector-art--plus");
  const strip = art?.querySelector(".plus-reel-strip");
  if (!strip || reducedMotion.matches) return;
  let started = false;
  let visible = false;
  let timer;
  const finish = () => {
    visible = false;
    observer.disconnect();
    clearTimeout(timer);
    card.classList.remove("is-showing-reel");
    reducedMotion.removeEventListener("change", finish);
    document.removeEventListener("visibilitychange", onVisibility);
    card.removeEventListener("focusin", finish);
  };
  const onVisibility = () => { if (document.hidden) finish(); };
  const observer = new IntersectionObserver(async ([entry]) => {
    visible = entry.isIntersecting && entry.intersectionRatio >= .5;
    if (!visible) { if (started) finish(); return; }
    if (started || document.hidden || reducedMotion.matches) return;
    started = true;
    strip.src = strip.dataset.src;
    try { await strip.decode(); } catch { finish(); return; }
    if (!visible || card.contains(document.activeElement)) { finish(); return; }
    card.classList.add("is-showing-reel");
    strip.classList.add("is-playing");
    // An interrupted or disabled CSS animation must always give the offer back.
    timer = setTimeout(finish, 4000);
  }, { threshold: [0, .5] });
  strip.addEventListener("animationend", () => {
    if (!visible) return;
    clearTimeout(timer);
    timer = setTimeout(finish, 520);
  }, { once: true });
  card.addEventListener("focusin", finish);
  reducedMotion.addEventListener("change", finish);
  document.addEventListener("visibilitychange", onVisibility);
  observer.observe(art);
})();
