(() => {
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
