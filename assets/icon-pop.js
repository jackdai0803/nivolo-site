/* Icon popup — click any icon in The Collection to inspect it as a solid
   3D tile. Drag to turn it (it stays where you leave it), tap to flip to
   the story on the back. Art loads on demand from assets/icons-3d/:
   512px WebP for 2x screens, the full 1024px master for 3x. */
(function () {
  "use strict";

  var TILE = 220, RADIUS = 49, DEPTH = 24, STEP = 0.4;

  /* ── tint: sample the icon's own edge colour for the slab ── */
  var tintCache = {};
  function tintFor(id, cb) {
    if (tintCache[id]) return cb(tintCache[id]);
    var img = new Image();
    img.onload = function () {
      var N = 28, cv = document.createElement("canvas");
      cv.width = cv.height = N;
      var cx = cv.getContext("2d");
      cx.drawImage(img, 0, 0, N, N);
      var d, bucket = {}, edge = Math.round(N * 0.16);
      try { d = cx.getImageData(0, 0, N, N).data; }
      catch (e) { return cb([43, 52, 70]); }
      for (var y = 0; y < N; y++) for (var x = 0; x < N; x++) {
        if (x >= edge && y >= edge && x < N - edge && y < N - edge) continue;
        var i = (y * N + x) * 4;
        if (d[i + 3] < 200) continue;
        var key = (d[i] >> 4) + "," + (d[i + 1] >> 4) + "," + (d[i + 2] >> 4);
        var b = bucket[key] = bucket[key] || { n: 0, r: 0, g: 0, b: 0 };
        b.n++; b.r += d[i]; b.g += d[i + 1]; b.b += d[i + 2];
      }
      var best = null;
      for (var k in bucket) if (!best || bucket[k].n > best.n) best = bucket[k];
      var c = best
        ? [Math.round(best.r / best.n), Math.round(best.g / best.n), Math.round(best.b / best.n)]
        : [43, 52, 70];
      // near-black edges (Glitch) vanish against the page — lift toward slate
      var peak = Math.max(c[0], c[1], c[2]);
      if (peak < 55) {
        var f = (55 - peak) / 55;
        c = c.map(function (v, i2) { return Math.round(v + ([58, 68, 92][i2] - v) * f * 0.85); });
      }
      tintCache[id] = c;
      cb(c);
    };
    img.onerror = function () { cb([43, 52, 70]); };
    img.src = "assets/icons-3d/" + id + ".webp";
  }
  function mix(c, f) { return "rgb(" + c.map(function (v) { return Math.round(v * f); }).join(",") + ")"; }
  function lift(c, f) { return "rgb(" + c.map(function (v) { return Math.round(v + (255 - v) * f); }).join(",") + ")"; }

  /* ── modal skeleton, built once ── */
  var overlay = document.createElement("div");
  overlay.className = "ipop-overlay";
  overlay.innerHTML =
    '<div class="ipop-dialog" role="dialog" aria-modal="true" aria-label="Icon detail">' +
    '  <button class="ipop-close" type="button" aria-label="Close">&times;</button>' +
    '  <div class="ipop-stage"><div class="ipop-tile">' +
    '    <div class="ipop-face ipop-front"><img alt="" /></div>' +
    '    <div class="ipop-face ipop-back"><div><h3></h3><p></p></div></div>' +
    '  </div></div>' +
    '  <div class="ipop-shadow"></div>' +
    '  <p class="ipop-hint">Drag to turn it over in your hands &middot; tap to flip</p>' +
    "</div>";
  document.body.appendChild(overlay);

  var tile = overlay.querySelector(".ipop-tile");
  var front = overlay.querySelector(".ipop-front");

  // depth as a stack of rounded slices — flat side panels square off the corners
  for (var z = -DEPTH / 2; z <= DEPTH / 2 + 0.001; z += STEP) {
    var s = document.createElement("div");
    s.className = "ipop-slice";
    s.style.transform = "translateZ(" + z.toFixed(2) + "px)";
    tile.insertBefore(s, front);
  }

  /* ── rotation state ── */
  var rx = 0, ry = 0;
  function apply() {
    tile.style.transform = "rotateX(" + rx + "deg) rotateY(" + ry + "deg)";
  }

  var down = false, moved = false, sx = 0, sy = 0, baseX = 0, baseY = 0;
  function pt(e) { return e.touches ? e.touches[0] : e; }
  function start(e) {
    down = true; moved = false;
    var p = pt(e);
    sx = p.clientX; sy = p.clientY; baseX = rx; baseY = ry;
    tile.classList.add("dragging");
    if (!e.touches) e.preventDefault();
  }
  function move(e) {
    if (!down) return;
    var p = pt(e);
    var dx = p.clientX - sx, dy = p.clientY - sy;
    if (Math.abs(dx) > 4 || Math.abs(dy) > 4) moved = true;
    ry = baseY + dx * 0.6;
    rx = Math.max(-70, Math.min(70, baseX - dy * 0.6));
    apply();
    if (e.cancelable) e.preventDefault();
  }
  function end() {
    if (!down) return;
    down = false;
    tile.classList.remove("dragging");
    var nearest = Math.round(ry / 180) * 180;
    var offBy = Math.abs(ry - nearest);
    if (!moved) {
      // tap: land on a face, never the edge — square-on flips over,
      // side-on goes to whichever face is closest
      ry = offBy < 45 ? nearest + 180 : nearest;
      rx = 0;
    } else if (offBy > 68) {
      // never rest edge-on: the slab degenerates to hairlines there
      ry = nearest;
    }
    apply();
  }
  tile.addEventListener("mousedown", start);
  window.addEventListener("mousemove", move);
  window.addEventListener("mouseup", end);
  tile.addEventListener("touchstart", start, { passive: true });
  tile.addEventListener("touchmove", move, { passive: false });
  tile.addEventListener("touchend", end);
  tile.addEventListener("dragstart", function (e) { e.preventDefault(); });

  /* ── open / close ── */
  var lastFocus = null;
  function openFor(id, name, story) {
    var img = front.querySelector("img");
    img.src = "assets/icons-3d/" + id + ".webp";
    img.srcset = "assets/icons-3d/" + id + ".webp 512w, assets/icons-3d/" + id + "-lg.webp 1024w";
    img.sizes = TILE + "px";
    overlay.querySelector(".ipop-back h3").textContent = name;
    overlay.querySelector(".ipop-back p").textContent = story;
    tintFor(id, function (c) {
      tile.style.setProperty("--tint-dark", mix(c, 0.62));
      tile.style.setProperty("--tint-deep", mix(c, 0.30));
      tile.style.setProperty("--tint-edge", "rgba(" + c.join(",") + ",.55)");
      tile.style.setProperty("--tint-lite", lift(c, 0.62));
    });
    rx = 0; ry = 0; apply();
    lastFocus = document.activeElement;
    overlay.classList.add("open");
    document.body.classList.add("ipop-lock");
    overlay.querySelector(".ipop-close").focus();
  }
  function close() {
    overlay.classList.remove("open");
    document.body.classList.remove("ipop-lock");
    if (lastFocus && lastFocus.focus) lastFocus.focus();
  }
  overlay.addEventListener("click", function (e) { if (e.target === overlay) close(); });
  overlay.querySelector(".ipop-close").addEventListener("click", close);
  window.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && overlay.classList.contains("open")) close();
  });

  /* ── wire up the collection ── */
  var items = document.querySelectorAll(
    "#collection .lore-card, #collection .lore-mini li:not(.lore-mini--soon)"
  );
  Array.prototype.forEach.call(items, function (el) {
    var img = el.querySelector("img");
    var head = el.querySelector("h4, h5");
    var para = el.querySelector("p");
    if (!img || !head || !para) return;
    var m = (img.getAttribute("src") || "").match(/([a-z_]+)\.png$/);
    if (!m) return;
    var id = m[1];
    el.classList.add("ipop-source");
    el.setAttribute("tabindex", "0");
    el.setAttribute("role", "button");
    el.setAttribute("aria-label", "View " + head.textContent + " up close");
    function go() { openFor(id, head.textContent, para.textContent); }
    el.addEventListener("click", go);
    el.addEventListener("keydown", function (e) {
      if (e.key === "Enter" || e.key === " ") { e.preventDefault(); go(); }
    });
  });
})();
