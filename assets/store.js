/* The launch destination lives here, and only here.

   While APP_STORE_URL is empty, every "get the app" spot opens a drafted
   email to support@nivolo.app asking for a launch alert. That gives an
   interested visitor a real action without collecting addresses on-site.

   The day the app is available for pre-order or download, paste its App
   Store address between the quotes below. Every launch-alert link then
   becomes the real App Store link and switches to its live label.

   Example:  var APP_STORE_URL = "https://apps.apple.com/app/id0000000000"; */
var APP_STORE_URL = "";
var LAUNCH_ALERT_URL = "mailto:support@nivolo.app?subject=Nivolo%20launch%20alert&body=Please%20email%20me%20when%20Nivolo%20is%20available.%0A";

(function () {
  "use strict";
  var destination = APP_STORE_URL || LAUNCH_ALERT_URL;
  var spots = document.querySelectorAll("[data-store]");
  for (var i = 0; i < spots.length; i++) {
    var soon = spots[i];
    var link = document.createElement("a");
    link.href = destination;
    link.className = soon.className.replace(/\bis-soon\b/, "").replace(/\s+/g, " ").trim();
    while (soon.firstChild) link.appendChild(soon.firstChild);
    // Each spot carries both its pre-launch and App Store labels.
    var label = link.querySelector("[data-live]");
    if (label) label.textContent = label.getAttribute(APP_STORE_URL ? "data-live" : "data-soon");
    soon.parentNode.replaceChild(link, soon);
  }
})();
