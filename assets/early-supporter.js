(function () {
  "use strict";
  var label = document.querySelector("[data-supporter-count]");
  if (!label) return;
  var inFlight = false;
  async function refresh() {
    if (document.visibilityState === "hidden" || inFlight) return;
    inFlight = true;
    var controller = new AbortController();
    var timeout = setTimeout(function () { controller.abort(); }, 8000);
    try {
      var response = await fetch("/api/early-supporter/status", { cache: "no-store", signal: controller.signal });
      var count = await response.json();
      if (!response.ok || count.limit !== 20 || !Number.isInteger(count.claimed) || count.claimed < 0 || count.claimed > 20) throw new Error("invalid_count");
      label.textContent = count.claimed + " of 20 own this icon";
      if (count.claimed === 20) label.textContent += " · All have found a home";
    } catch {
      label.textContent = "Owner count is temporarily unavailable";
    } finally { clearTimeout(timeout); inFlight = false; }
  }
  refresh();
  setInterval(refresh, 30000);
  document.addEventListener("visibilitychange", refresh);
  window.addEventListener("online", refresh);
})();
