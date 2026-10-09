/* The App Store link lives here, and only here.

   While APP_STORE_URL is empty, every "get the app" spot on the site is a
   "coming soon" badge with nothing to press. That is how the pages are
   written, so until launch this file does nothing at all.

   The day the app is live, paste its App Store address between the quotes
   below. Each badge then becomes the real link again, with its real label.
   Nothing else needs editing.

   Example:  var APP_STORE_URL = "https://apps.apple.com/app/id0000000000"; */
var APP_STORE_URL = "";

(function () {
  "use strict";
  if (!APP_STORE_URL) return;
  var spots = document.querySelectorAll("[data-store]");
  for (var i = 0; i < spots.length; i++) {
    var soon = spots[i];
    var link = document.createElement("a");
    link.href = APP_STORE_URL;
    link.className = soon.className.replace(/\bis-soon\b/, "").replace(/\s+/g, " ").trim();
    while (soon.firstChild) link.appendChild(soon.firstChild);
    // Each spot carries the label it wears once it is a link.
    var label = link.querySelector("[data-live]");
    if (label) label.textContent = label.getAttribute("data-live");
    soon.parentNode.replaceChild(link, soon);
  }
})();
