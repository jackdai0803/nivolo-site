(() => {
  // A few short reactions keep the opening playful without a permanent loop.
  const reducedMotion = matchMedia("(prefers-reduced-motion: reduce)");
  const lockup = document.querySelector(".editorial-lockup");
  const mascot = lockup?.querySelector(".editorial-lockup-mark");
  let greeting;
  const greet = () => {
    if (!mascot || reducedMotion.matches || greeting?.playState === "running") return;
    greeting = mascot.animate([
      { translate: "0 0", rotate: "0deg", scale: "1" },
      { translate: "0 3px", rotate: "-7deg", scale: "1.08 .92", offset: .18 },
      { translate: "0 -12px", rotate: "8deg", scale: ".96 1.04", offset: .46 },
      { translate: "0 1px", rotate: "-3deg", scale: "1.03 .97", offset: .76 },
      { translate: "0 0", rotate: "0deg", scale: "1" },
    ], { duration: 680, easing: "ease-out" });
  };
  lockup?.addEventListener("pointerenter", greet);

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
      greeting?.cancel();
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
        const yearly = button.dataset.billingPeriod === "yearly";
        options.forEach((option) => option.setAttribute("aria-pressed", String(option === button)));
        price.textContent = yearly ? "$29.99" : "$4.99";
        period.textContent = yearly ? "/ year" : "/ month";
        note.textContent = yearly
          ? "About $2.50/month · billed yearly · USD"
          : "Or $29.99 a year · save 50% · USD";
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
