(() => {
  const reducedMotion = matchMedia("(prefers-reduced-motion: reduce)");
  const card = document.querySelector(".collector-plan--plus");
  const art = card?.querySelector(".collector-art--plus");
  const dive = art?.querySelector(".collector-dive");
  if (!dive || reducedMotion.matches) return;
  let started = false;
  let visible = false;
  let timer;
  const finish = () => {
    visible = false;
    observer.disconnect();
    clearTimeout(timer);
    dive.hidden = true;
    card.classList.remove("is-showing-dive");
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
    try {
      await Promise.all([...dive.querySelectorAll("img")].map(image => {
        image.src = image.dataset.src;
        return image.decode();
      }));
    } catch { finish(); return; }
    if (!visible || card.contains(document.activeElement)) { finish(); return; }
    card.classList.add("is-showing-dive");
    dive.hidden = false;
    // An interrupted or disabled CSS animation must always give the offer back.
    timer = setTimeout(finish, 3200);
  }, { threshold: [0, .5] });
  dive.addEventListener("animationend", event => {
    if (event.target === dive && event.animationName === "plusDiveCurtain") finish();
  });
  card.addEventListener("focusin", finish);
  reducedMotion.addEventListener("change", finish);
  document.addEventListener("visibilitychange", onVisibility);
  observer.observe(art);
})();
