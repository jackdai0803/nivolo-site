/* Frost — the rare end of the collection starts frozen in.
   Jack's torch idea, turned round to fit the brand. In Nivolo ice is the
   thing that protects you (the streak freeze, "habits that hold"), and a
   melting face is a streak that nearly went, so nothing here burns. The
   visitor's own warmth thaws the shelf: a cursor that lingers, a finger
   held on the glass, a tap on one icon. That is how these icons unlock in
   the app too, by showing up. What melts stays melted.

   Only this shelf is frozen. Headlines, features and pricing are never
   behind it, because nothing a visitor needs in order to decide should be,
   and a phone has no cursor to hover with. The content stays in the DOM
   the whole time, so screen readers and search see all of it; the ice is
   a canvas on top, aria-hidden. Reduced motion, or no canvas: no ice. */
(function () {
  "use strict";

  var pane = document.getElementById("frost");
  var list = pane && pane.querySelector(".lore-mini");
  var items = list ? Array.prototype.slice.call(list.children) : [];
  if (!items.length) return;
  if (window.matchMedia && matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  var ice = document.createElement("canvas");
  var fx = document.createElement("canvas");
  var ctx = ice.getContext && ice.getContext("2d");
  var fxc = fx.getContext && fx.getContext("2d");
  if (!ctx || !fxc) return;

  var FINE = !!(window.matchMedia && matchMedia("(hover: hover) and (pointer: fine)").matches);
  var hint = document.querySelector("[data-frost-hint]");
  var copy = {
    en: { hint: "Tap an ice block to reveal an icon. Tap again to explore its world.", all: "Thaw all", count: "{n} of {total} revealed", done: "All {total} revealed. Discover how to earn them in the app." },
    zh: { hint: "轻点冰块，揭晓图标。再次轻点，探索它的世界。", all: "全部融化", count: "已揭晓 {n} / {total}", done: "已揭晓全部 {total} 个。在 App 中发现它们的解锁方式。" }
  };
  function t(key) {
    return copy[document.documentElement.lang.indexOf("zh") === 0 ? "zh" : "en"][key]
      .replace("{n}", thawedCount).replace("{total}", items.length);
  }
  if (hint) hint.textContent = t("hint");
  var RADIUS = 20;               // the pane's corner, matches .frost (--radius) in styles.css
  var CELL = 10;                 // coverage grid, CSS px per cell
  var BRUSH = FINE ? 58 : 50;    // radius of the warmth
  var FX_M = 72;                 // the fx canvas overhangs the ice so the torch
                                 // isn't sliced off at the pane's edge
  var THAW_AT = 0.62;            // an icon lets go once ~40% of its ice is gone —
                                 // by then it already looks clear to the eye

  var dpr = 1, W = 0, H = 0, lastW = 0;
  var cells = null, cols = 0, rows = 0;
  var state = items.map(function () { return { thawed: false, rect: null, img: null, lines: [] }; });
  var thawedCount = 0, touched = false, done = false;

  ice.className = "frost-ice";
  fx.className = "frost-fx";
  ice.setAttribute("aria-hidden", "true");
  fx.setAttribute("aria-hidden", "true");
  pane.appendChild(ice);
  pane.appendChild(fx);
  pane.classList.add("is-frozen");
  // A mouse gets the torch as its cursor, over the ice only. Phones keep
  // the finger as the warmth — a torch drawn under a fingertip is hidden.
  if (FINE) pane.classList.add("has-torch");
  // The torch is the cursor, so it lives where a cursor does: a small
  // fixed canvas on <body>, above every section, icon and stacking
  // context on the page. Drawn inside the pane it could be painted over.
  var TW = 92, TH = 104, HX = 36, HY = 46; // canvas size, hotspot (flame) inside it
  var tcv = null, tctx = null;
  if (FINE) {
    tcv = document.createElement("canvas");
    tcv.className = "frost-torch";
    tcv.setAttribute("aria-hidden", "true");
    tctx = tcv.getContext("2d");
    document.body.appendChild(tcv);
  }

  // Status line above the ice: a count, and a way past it for anyone who
  // would rather just read.
  var bar = document.createElement("div");
  bar.className = "frost-bar";
  bar.innerHTML = '<span class="frost-count"></span><span class="frost-sep" aria-hidden="true"></span>' +
                  '<button type="button" class="frost-all">' + t("all") + '</button>';
  pane.parentNode.insertBefore(bar, pane);
  var countEl = bar.querySelector(".frost-count");
  var allBtn = bar.querySelector(".frost-all");
  countEl.setAttribute("role", "status");

  /* ── Geometry ─────────────────────────────────────────────────────── */

  function measure() {
    var pr = pane.getBoundingClientRect();
    W = Math.round(pr.width);
    H = Math.round(pr.height);
    items.forEach(function (li, i) {
      var s = state[i], r = li.getBoundingClientRect();
      s.rect = { x: r.left - pr.left, y: r.top - pr.top, w: r.width, h: r.height };
      var img = li.querySelector("img");
      if (img) {
        var ir = img.getBoundingClientRect();
        s.img = { el: img, x: ir.left - pr.left, y: ir.top - pr.top, w: ir.width, h: ir.height };
      }
      s.lines = [];
      ["h3", "p"].forEach(function (sel, k) {
        var el = li.querySelector(sel);
        if (!el) return;
        var range = document.createRange();
        range.selectNodeContents(el);
        var rs = range.getClientRects();
        for (var j = 0; j < rs.length; j++) {
          if (rs[j].width < 2) continue;
          s.lines.push({ x: rs[j].left - pr.left, y: rs[j].top - pr.top, w: rs[j].width, h: rs[j].height, head: k === 0 });
        }
      });
    });
  }

  function size() {
    // 1.5 is plenty for frost — it is soft by nature — and a 3x phone was
    // painting four times the pixels to show the same blur.
    dpr = Math.min(1.5, window.devicePixelRatio || 1);
    [[ice, 0], [fx, FX_M]].forEach(function (pair) {
      var c = pair[0], m = pair[1];
      c.width = Math.max(1, Math.round((W + m * 2) * dpr));
      c.height = Math.max(1, Math.round((H + m * 2) * dpr));
      c.style.width = (W + m * 2) + "px";
      c.style.height = (H + m * 2) + "px";
      c.style.left = c.style.top = -m + "px";
    });
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    // fx draws in the same pane coordinates as the ice; the margin is
    // just room to spill over the edge
    fxc.setTransform(dpr, 0, 0, dpr, FX_M * dpr, FX_M * dpr);
    if (tcv) {
      tcv.width = TW * dpr; tcv.height = TH * dpr;
      tcv.style.width = TW + "px"; tcv.style.height = TH + "px";
      tctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }
    cols = Math.ceil(W / CELL);
    rows = Math.ceil(H / CELL);
    cells = new Float32Array(cols * rows);
    for (var k = 0; k < cells.length; k++) cells[k] = 1;
  }

  // Match CSS superellipse(2): |x/r|^4 + |y/r|^4 = 1.
  // Cache one quarter so animation frames only scale/translate its points.
  var cornerPoints = [];
  for (var sample = 0; sample <= 24; sample++) {
    var angle = sample / 24 * Math.PI / 2;
    cornerPoints.push([Math.sqrt(Math.sin(angle)), Math.sqrt(Math.cos(angle))]);
  }
  function continuousRect(c, x, y, w, h, r) {
    r = Math.max(0, Math.min(r, w / 2, h / 2));
    c.beginPath();
    c.moveTo(x + r, y);
    for (var corner = 0; corner < 4; corner++) {
      for (var point = 0; point < cornerPoints.length; point++) {
        var s = cornerPoints[point][0] * r, t = cornerPoints[point][1] * r;
        if (corner === 0) c.lineTo(x + w - r + s, y + r - t);
        else if (corner === 1) c.lineTo(x + w - r + t, y + h - r + s);
        else if (corner === 2) c.lineTo(x + r - s, y + h - r + t);
        else c.lineTo(x + r - t, y + r - s);
      }
    }
    c.closePath();
  }

  // Same frost every paint, so a resize doesn't reshuffle the crystals.
  function seeded(a) {
    return function () {
      a |= 0; a = a + 0x6D2B79F5 | 0;
      var t = Math.imul(a ^ a >>> 15, 1 | a);
      t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t;
      return ((t ^ t >>> 14) >>> 0) / 4294967296;
    };
  }

  /* ── Painting the ice ─────────────────────────────────────────────── */

  // Each collectible has its own solid, bevelled ice shell. Gaps stay clear.
  function paint() {
    var rnd = seeded(11);
    ctx.globalCompositeOperation = "source-over";
    ctx.clearRect(0, 0, W, H);
    state.forEach(function (s) {
      var r = s.rect;
      if (!r || !r.w) return;
      var x = r.x + 2, y = r.y + 2, w = r.w - 4, h = r.h - 7;
      ctx.save();
      // Darker lower edge gives the block thickness without a heavy drop shadow.
      continuousRect(ctx, x, y + 5, w, h, 20);
      ctx.fillStyle = "rgba(73, 139, 166, .35)"; ctx.fill();
      continuousRect(ctx, x, y, w, h, 20);
      ctx.clip();
      var body = ctx.createLinearGradient(x, y, x + w * .65, y + h);
      body.addColorStop(0, "#edfaff");
      body.addColorStop(.3, "#d5eff8");
      body.addColorStop(.72, "#b5dcea");
      body.addColorStop(1, "#8fc3d8");
      ctx.fillStyle = body; ctx.fillRect(x, y, w, h);
      if (s.img && s.img.el.complete && s.img.el.naturalWidth) {
        ctx.save();
        ctx.globalAlpha = .65;
        ctx.filter = "blur(2px) saturate(.65)";
        ctx.drawImage(s.img.el, s.img.x, s.img.y, s.img.w, s.img.h);
        ctx.restore();
      }
      s.lines.forEach(smudge);
      // Broad translucent facets, with light consistently entering at top left.
      ctx.fillStyle = "rgba(255,255,255,.26)";
      ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x + w * .7, y);
      ctx.lineTo(x + w * .38, y + h); ctx.lineTo(x, y + h); ctx.fill();
      ctx.strokeStyle = "rgba(255,255,255,.75)"; ctx.lineWidth = 2;
      continuousRect(ctx, x + 3, y + 3, w - 6, h - 6, 17); ctx.stroke();
      ctx.strokeStyle = "rgba(255,255,255,.28)"; ctx.lineWidth = 5;
      continuousRect(ctx, x + 7, y + 7, w - 14, h - 14, 14); ctx.stroke();
      for (var j = 0; j < 7; j++) {
        var bx = x + 12 + rnd() * (w - 24), by = y + 12 + rnd() * (h - 24);
        ctx.beginPath(); ctx.ellipse(bx, by, 1 + rnd() * 2, 1 + rnd() * 3, -.4, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(255,255,255,.48)"; ctx.fill();
      }
      ctx.restore();
      continuousRect(ctx, x + .5, y + .5, w - 1, h - 1, 20);
      ctx.strokeStyle = "rgba(81,151,181,.4)"; ctx.lineWidth = 1; ctx.stroke();
    });
  }

  // A short branching fracture appears exactly where the block was tapped.
  function fracture(s, x, y) {
    var r = s.rect, rnd = seeded(Math.round(x + y));
    ctx.save();
    continuousRect(ctx, r.x + 2, r.y + 2, r.w - 4, r.h - 7, 20); ctx.clip();
    ctx.lineCap = "round";
    for (var i = 0; i < 5; i++) {
      var a = i * Math.PI * 2 / 5 + rnd() * .45;
      var len = 23 + rnd() * 26, mx = x + Math.cos(a) * len * .45, my = y + Math.sin(a) * len * .45;
      var ex = x + Math.cos(a + .2) * len, ey = y + Math.sin(a + .2) * len;
      line([x, y, mx, my, ex, ey], "rgba(63,126,156,.35)", 2.5, 1);
      line([x, y, mx, my, ex, ey], "rgba(255,255,255,.95)", 1.2, 0);
    }
    ctx.restore();
  }

  // Draw the bar far off to the left and keep only its shadow: a blurred
  // shape with no sharp original. shadowBlur and shadowOffset ignore the
  // transform, so both are in device pixels.
  function smudge(l) {
    ctx.save();
    ctx.shadowColor = l.head ? "rgba(34, 58, 76, 0.28)" : "rgba(34, 58, 76, 0.14)";
    ctx.shadowBlur = 8 * dpr;
    ctx.shadowOffsetX = 4000 * dpr;
    ctx.fillStyle = "#000";
    var hh = l.h * (l.head ? 0.5 : 0.4);
    continuousRect(ctx, l.x - 4000, l.y + (l.h - hh) / 2, l.w, hh, hh / 2);
    ctx.fill();
    ctx.restore();
  }

  function line(pts, color, width, dy) {
    ctx.beginPath();
    ctx.moveTo(pts[0], pts[1] + dy);
    for (var i = 2; i < pts.length; i += 2) ctx.lineTo(pts[i], pts[i + 1] + dy);
    ctx.strokeStyle = color;
    ctx.lineWidth = width;
    ctx.stroke();
  }

  /* ── Melting ──────────────────────────────────────────────────────── */

  function melt(x, y, r, s) {
    ctx.save();
    ctx.globalCompositeOperation = "destination-out";
    var g = ctx.createRadialGradient(x, y, 0, x, y, r);
    g.addColorStop(0, "rgba(0,0,0," + s + ")");
    g.addColorStop(0.5, "rgba(0,0,0," + s * 0.75 + ")");
    g.addColorStop(1, "rgba(0,0,0,0)");
    ctx.fillStyle = g;
    ctx.fillRect(x - r, y - r, r * 2, r * 2);
    ctx.restore();
    // Mirror the same falloff into the coverage grid, so thawing can be
    // judged without reading pixels back (the icons taint the canvas).
    var c0 = Math.max(0, Math.floor((x - r) / CELL)), c1 = Math.min(cols - 1, Math.floor((x + r) / CELL));
    var r0 = Math.max(0, Math.floor((y - r) / CELL)), r1 = Math.min(rows - 1, Math.floor((y + r) / CELL));
    for (var cy = r0; cy <= r1; cy++) {
      for (var cx = c0; cx <= c1; cx++) {
        var dx = (cx + 0.5) * CELL - x, dy = (cy + 0.5) * CELL - y;
        var d = Math.sqrt(dx * dx + dy * dy) / r;
        if (d >= 1) continue;
        var a = d < 0.5 ? s * (1 - 0.5 * d) : s * 1.5 * (1 - d);
        cells[cy * cols + cx] *= 1 - a;
      }
    }
  }

  // Two offset blobs per stamp so the thawed edge comes out ragged, the
  // way frost actually retreats, instead of a row of perfect circles.
  function stamp(x, y, r, s) {
    touched = true;
    melt(x, y, r, s);
    melt(x + (Math.random() - 0.5) * r * 0.55, y + (Math.random() - 0.5) * r * 0.55,
         r * (0.55 + Math.random() * 0.3), s * 0.6);
    if (Math.random() < 0.3 * Math.min(1, s * 4)) bead(x, y, r);
  }

  // Condensation beads along the thaw line. source-atop lands them only
  // on ice that is still there, and later warmth wipes them with it.
  function bead(x, y, r) {
    var ang = Math.random() * 6.2832, dist = r * (0.78 + Math.random() * 0.22);
    var bx = x + Math.cos(ang) * dist, by = y + Math.sin(ang) * dist;
    var br = 1.1 + Math.random() * 1.6;
    ctx.save();
    ctx.globalCompositeOperation = "source-atop";
    ctx.fillStyle = "rgba(92, 134, 160, 0.30)";
    ctx.beginPath(); ctx.arc(bx, by, br, 0, 6.2832); ctx.fill();
    ctx.fillStyle = "rgba(255, 255, 255, 0.95)";
    ctx.beginPath(); ctx.arc(bx - br * 0.35, by - br * 0.35, br * 0.38, 0, 6.2832); ctx.fill();
    ctx.restore();
  }

  function frostLeft(r) {
    var c0 = Math.max(0, Math.floor(r.x / CELL)), c1 = Math.min(cols - 1, Math.floor((r.x + r.w) / CELL));
    var r0 = Math.max(0, Math.floor(r.y / CELL)), r1 = Math.min(rows - 1, Math.floor((r.y + r.h) / CELL));
    var sum = 0, n = 0;
    for (var cy = r0; cy <= r1; cy++) for (var cx = c0; cx <= c1; cx++) { sum += cells[cy * cols + cx]; n++; }
    return n ? sum / n : 0;
  }
  function clearCells(r) {
    var c0 = Math.max(0, Math.floor((r.x - 4) / CELL)), c1 = Math.min(cols - 1, Math.floor((r.x + r.w + 4) / CELL));
    var r0 = Math.max(0, Math.floor((r.y - 4) / CELL)), r1 = Math.min(rows - 1, Math.floor((r.y + r.h + 4) / CELL));
    for (var cy = r0; cy <= r1; cy++) for (var cx = c0; cx <= c1; cx++) cells[cy * cols + cx] = 0;
  }

  // Any icon under the warmth that is mostly clear lets go of the rest.
  function check(x, y, r) {
    state.forEach(function (s, i) {
      if (s.thawed) return;
      var q = s.rect;
      if (x + r < q.x || x - r > q.x + q.w || y + r < q.y || y - r > q.y + q.h) return;
      if (frostLeft(q) < THAW_AT) thawItem(i, x, y);
    });
  }

  /* ── Drips ────────────────────────────────────────────────────────── */

  var drips = [];
  function spawnDrip(x, y, r) {
    if (drips.length > 5) return;
    var ang = Math.PI / 2 + (Math.random() - 0.5) * 1.1;
    var dx = x + Math.cos(ang) * r * 0.82, dy = y + Math.sin(ang) * r * 0.82;
    var c = Math.floor(dx / CELL), rw = Math.floor(dy / CELL);
    if (c < 0 || c >= cols || rw < 0 || rw >= rows || cells[rw * cols + c] < 0.35) return;
    drips.push({ x: dx, y: dy, px: dx, py: dy, v: 18, run: 0, max: 16 + Math.random() * 44,
                 w: 2.2 + Math.random() * 1.4, hold: 0 });
  }
  function stepDrips(dt) {
    for (var k = drips.length - 1; k >= 0; k--) {
      var d = drips[k];
      if (d.run < d.max) {
        var step = d.v * dt / 1000;
        d.v = Math.max(8, d.v * (1 - dt / 900));   // a bead on glass stalls as it runs
        d.y += step;
        d.x += (Math.random() - 0.5) * 0.5;
        d.run += step;
        // Only lay trail once the bead has moved its own width: a slow
        // bead re-stroking the same pixels every frame stacks the erase
        // up until it cuts clean through after all.
        if (d.y - d.py < d.w) continue;
        // A run of water thins the frost and wets it; it never cuts
        // clean through, or it would expose a sliver of the text below.
        ctx.save();
        ctx.lineCap = "butt";
        ctx.globalCompositeOperation = "destination-out";
        ctx.strokeStyle = "rgba(0,0,0,0.16)";
        ctx.lineWidth = d.w;
        ctx.beginPath(); ctx.moveTo(d.px, d.py); ctx.lineTo(d.x, d.y); ctx.stroke();
        ctx.globalCompositeOperation = "source-atop";
        ctx.strokeStyle = "rgba(84, 126, 152, 0.10)";
        ctx.beginPath(); ctx.moveTo(d.px, d.py); ctx.lineTo(d.x, d.y); ctx.stroke();
        ctx.strokeStyle = "rgba(255, 255, 255, 0.35)";
        ctx.lineWidth = d.w * 0.35;
        ctx.beginPath(); ctx.moveTo(d.px - d.w * 0.25, d.py); ctx.lineTo(d.x - d.w * 0.25, d.y); ctx.stroke();
        ctx.restore();
        d.px = d.x; d.py = d.y;
      } else {
        d.hold += dt;
        if (d.hold > 700) drips.splice(k, 1);
      }
    }
    return drips.length > 0;
  }

  /* ── Thawing an icon ──────────────────────────────────────────────── */

  // Blaze's first breath of warmth: three small flames, released once
  // while the ice opens. Their own layer survives the shelf's final fade.
  function revealBlaze(s) {
    if (!s.img || !s.img.el.animate || !/\/blaze\.png(?:\?|$)/.test(s.img.el.getAttribute("src"))) return;
    if (window.matchMedia && matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    var burst = document.createElement("span");
    burst.className = "frost-blaze-reveal";
    burst.setAttribute("aria-hidden", "true");
    burst.style.left = (s.img.x + s.img.w / 2) + "px";
    burst.style.top = (s.img.y + 4) + "px";
    pane.appendChild(burst);
    var flights = [
      { x: -11, dx: -22, rise: 38, delay: 130, size: 0.8 },
      { x: 0, dx: 2, rise: 53, delay: 210, size: 1 },
      { x: 11, dx: 23, rise: 42, delay: 290, size: 0.85 }
    ];
    var remaining = flights.length;
    flights.forEach(function (f) {
      var flame = document.createElement("span");
      flame.className = "frost-blaze-flame";
      flame.innerHTML = '<svg viewBox="0 0 16 24" fill="none" xmlns="http://www.w3.org/2000/svg">' +
        '<path d="M8 1C10 7 15 10 15 16A7 7 0 0 1 1 16C1 12 4 9 5 6C5 10 7 11 8 1Z" fill="#F88B27"/>' +
        '<path d="M8 9C9 13 12 15 12 18A4 4 0 0 1 4 18C4 15 7 13 8 9Z" fill="#FFD16A"/>' +
        '<path d="M8 15C9 17 10 18 10 20A2 2 0 0 1 6 20C6 18 7 17 8 15Z" fill="#FFF2C5"/>' +
        '</svg>';
      burst.appendChild(flame);
      var turn = f.x < 0 ? -12 : 12;
      var animation = flame.animate([
        { opacity: 0, transform: "translate(" + f.x + "px, 5px) scale(0.25)", offset: 0 },
        { opacity: 1, transform: "translate(" + (f.x * 1.25) + "px, -7px) rotate(" + turn + "deg) scale(" + f.size + ")", offset: 0.2 },
        { opacity: 0.9, transform: "translate(" + f.dx + "px, " + (-f.rise * 0.65) + "px) rotate(" + (-turn / 2) + "deg) scale(" + (f.size * 0.85) + ")", offset: 0.65 },
        { opacity: 0, transform: "translate(" + (f.dx + 3) + "px, " + (-f.rise) + "px) scale(0.2)", offset: 1 }
      ], { duration: 1000, delay: f.delay, easing: "ease-out", fill: "both" });
      // Clean up on completion or cancellation; no invisible particles
      // or animation loops remain after this one-shot reaction.
      function clear() { if (--remaining === 0) burst.remove(); }
      animation.finished.then(clear, clear);
    });
  }

  // Small, one-shot reactions share timing and cleanup; the artwork and
  // movement come from each icon's story. Blaze keeps its approved flames.
  var REVEAL_ART = {
    tape: '<rect x="3" y="5" width="18" height="14" rx="4" fill="#D9B88B"/><rect x="9" y="8" width="6" height="8" rx="1.5" fill="#F5DFC2"/><path d="M6 10v1m0 3v1m12-5v1m0 3v1" stroke="#9D7854" stroke-width="1.5" stroke-linecap="round"/>',
    z: '<path d="M6 6h12L6 18h12" fill="none" stroke="currentColor" stroke-width="3" stroke-linejoin="round" stroke-linecap="round"/>',
    orbit: '<circle cx="12" cy="12" r="5" fill="none" stroke="currentColor" stroke-width="2"/><circle cx="18" cy="7" r="2.5" fill="currentColor"/>',
    drop: '<path d="M12 2C10 7 5 12 5 16a7 7 0 0 0 14 0c0-4-5-9-7-14Z" fill="currentColor"/><path d="M8 15c-1 2 0 4 2 4" fill="none" stroke="#E9F8FF" stroke-width="1.6" stroke-linecap="round"/>',
    bubble: '<circle cx="12" cy="12" r="8" fill="currentColor" fill-opacity=".22" stroke="currentColor" stroke-width="1.5"/><path d="M8 8l1-1" stroke="#F5FFE1" stroke-width="2" stroke-linecap="round"/>',
    ring: '<circle cx="12" cy="12" r="7" fill="none" stroke="currentColor" stroke-width="1.5"/>',
    confetti: '<path d="M8 3h8v18H8z" fill="currentColor"/>',
    puff: '<path d="M6 18a5 5 0 0 1-1-10 6 6 0 0 1 11-2 6 6 0 0 1 2 12Z" fill="currentColor" fill-opacity=".7"/>',
    star: '<path d="m12 1 3.2 7 7.8 1-5.7 5.3 1.5 7.7-6.8-3.8L5.2 22l1.5-7.7L1 9l7.8-1Z" fill="currentColor"/><path d="m12 5 1.8 4-4 1Z" fill="#FFF5CB" fill-opacity=".8"/>',
    dot: '<circle cx="12" cy="12" r="4" fill="currentColor"/>',
    wisp: '<path d="M6 22c-7-9 14-9 8-17-2-3-6-2-5 0 2 4 12 1 10 9-1 5-8 5-7 8Z" fill="currentColor" fill-opacity=".6"/>',
    eye: '<ellipse cx="12" cy="12" rx="9" ry="7" fill="#FFFEFA" stroke="#9CABC0" stroke-width="1"/><ellipse cx="13" cy="12" rx="4" ry="5" fill="#34475B"/><circle cx="14" cy="10" r="1.5" fill="#FFFEFA"/>',
    coin: '<ellipse cx="12" cy="12" rx="8" ry="10" fill="#D99A2B"/><ellipse cx="10.5" cy="11" rx="7" ry="9" fill="#F8CF64"/><ellipse cx="10.5" cy="11" rx="4.5" ry="6.5" fill="none" stroke="#FFF1AE" stroke-width="1.5"/><path d="m11 6-3 6h4l-2 4" fill="none" stroke="#C68A24" stroke-width="1.4" stroke-linejoin="round"/>',
    ribbon: '<path d="M6 2h12l-3 12 3 8-6-3-6 3 3-8Z" fill="currentColor"/><path d="M12 3v13" stroke="#FFF0C4" stroke-width="1.5" stroke-opacity=".7"/>',
    lens: '<circle cx="10" cy="10" r="6.5" fill="#CAE9EE" fill-opacity=".6" stroke="#9C7547" stroke-width="2.5"/><path d="m15 15 6 6" stroke="#6B5746" stroke-width="4" stroke-linecap="round"/><path d="m7 8 2-2" stroke="#FAFEFF" stroke-width="2" stroke-linecap="round"/>',
    pixel: '<path d="M2 7h13v4h7v6H9v-4H2Z" fill="currentColor"/>',
    question: '<path d="M7 8a5 5 0 0 1 10 0c0 3-5 3-5 7m0 4v1" fill="none" stroke="currentColor" stroke-width="2.7" stroke-linecap="round"/>'
  };
  var REVEALS = {
    repair: { art: "tape", colors: ["#D9B88B"], count: 3, motion: "rise", w: 17, h: 14 },
    sleepy: { art: "z", colors: ["#8A85BF", "#A59AD3"], count: 3, motion: "sleep", w: 13, h: 13 },
    upside_down: { art: "orbit", colors: ["#63A9C4", "#B387C5"], count: 3, motion: "orbit", w: 13, h: 13, pose: "roll" },
    rainy: { art: "drop", colors: ["#69ACC8", "#88C6DC"], count: 5, motion: "rain", w: 8, h: 13 },
    sick: { art: "bubble", colors: ["#9DBB68", "#B6C981"], count: 3, motion: "sigh", w: 17, h: 17 },
    revived: { art: "ring", colors: ["#66BFA0", "#8BD8B3"], count: 3, motion: "pulse", w: 18, h: 18, pose: "hop" },
    party: { art: "confetti", colors: ["#BA83DE", "#E5B650", "#70B7C8", "#EB8EAA"], count: 7, motion: "confetti", w: 7, h: 11 },
    squished: { art: "puff", colors: ["#BC99B9", "#D7B2C7"], count: 3, motion: "puff", w: 16, h: 13, pose: "squash" },
    starstruck: { art: "star", colors: ["#EDB744", "#F6CD6B"], count: 3, motion: "stars", w: 14, h: 14 },
    bored: { art: "dot", colors: ["#8A8D96"], count: 3, motion: "bored", w: 11, h: 11, pose: "tilt" },
    ghost: { art: "wisp", colors: ["#9EADE0", "#B9B5E2"], count: 3, motion: "ghost", w: 17, h: 22, pose: "float" },
    peekaboo: { art: "eye", colors: ["#9CABC0"], count: 2, motion: "peek", w: 14, h: 12, pose: "peek" },
    gold: { art: "coin", colors: ["#F8CF64"], count: 3, motion: "coins", w: 13, h: 16 },
    champion: { art: "ribbon", colors: ["#E0AF47", "#D58BA3", "#EBC66C"], count: 3, motion: "ribbons", w: 11, h: 20, pose: "hop" },
    detective: { art: "lens", colors: ["#9C7547"], count: 1, motion: "search", w: 23, h: 23, pose: "tilt" },
    glitch: { art: "pixel", colors: ["#65BECB", "#D38CBF", "#A29CDB"], count: 6, motion: "glitch", w: 14, h: 8, pose: "glitch" },
    coming_soon: { art: "question", colors: ["#A5A4AD", "#BCB6C4"], count: 3, motion: "mystery", w: 12, h: 16 }
  };

  function revealFrames(kind, n, count) {
    var u = count === 1 ? 0 : n / (count - 1) * 2 - 1;
    var x = u * 12, dx = u * 27, y = -36 - (n % 2) * 12;
    var turn = u * 18, endTurn = -turn / 2, scale = 0.8 + (n % 3) * 0.1;
    var middleY = y * 0.6, startY = 5, endY = y;
    if (kind === "rain") { startY = -29 - (n % 2) * 8; middleY = -6; endY = 27; dx = x + 5; turn = endTurn = -8; }
    if (kind === "confetti" || kind === "ribbons" || kind === "coins") {
      middleY = -35 - (n % 2) * 8; endY = 13; turn = u * 80; endTurn = u * 160 + 25;
    }
    if (kind === "puff") { startY = 17; middleY = 12; endY = 17; dx = (u || 0.6) * 37; scale = 1.3; }
    if (kind === "bored") { startY = -7; middleY = -13; endY = -9; dx = x; scale = 1; }
    if (kind === "sleep") { dx = x + 12; endY = y - 8; turn = -8; endTurn = 8; }
    if (kind === "sigh") { dx = u * 31; middleY = -8; endY = -25; scale = 1.1; }
    if (kind === "ghost") { dx = x + (n % 2 ? -10 : 10); endY = y - 12; turn = u * 10; }
    if (kind === "mystery") { endY = -32; scale = 0.8; }
    if (kind === "stars") { turn = u * 50; endTurn = u * 90; }
    function at(px, py, r, s) { return "translate(" + px + "px," + py + "px) rotate(" + r + "deg) scale(" + s + ")"; }
    if (kind === "orbit") return [
      { opacity: 0, transform: at(u * 20, 12, 0, 0.3) },
      { opacity: 1, transform: at(u * 26, -15, 60, 1), offset: 0.3 },
      { opacity: 0.8, transform: at(-u * 18, -32, 150, 0.9), offset: 0.7 },
      { opacity: 0, transform: at(-u * 23, -12, 230, 0.2) }
    ];
    if (kind === "pulse") return [
      { opacity: 0, transform: at(0, 15, 0, 0.6) },
      { opacity: 0.75, transform: at(0, 15, 0, 1.2), offset: 0.25 },
      { opacity: 0, transform: at(0, 15, 0, 3.2) }
    ];
    if (kind === "peek") return [
      { opacity: 0, transform: at(u * 8, 12, u * 12, 0.3) },
      { opacity: 1, transform: at(u * 24, 5, u * 12, 1), offset: 0.3 },
      { opacity: 1, transform: at(u * 24, -3, -u * 8, 1), offset: 0.65 },
      { opacity: 0, transform: at(u * 11, 12, 0, 0.3) }
    ];
    if (kind === "search") return [
      { opacity: 0, transform: at(-22, -6, -25, 0.6) },
      { opacity: 1, transform: at(-18, -28, -15, 1), offset: 0.25 },
      { opacity: 1, transform: at(20, -23, 20, 1), offset: 0.65 },
      { opacity: 0, transform: at(23, -32, 25, 0.65) }
    ];
    if (kind === "glitch") return [
      { opacity: 0, transform: at(x, 10 - n * 6, 0, 0.8) },
      { opacity: 1, transform: at(dx, 7 - n * 6, 0, 1.2), offset: 0.2 },
      { opacity: 0.25, transform: at(-dx, 4 - n * 6, 0, 0.7), offset: 0.45 },
      { opacity: 0.9, transform: at(dx + 8, 1 - n * 6, 0, 1), offset: 0.7 },
      { opacity: 0, transform: at(-dx, -n * 6, 0, 0.4) }
    ];
    return [
      { opacity: 0, transform: at(x, startY, 0, 0.25) },
      { opacity: 1, transform: at(x * 1.25, (startY + middleY) / 2, turn, scale), offset: 0.2 },
      { opacity: 0.85, transform: at(dx, middleY, turn / 2, scale), offset: 0.65 },
      { opacity: 0, transform: at(dx + 3, endY, endTurn, scale * 0.3) }
    ];
  }

  var REVEAL_POSES = {
    roll: ["rotate(-24deg) scale(.9)", "rotate(18deg) scale(1.06)", "rotate(-5deg)", "none"],
    hop: ["translateY(3px) scale(.93)", "translateY(-7px) scale(1.05)", "translateY(1px) scale(.98)", "none"],
    squash: ["scale(.95)", "translateY(4px) scale(1.22,.72)", "translateY(-3px) scale(.9,1.12)", "none"],
    tilt: ["rotate(-4deg)", "rotate(6deg)", "rotate(-2deg)", "none"],
    float: ["translateY(2px)", "translateY(-7px)", "translateY(-3px)", "none"],
    peek: ["translateY(6px) scale(.8)", "translateY(-4px) scale(1.06)", "translateY(1px)", "none"],
    glitch: ["translateX(-3px)", "translateX(3px)", "translateX(-1px)", "none"]
  };
  function revealIcon(s) {
    if (!s.img || !s.img.el.animate) return;
    if (window.matchMedia && matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    var match = s.img.el.getAttribute("src").match(/\/([^/]+)\.png(?:\?|$)/);
    var id = match && match[1];
    if (id === "blaze") { revealBlaze(s); return; }
    var effect = REVEALS[id];
    if (!effect) return;
    var burst = document.createElement("span");
    burst.className = "frost-icon-reveal";
    burst.setAttribute("aria-hidden", "true");
    burst.setAttribute("data-icon", id);
    burst.style.left = (s.img.x + s.img.w / 2) + "px";
    burst.style.top = (s.img.y + 4) + "px";
    pane.appendChild(burst);
    var remaining = effect.count;
    for (var n = 0; n < effect.count; n++) {
      var particle = document.createElement("span");
      particle.className = "frost-reveal-particle";
      particle.style.width = effect.w + "px";
      particle.style.height = effect.h + "px";
      particle.style.left = (-effect.w / 2) + "px";
      particle.style.top = (-effect.h * 0.7) + "px";
      particle.style.color = effect.colors[n % effect.colors.length];
      particle.innerHTML = '<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">' + REVEAL_ART[effect.art] + '</svg>';
      burst.appendChild(particle);
      var animation = particle.animate(revealFrames(effect.motion, n, effect.count), {
        duration: effect.motion === "glitch" ? 750 : 1000,
        delay: 130 + n * (effect.motion === "pulse" ? 150 : 65),
        easing: effect.motion === "glitch" ? "steps(2, end)" : "ease-out", fill: "both"
      });
      function clear() { if (--remaining === 0) burst.remove(); }
      animation.finished.then(clear, clear);
    }
    if (effect.pose) s.img.el.animate(REVEAL_POSES[effect.pose].map(function (transform) {
      return { transform: transform };
    }), { duration: 850, delay: 100, easing: effect.pose === "glitch" ? "steps(2, end)" : "ease-in-out" });
  }

  var thaws = [];
  function thawItem(i, ox, oy, quiet) {
    var s = state[i];
    if (s.thawed) return;
    if (!near) arrive();
    touched = true;
    s.thawed = true;
    s.thawedAt = Date.now();
    thawedCount++;
    items[i].classList.add("is-thawing");
    setTimeout(function () {
      items[i].classList.remove("is-thawing");
      items[i].classList.add("is-thawed");
      revealIcon(s);
      if (!quiet) drip();
    }, 280);
    var r = s.rect;
    if (ox == null) { ox = s.img ? s.img.x + s.img.w / 2 : r.x + 30; oy = r.y + r.h / 2; } // from the icon outward
    fracture(s, ox, oy);
    var far = Math.sqrt(Math.pow(Math.max(ox - r.x, r.x + r.w - ox), 2) +
                        Math.pow(Math.max(oy - r.y, r.y + r.h - oy), 2));
    thaws.push({ i: i, x: ox, y: oy, t0: 0, far: far + 16 });
    updateCount();
    kick();
  }
  function stepThaws(now) {
    for (var k = thaws.length - 1; k >= 0; k--) {
      var t = thaws[k], r = state[t.i].rect;
      if (!t.t0) t.t0 = now;
      var p = Math.min(1, Math.max(0, now - t.t0 - 90) / 680), e = 1 - Math.pow(1 - p, 3);
      var R = Math.max(2, t.far * e);
      ctx.save();
      continuousRect(ctx, r.x - 6, r.y - 6, r.w + 12, r.h + 12, 16);
      ctx.clip();
      ctx.globalCompositeOperation = "destination-out";
      var g = ctx.createRadialGradient(t.x, t.y, R * 0.6, t.x, t.y, R);
      g.addColorStop(0, "rgba(0,0,0,0.85)");
      g.addColorStop(1, "rgba(0,0,0,0)");
      ctx.fillStyle = g;
      ctx.fillRect(r.x - 6, r.y - 6, r.w + 12, r.h + 12);
      ctx.restore();
      if (p >= 1) {
        // Finish with a soft-edged clear, outside the clip so the edge
        // feathers into the ice around it instead of stopping dead.
        ctx.save();
        ctx.globalCompositeOperation = "destination-out";
        ctx.shadowColor = "#000";
        ctx.shadowBlur = 10 * dpr;
        ctx.fillStyle = "#000";
        continuousRect(ctx, r.x - 1, r.y - 1, r.w + 2, r.h + 2, 12);
        ctx.fill();
        ctx.restore();
        clearCells(r);
        thaws.splice(k, 1);
      }
    }
    return thaws.length > 0;
  }

  // The site already has a water sound: the iceberg's two-note drip.
  // night.js owns arming and the mute toggle, so this just asks it.
  function drip() {
    var n = window.__nivolo;
    if (n && n.sfx && n.sfx.plop) { try { n.sfx.plop(0.3); } catch (e) {} }
  }

  function updateCount() {
    countEl.textContent = t("count");
    if (thawedCount === items.length) finish();
  }
  function finish() {
    if (done) return;
    done = true;
    allBtn.hidden = true;
    bar.classList.add("is-done");
    countEl.textContent = t("done");
    pane.classList.remove("is-frozen");
    // Let the last thaw finish, then fade the canvases out and drop them.
    setTimeout(function () {
      pane.classList.add("is-clear");
      setTimeout(function () {
        cancelAnimationFrame(raf);
        if (ice.parentNode) ice.parentNode.removeChild(ice);
        if (fx.parentNode) fx.parentNode.removeChild(fx);
        if (tcv && tcv.parentNode) tcv.parentNode.removeChild(tcv);
      }, 900);
    }, 850);
  }

  /* ── The warmth ───────────────────────────────────────────────────── */

  var heat = { on: false, x: 0, y: 0, dwell: 0, acc: 0 };
  var raf = 0, last = 0, pointerAt = 0;
  var torch = { px: 0, vx: 0, ember: 0, steam: 0 };
  var bits = [];      // embers off the flame, steam off the ice
  var mouseAt = null; // last client position, to re-aim after a scroll

  function clearFx() { fxc.clearRect(-FX_M, -FX_M, W + FX_M * 2, H + FX_M * 2); }
  function frostAt(x, y) {
    var c = Math.floor(x / CELL), r = Math.floor(y / CELL);
    return c < 0 || r < 0 || c >= cols || r >= rows ? 0 : cells[r * cols + c];
  }

  function kick() {
    if (!raf && (!done || thaws.length)) { last = 0; raf = requestAnimationFrame(tick); }
  }
  function tick(now) {
    raf = 0;
    // A second tick in the same frame (see the end of tick) would see
    // zero elapsed time; skip it rather than divide by it.
    if (last && now - last < 1) { if (!raf) raf = requestAnimationFrame(tick); return; }
    var dt = last ? Math.min(50, now - last) : 16.7;
    last = now;
    var busy = false;
    if (heat.on && thawedCount < items.length) {
      // A still cursor or a held finger keeps radiating, and the patch
      // under it widens the longer it stays.
      heat.dwell = Math.min(1, heat.dwell + dt / 900);
      var r = BRUSH * (1 + 0.35 * heat.dwell);
      // Jittered, so thousands of tiny erases on one spot don't quantise
      // into visible concentric rings (8-bit alpha bands otherwise).
      stamp(heat.x + (Math.random() - 0.5) * 8, heat.y + (Math.random() - 0.5) * 8,
            r * (0.86 + Math.random() * 0.28), 0.05 * dt / 16.7);
      heat.acc += dt;
      if (heat.acc > 420) { heat.acc = 0; spawnDrip(heat.x, heat.y, r); }
      check(heat.x, heat.y, r);
      busy = true;
      if (FINE) {
        var mvx = (heat.x - torch.px) * 16.7 / dt;
        torch.px = heat.x;
        torch.vx += (mvx - torch.vx) * 0.2;
        if (!isFinite(torch.vx)) torch.vx = 0; // one bad frame must not snuff the torch for good
        // Ice under the flame gives off steam; the flame throws the odd ember.
        torch.steam += dt;
        if (torch.steam > 95 && frostAt(heat.x, heat.y) > 0.12) {
          torch.steam = 0;
          bits.push({ steam: true, x: heat.x + (Math.random() - 0.5) * 22, y: heat.y + (Math.random() - 0.5) * 12,
                      vx: (Math.random() - 0.5) * 10, vy: -(22 + Math.random() * 14),
                      r0: 4 + Math.random() * 3, r1: 14 + Math.random() * 8, age: 0, life: 1000 + Math.random() * 400 });
        }
        torch.ember += dt * (1 + Math.min(2, Math.abs(torch.vx) / 8));
        if (torch.ember > 230) {
          torch.ember = Math.random() * 120;
          bits.push({ steam: false, x: heat.x - 3 + (Math.random() - 0.5) * 5, y: heat.y - 10,
                      vx: (Math.random() - 0.5) * 16 - torch.vx * 0.6, vy: -(34 + Math.random() * 26),
                      r0: 0.8 + Math.random() * 0.8, age: 0, life: 650 + Math.random() * 450 });
        }
      }
    }
    if (stepDrips(dt)) busy = true;
    if (stepThaws(now)) busy = true;
    for (var k = bits.length - 1; k >= 0; k--) {
      var b = bits[k];
      b.age += dt;
      if (b.age >= b.life) { bits.splice(k, 1); continue; }
      b.x += b.vx * dt / 1000;
      b.y += b.vy * dt / 1000;
      if (b.steam) b.vy *= 1 - dt / 2600; // steam slows as it spreads
    }
    if (bits.length) busy = true;
    drawFx(now);
    // thawItem() inside this tick may already have called kick(); never
    // queue a second frame on top of it
    if (busy) { if (!raf) raf = requestAnimationFrame(tick); }
    else { clearFx(); placeTorch(); }
  }

  // The warm light itself, on its own canvas so it never marks the ice.
  function drawFx(now) {
    clearFx();
    fxc.save();
    continuousRect(fxc, 0, 0, W, H, RADIUS);
    fxc.clip();
    if (heat.on && FINE && thawedCount < items.length) {
      var r = BRUSH * 1.6 * (0.97 + 0.03 * Math.sin(now / 240));
      var g = fxc.createRadialGradient(heat.x, heat.y, 0, heat.x, heat.y, r);
      g.addColorStop(0, "rgba(255, 186, 104, 0.20)");
      g.addColorStop(0.45, "rgba(255, 198, 138, 0.08)");
      g.addColorStop(1, "rgba(255, 210, 160, 0)");
      fxc.fillStyle = g;
      fxc.fillRect(heat.x - r, heat.y - r, r * 2, r * 2);
    }
    drips.forEach(function (d) {
      var a = d.run < d.max ? 1 : Math.max(0, 1 - d.hold / 700);
      var br = d.w * 0.95;
      fxc.fillStyle = "rgba(88, 132, 158, " + (0.22 * a) + ")";
      fxc.beginPath(); fxc.arc(d.x, d.y, br, 0, 6.2832); fxc.fill();
      fxc.fillStyle = "rgba(255, 255, 255, " + (0.9 * a) + ")";
      fxc.beginPath(); fxc.arc(d.x - br * 0.3, d.y - br * 0.35, br * 0.4, 0, 6.2832); fxc.fill();
    });
    fxc.restore();
    bits.forEach(function (b) { if (b.steam) puff(b); });
    bits.forEach(function (b) { if (!b.steam) ember(b); });
    paintTorch(now);
  }

  function torchLit() { return !!(tcv && heat.on && mouseAt && !done); }
  function placeTorch() {
    if (!torchLit()) { tcv && tcv.classList.remove("on"); return; }
    tcv.style.transform = "translate3d(" + (mouseAt.x - HX) + "px," + (mouseAt.y - HY) + "px,0)";
    tcv.classList.add("on");
  }
  function paintTorch(now) {
    placeTorch();
    if (!torchLit()) return;
    tctx.clearRect(0, 0, TW, TH);
    drawTorch(tctx, HX, HY, now);
  }

  function puff(b) {
    var p = b.age / b.life;
    var a = (p < 0.18 ? p / 0.18 : 1 - (p - 0.18) / 0.82) * 0.42;
    var r = b.r0 + (b.r1 - b.r0) * Math.sqrt(p);
    var g = fxc.createRadialGradient(b.x, b.y, 0, b.x, b.y, r);
    g.addColorStop(0, "rgba(255, 255, 255, " + a + ")");
    g.addColorStop(0.55, "rgba(246, 250, 252, " + a * 0.55 + ")");
    g.addColorStop(0.85, "rgba(190, 210, 222, " + a * 0.12 + ")");
    g.addColorStop(1, "rgba(190, 210, 222, 0)");
    fxc.fillStyle = g;
    fxc.fillRect(b.x - r, b.y - r, r * 2, r * 2);
  }
  function ember(b) {
    var p = b.age / b.life;
    fxc.fillStyle = "rgba(247, 172, 64, " + (1 - p) * 0.95 + ")";
    fxc.beginPath(); fxc.arc(b.x, b.y, b.r0 * (1 - p * 0.5), 0, 6.2832); fxc.fill();
  }

  /* ── The torch ──────────────────────────────────────────────────────
     Drawn, not a cursor image: a CSS cursor can't flicker, lean into the
     motion or steam, and it is capped at a size that reads as a sticker.
     The hotspot is the flame — that is where the ice melts. The handle
     trails down-right like an arrow pointer, tilts a little with speed,
     and the flame always burns straight up, leaning away from the move.
     Flat and rounded, in the style of Nivo's icons; the wrap under the
     head is the brand ice blue. */
  function drawTorch(c, x, y, now) {
    var vx = torch.vx;
    var tilt = 0.52 + Math.max(-0.28, Math.min(0.28, vx * 0.012));
    var hx = x + 1, hy = y + 9; // centre of the head, just under the flame
    var L = 36;

    c.save();
    c.translate(hx, hy);
    c.rotate(-tilt);
    c.shadowColor = "rgba(22, 23, 26, 0.26)";
    c.shadowBlur = 6 * dpr;
    c.shadowOffsetX = 2 * dpr;
    c.shadowOffsetY = 4 * dpr;
    // handle: a tapered, rounded dowel, lit from the left
    var hg = c.createLinearGradient(-3.5, 0, 3.5, 0);
    hg.addColorStop(0, "#C08D5E");
    hg.addColorStop(0.45, "#9A6841");
    hg.addColorStop(1, "#6A4429");
    c.fillStyle = hg;
    c.beginPath();
    c.moveTo(-3.3, 2);
    c.lineTo(3.3, 2);
    c.lineTo(2.5, L - 2.5);
    c.quadraticCurveTo(0, L + 1, -2.5, L - 2.5);
    c.closePath();
    c.fill();
    c.shadowColor = "transparent";
    // the wrap
    var wg = c.createLinearGradient(-4, 0, 4, 0);
    wg.addColorStop(0, "#2A93C6");
    wg.addColorStop(1, "#0E5578");
    c.fillStyle = wg;
    c.beginPath();
    c.moveTo(-4, 5); c.lineTo(4, 3.6); c.lineTo(4, 9.2); c.lineTo(-4, 10.6);
    c.closePath();
    c.fill();
    c.strokeStyle = "rgba(255, 255, 255, 0.28)";
    c.lineWidth = 0.8;
    c.beginPath(); c.moveTo(-3.6, 7.2); c.lineTo(3.6, 5.9); c.stroke();
    // the head: a small iron cup
    var mg = c.createLinearGradient(-6, 0, 6, 0);
    mg.addColorStop(0, "#6B727B");
    mg.addColorStop(0.5, "#444A52");
    mg.addColorStop(1, "#2B2F35");
    c.fillStyle = mg;
    c.beginPath();
    c.moveTo(-6.2, -5.5);
    c.lineTo(6.2, -5.5);
    c.lineTo(3.8, 3);
    c.lineTo(-3.8, 3);
    c.closePath();
    c.fill();
    c.fillStyle = "rgba(255, 255, 255, 0.30)";
    c.fillRect(-6.2, -5.5, 12.4, 1.1);
    c.restore();

    // flame base: the top of the cup, in page space
    var bx = hx - 5.5 * Math.sin(tilt), by = hy - 5.5 * Math.cos(tilt);
    var f = Math.sin(now / 67) * 0.5 + Math.sin(now / 41 + 1.3) * 0.3 + Math.sin(now / 113 + 2) * 0.2;
    var h = 21 + 2.6 * f;
    var w = 10.5 + 1.2 * Math.sin(now / 53 + 0.7);
    var lean = Math.max(-7, Math.min(7, -vx * 0.35)) + 1.3 * Math.sin(now / 97);

    var halo = c.createRadialGradient(bx + lean * 0.4, by - h * 0.4, 0, bx + lean * 0.4, by - h * 0.4, 22);
    halo.addColorStop(0, "rgba(255, 196, 96, 0.38)");
    halo.addColorStop(1, "rgba(255, 196, 96, 0)");
    c.fillStyle = halo;
    c.fillRect(bx - 30, by - h - 20, 60, h + 44);

    flame(c, bx, by, w, h, lean, "rgba(236, 118, 42, 0.92)", "rgba(244, 150, 52, 0.95)");
    flame(c, bx, by - 0.5, w * 0.66, h * 0.7, lean * 0.75, "rgba(246, 176, 58, 1)", "rgba(250, 206, 84, 1)");
    flame(c, bx, by - 1, w * 0.34, h * 0.38, lean * 0.45, "rgba(255, 240, 196, 1)", "rgba(255, 250, 232, 1)");
  }
  function flame(c, bx, by, w, h, lean, tip, base) {
    var g = c.createLinearGradient(0, by - h, 0, by + w * 0.2);
    g.addColorStop(0, tip);
    g.addColorStop(1, base);
    c.fillStyle = g;
    c.beginPath();
    c.moveTo(bx + lean, by - h);
    c.bezierCurveTo(bx + w * 0.18 + lean * 0.55, by - h * 0.55, bx + w * 0.62, by - h * 0.1, bx, by + w * 0.22);
    c.bezierCurveTo(bx - w * 0.62, by - h * 0.1, bx - w * 0.18 + lean * 0.55, by - h * 0.55, bx + lean, by - h);
    c.fill();
  }

  function local(e) {
    var r = pane.getBoundingClientRect();
    return { x: e.clientX - r.left, y: e.clientY - r.top };
  }

  // Moving warmth melts along its whole path, not just where the events
  // happened to land.
  function sweep(x0, y0, x1, y1) {
    var dx = x1 - x0, dy = y1 - y0, dist = Math.sqrt(dx * dx + dy * dy);
    if (dist < 1) return;
    var n = Math.min(40, Math.ceil(dist / (BRUSH * 0.3)));
    for (var k = 1; k <= n; k++) stamp(x0 + dx * k / n, y0 + dy * k / n, BRUSH, 0.08);
    check(x1, y1, BRUSH);
    if (dist > 4) heat.dwell *= 0.85;
  }

  function onMove(e) {
    if (done) return;
    var p = local(e);
    if (e.pointerType === "mouse") {
      mouseAt = { x: e.clientX, y: e.clientY };
      if (heat.on) sweep(heat.x, heat.y, p.x, p.y);
      else torch.px = p.x;
      heat.on = true;
    } else if (heat.on) {
      sweep(heat.x, heat.y, p.x, p.y);
    } else {
      return;
    }
    heat.x = p.x; heat.y = p.y;
    if (tcv) placeTorch(); // move it on the event itself, not a frame later
    kick();
  }
  pane.addEventListener("pointerenter", onMove);
  pane.addEventListener("pointermove", onMove);
  pane.addEventListener("pointerleave", function (e) {
    if (e.pointerType === "mouse") { heat.on = false; mouseAt = null; kick(); }
  });
  // Scrolling moves the ice under a still mouse without a pointermove, so
  // re-aim the torch from the last known cursor position (without melting
  // a streak along the way).
  window.addEventListener("scroll", function () {
    if (!heat.on || !mouseAt || done) return;
    var r = pane.getBoundingClientRect();
    var x = mouseAt.x - r.left, y = mouseAt.y - r.top;
    if (x < 0 || y < 0 || x > r.width || y > r.height) { heat.on = false; kick(); return; }
    heat.x = x; heat.y = y; torch.px = x;
    kick();
  }, { passive: true });
  pane.addEventListener("pointerdown", function (e) {
    pointerAt = Date.now();
    if (done) return;
    var pressed = indexOf(e.target);
    if (pressed >= 0 && !state[pressed].thawed) {
      var point = local(e);
      fracture(state[pressed], point.x, point.y);
    }
    if (e.pointerType === "mouse") return;
    // A finger held on the ice melts it; the moment it drags, the page
    // scrolls as normal and pointercancel ends the warmth.
    var p = local(e);
    heat.on = true; heat.x = p.x; heat.y = p.y; heat.dwell = 0; heat.acc = 0;
    kick();
  });
  function lift(e) { if (e.pointerType !== "mouse") heat.on = false; }
  pane.addEventListener("pointerup", lift);
  pane.addEventListener("pointercancel", lift);

  function indexOf(target) {
    var li = target && target.closest ? target.closest(".lore-mini > li") : null;
    return li ? items.indexOf(li) : -1;
  }
  // Clicking a frozen icon thaws it; the next click opens it. Capture
  // phase, so icon-pop's own click handler never sees the first one.
  // A press that did the thawing (a finger held on the ice, a mouse held
  // down while it melted) doesn't also open the icon on release.
  pane.addEventListener("click", function (e) {
    var i = indexOf(e.target);
    if (i < 0) return;
    if (state[i].thawed) {
      if (state[i].thawedAt >= pointerAt) { e.stopPropagation(); e.preventDefault(); }
      else { heat.on = false; kick(); } // the popup opens over it; put the torch out
      return;
    }
    e.stopPropagation();
    e.preventDefault();
    var p = local(e);
    thawItem(i, p.x, p.y);
  }, true);
  // Keyboard users are never kept waiting: tabbing onto an icon thaws it.
  // A click also focuses the item, so ignore focus that follows a pointer.
  pane.addEventListener("focusin", function (e) {
    if (Date.now() - pointerAt < 600) return;
    var i = indexOf(e.target);
    if (i >= 0) thawItem(i, null, null, true);
  });

  /* Everything still frozen, cleared the way the shelf is read: row by
     row, left to right, 40ms apart. Each icon keeps its own fracture,
     melt and reveal sequence. */
  function thawAll() {
    var order = [];
    state.forEach(function (s, i) { if (!s.thawed) order.push(i); });
    order.sort(function (a, b) {
      var ra = state[a].rect, rb = state[b].rect;
      if (!ra || !rb) return a - b;
      return Math.abs(ra.y - rb.y) > 8 ? ra.y - rb.y : ra.x - rb.x;
    });
    order.forEach(function (i, n) {
      setTimeout(function () { thawItem(i, null, null, n % 3 !== 0); }, 40 * n);
    });
  }
  allBtn.addEventListener("click", thawAll);

  /* ── Build, and rebuild when the layout moves ─────────────────────── */

  // A rebuild refreezes anything half-melted but keeps every icon that
  // already thawed — the page never takes back what was uncovered.
  function build() {
    measure();
    size();
    paint();
    state.forEach(function (s) {
      if (!s.thawed) return;
      ctx.save();
      ctx.globalCompositeOperation = "destination-out";
      ctx.shadowColor = "#000";
      ctx.shadowBlur = 10 * dpr;
      ctx.fillStyle = "#000";
      continuousRect(ctx, s.rect.x - 1, s.rect.y - 1, s.rect.w + 2, s.rect.h + 2, 12);
      ctx.fill();
      ctx.restore();
      clearCells(s.rect);
    });
    lastW = W;
  }

  updateCount();

  /* The shelf is most of a page below the fold, so nothing is painted until
     it is nearly on screen: building at load spent the first second of
     every visit on ice nobody could see yet. (The canvases are empty until
     then, which only matters if the shelf could be looked at — and the
     margin means it cannot.) */
  var near = false;
  function arrive() {
    if (near) return;
    near = true;
    build();
  }
  if (window.IntersectionObserver) {
    var watch = new IntersectionObserver(function (entries) {
      if (!entries[0].isIntersecting) return;
      watch.disconnect();
      arrive();
    }, { rootMargin: "900px 0px" });
    watch.observe(pane);
  } else {
    arrive();
  }

  // Touch uses the same explicit tap-to-reveal as desktop. Normal page
  // scrolling remains available; Thaw all is the immediate alternative.

  // Fonts and lazy icons land after the first paint and move the text and
  // colour blooms. Repaint for them only while the ice is untouched — and
  // once per frame, not once per icon: eighteen of them finish loading
  // within a few frames of each other, and each used to repaint the lot.
  var refreshQueued = false;
  function refresh() {
    if (!near || touched || done || refreshQueued) return;
    refreshQueued = true;
    requestAnimationFrame(function () {
      refreshQueued = false;
      if (!touched && !done) build();
    });
  }
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(refresh);
  items.forEach(function (li) {
    var img = li.querySelector("img");
    if (img && !img.complete) img.addEventListener("load", refresh);
  });
  if (window.ResizeObserver) {
    new ResizeObserver(function () {
      if (done || !near) return;
      var w = Math.round(pane.getBoundingClientRect().width);
      if (!touched || Math.abs(w - lastW) > 1) build();
    }).observe(pane);
  } else {
    window.addEventListener("resize", function () { if (!done && near) build(); });
  }
})();
