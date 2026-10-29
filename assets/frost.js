/* The rare collection sits in individual ice blocks. A straight wooden-handled
   pick follows the mouse; a press shows a fracture, and a click releases chips.
   Hover never reveals content. Touch scrolling and cancelled presses do nothing.
   Reduced motion and unavailable canvas leave the collection directly accessible. */
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
    en: { hint: "Tap an ice block to reveal an icon. Tap again to explore its world.", all: "Reveal all", count: "{n} of {total} revealed", done: "All {total} revealed. Discover how to earn them in the app." },
    zh: { hint: "轻点冰块，揭晓图标。再次轻点，探索它的世界。", all: "全部揭晓", count: "已揭晓 {n} / {total}", done: "已揭晓全部 {total} 个。在 App 中发现它们的解锁方式。" }
  };
  function t(key) {
    return copy[document.documentElement.lang.indexOf("zh") === 0 ? "zh" : "en"][key]
      .replace("{n}", thawedCount).replace("{total}", items.length);
  }
  if (hint) hint.textContent = t("hint");
  var FX_M = 72; // Room for the falling chips, outside the shelf.

  var dpr = 1, W = 0, H = 0, lastW = 0;
  var state = items.map(function () { return { thawed: false, rect: null, img: null, lines: [] }; });
  var thawedCount = 0, touched = false, done = false;

  ice.className = "frost-ice";
  fx.className = "frost-fx";
  ice.setAttribute("aria-hidden", "true");
  fx.setAttribute("aria-hidden", "true");
  pane.appendChild(ice);
  pane.appendChild(fx);
  pane.classList.add("is-frozen");
  // The tip is the pointer hotspot. The handle stays above-left of it.
  var TW = 100, TH = 100, HX = 76, HY = 78;
  var tcv = null, tctx = null;
  if (FINE) {
    tcv = document.createElement("canvas");
    tcv.className = "frost-pick";
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
  function fracture(c, s, x, y, reach) {
    var r = s.rect, rnd = seeded(Math.round(x + y));
    c.save();
    continuousRect(c, r.x + 2, r.y + 2, r.w - 4, r.h - 7, 20); c.clip();
    c.lineCap = "round";
    for (var i = 0; i < 7; i++) {
      var a = i * Math.PI * 2 / 7 + rnd() * .3;
      var len = reach * (.7 + rnd() * .3);
      var mx = x + Math.cos(a) * len * .45, my = y + Math.sin(a) * len * .45;
      var ex = x + Math.cos(a + .15) * len, ey = y + Math.sin(a + .15) * len;
      c.beginPath(); c.moveTo(x, y); c.lineTo(mx, my); c.lineTo(ex, ey);
      c.strokeStyle = "rgba(63,126,156,.45)"; c.lineWidth = 3; c.stroke();
      c.strokeStyle = "rgba(255,255,255,.95)"; c.lineWidth = 1.3; c.stroke();
      c.beginPath(); c.moveTo(mx, my); c.lineTo(mx + Math.cos(a + .7) * len * .2, my + Math.sin(a + .7) * len * .2);
      c.lineWidth = .8; c.stroke();
    }
    c.restore();
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

  var breaks = [], raf = 0, press = null, mouseAt = null, hovered = -1;
  var pointerAt = 0, cancelledTap = false, recoilAt = 0;
  var audio = null;
  var soundButton = document.querySelector("[data-nivo-sound]");
  function soundEnabled() {
    return soundButton && soundButton.getAttribute("aria-pressed") === "true" && !document.hidden;
  }
  function sound(kind) {
    if (!soundEnabled()) return;
    try {
      var Audio = window.AudioContext || window.webkitAudioContext;
      if (!Audio) return;
      if (!audio || audio.state === "closed") audio = new Audio();
      if (audio.state !== "running") { audio.resume().catch(function () {}); return; }
      var now = audio.currentTime, gain = audio.createGain(), source;
      if (kind === "crack") {
        var buffer = audio.createBuffer(1, Math.round(audio.sampleRate * .085), audio.sampleRate);
        var data = buffer.getChannelData(0), last = 0;
        for (var i = 0; i < data.length; i++) { last = (last + (Math.random() * 2 - 1) * .2) / 1.2; data[i] = last; }
        source = audio.createBufferSource(); source.buffer = buffer;
      } else {
        source = audio.createOscillator(); source.type = "sine";
        source.frequency.setValueAtTime(kind === "tick" ? 1600 : 1175, now);
        source.frequency.exponentialRampToValueAtTime(kind === "tick" ? 750 : 1568, now + .12);
      }
      var length = kind === "chime" ? .22 : kind === "tick" ? .035 : .085;
      gain.gain.setValueAtTime(0, now);
      gain.gain.linearRampToValueAtTime(kind === "crack" ? .2 : .035, now + .003);
      gain.gain.exponentialRampToValueAtTime(.0001, now + length);
      source.connect(gain); gain.connect(audio.destination);
      source.start(now); source.stop(now + length);
      source.onended = function () { source.disconnect(); gain.disconnect(); };
    } catch (e) { /* Optional sound must never delay the reveal. */ }
  }
  if (soundButton) soundButton.addEventListener("click", function () {
    setTimeout(function () { if (!soundEnabled() && audio) { audio.close().catch(function () {}); audio = null; } }, 0);
  });

  function revealItem(i, ox, oy, quiet) {
    var s = state[i];
    if (s.thawed) return;
    if (!near) arrive();
    var r = s.rect;
    if (!r || !r.w || !r.h) return;
    touched = true; s.thawed = true; thawedCount++;
    if (ox == null) { ox = s.img ? s.img.x + s.img.w / 2 : r.x + r.w / 2; oy = r.y + r.h / 2; }
    ox = Math.max(r.x + 8, Math.min(r.x + r.w - 8, ox));
    oy = Math.max(r.y + 8, Math.min(r.y + r.h - 8, oy));
    fracture(ctx, s, ox, oy, Math.max(r.w, r.h));
    // Retain this block's actual ice texture, then split it into eight pieces.
    var shell = document.createElement("canvas");
    shell.width = Math.ceil(r.w * dpr); shell.height = Math.ceil(r.h * dpr);
    shell.getContext("2d").drawImage(ice, r.x * dpr, r.y * dpr, r.w * dpr, r.h * dpr, 0, 0, shell.width, shell.height);
    var cx = ox - r.x, cy = oy - r.y;
    var edge = [[0,0],[r.w*.5,0],[r.w,0],[r.w,r.h*.5],[r.w,r.h],[r.w*.5,r.h],[0,r.h],[0,r.h*.5]];
    var pieces = edge.map(function (a, n) {
      var b = edge[(n + 1) % edge.length], px = (cx + a[0] + b[0]) / 3, py = (cy + a[1] + b[1]) / 3;
      var dx = px - cx, dy = py - cy, distance = Math.max(1, Math.hypot(dx,dy));
      return { points: [[cx,cy],a,b], x:px, y:py, vx:dx/distance*(24+n%3*7), vy:dy/distance*22-13, spin:(n%2?1:-1)*(.12+n*.015) };
    });
    breaks.push({ i:i, shell:shell, rect:{x:r.x,y:r.y,w:r.w,h:r.h}, pieces:pieces, start:performance.now(), quiet:quiet, released:false });
    items[i].classList.add("is-breaking");
    recoilAt = performance.now();
    if (!quiet) sound("crack");
    updateCount(); placePick(); kick();
  }
  function updateCount() {
    countEl.textContent = t(thawedCount === items.length ? "done" : "count");
    if (thawedCount === items.length) {
      done = true; allBtn.hidden = true; bar.classList.add("is-done");
      pane.classList.remove("is-frozen", "is-picking");
    }
  }
  function kick() { if (!raf) raf = requestAnimationFrame(tick); }
  function tick(now) {
    raf = 0;
    fxc.clearRect(-FX_M, -FX_M, W + FX_M * 2, H + FX_M * 2);
    if (press && !state[press.i].thawed) fracture(fxc, state[press.i], press.x, press.y, 42);
    for (var k = breaks.length - 1; k >= 0; k--) {
      var br = breaks[k], elapsed = now - br.start, r = br.rect;
      if (elapsed < 95) continue; // Let the fracture register before it separates.
      if (!br.released) {
        br.released = true;
        ctx.clearRect(r.x, r.y, r.w, r.h);
        items[br.i].classList.remove("is-breaking");
        items[br.i].classList.add("is-thawed");
        revealIcon(state[br.i]);
        if (!br.quiet) sound("chime");
      }
      var p = Math.min(1, (elapsed - 95) / 520);
      if (p === 1) { breaks.splice(k,1); continue; }
      br.pieces.forEach(function (piece) {
        fxc.save();
        fxc.globalAlpha = Math.pow(1-p, 1.25);
        fxc.translate(r.x + piece.x + piece.vx * p, r.y + piece.y + piece.vy * p + 50*p*p);
        fxc.rotate(piece.spin*p); fxc.scale(1-.12*p,1-.12*p);
        fxc.translate(-piece.x,-piece.y);
        fxc.beginPath();
        piece.points.forEach(function (point,n) { if (!n) fxc.moveTo(point[0],point[1]); else fxc.lineTo(point[0],point[1]); });
        fxc.closePath(); fxc.clip();
        fxc.drawImage(br.shell,0,0,r.w,r.h);
        fxc.restore();
      });
    }
    paintPick(now);
    if (breaks.length || (recoilAt && now - recoilAt < 220)) kick();
    else if (done) {
      ice.remove(); fx.remove(); if (tcv) tcv.remove();
    }
  }

  function placePick() {
    var visible = !!(tcv && mouseAt && hovered >= 0 && !state[hovered].thawed && !done);
    pane.classList.toggle("is-picking",visible);
    if (!tcv) return;
    tcv.classList.toggle("on",visible);
    if (visible) tcv.style.transform = "translate3d("+(mouseAt.x-HX)+"px,"+(mouseAt.y-HY)+"px,0)";
  }
  function paintPick(now) {
    placePick();
    if (!tcv || !tcv.classList.contains("on")) return;
    tctx.clearRect(0,0,TW,TH);
    var rebound = recoilAt ? Math.max(0,1-(now-recoilAt)/220) : 0;
    drawPick(tctx,HX,HY,press ? .94 : 1,rebound);
  }
  function drawPick(c,x,y,scale,rebound) {
    c.save(); c.translate(x,y); c.rotate(-.67-rebound*.12); c.scale(scale,scale);
    c.shadowColor="rgba(24,46,58,.2)"; c.shadowBlur=5*dpr; c.shadowOffsetY=3*dpr;
    var wood=c.createLinearGradient(-11,0,11,0);
    wood.addColorStop(0,"#ba7840"); wood.addColorStop(.35,"#f1c18b"); wood.addColorStop(.65,"#e2a364"); wood.addColorStop(1,"#ac6c36");
    c.fillStyle=wood; continuousRect(c,-11,-70,22,39,11); c.fill();
    c.shadowColor="transparent";
    c.strokeStyle="rgba(124,70,30,.18)"; c.lineWidth=.7;
    [-5,0,5].forEach(function (gx) { c.beginPath(); c.moveTo(gx,-63); c.quadraticCurveTo(gx-2,-49,gx+1,-37); c.stroke(); });
    var blue=c.createLinearGradient(-10,0,10,0);
    blue.addColorStop(0,"#479fc4"); blue.addColorStop(.45,"#b5ecff"); blue.addColorStop(1,"#4294bc");
    c.fillStyle=blue; continuousRect(c,-10,-35,20,7,3); c.fill();
    var metal=c.createLinearGradient(-10,0,10,0);
    metal.addColorStop(0,"#788791"); metal.addColorStop(.32,"#eef4f7"); metal.addColorStop(.55,"#bcc9d1"); metal.addColorStop(.78,"#f7fbfc"); metal.addColorStop(1,"#84959f");
    c.fillStyle=metal; c.beginPath(); c.moveTo(-9,-28); c.lineTo(9,-28);
    c.lineTo(6,-18); c.lineTo(1.2,-1); c.quadraticCurveTo(0,1,-1.2,-1); c.lineTo(-6,-18); c.closePath(); c.fill();
    c.strokeStyle="rgba(62,85,98,.3)"; c.lineWidth=.7; c.stroke();
    c.beginPath(); c.moveTo(-6,-18); c.lineTo(6,-18); c.stroke();
    c.restore();
  }
  function local(e) {
    var r = pane.getBoundingClientRect();
    return { x:e.clientX-r.left, y:e.clientY-r.top };
  }
  function indexOf(target) {
    var li=target && target.closest ? target.closest(".lore-mini > li") : null;
    return li ? items.indexOf(li) : -1;
  }
  function onMove(e) {
    if (press && Math.hypot(e.clientX-press.clientX,e.clientY-press.clientY)>10) cancelPress();
    if (e.pointerType !== "mouse") return;
    mouseAt={x:e.clientX,y:e.clientY}; hovered=indexOf(e.target);
    paintPick(performance.now());
  }
  function cancelPress() { if (!press) return; cancelledTap=true; press=null; kick(); }
  pane.addEventListener("pointerenter",onMove);
  pane.addEventListener("pointermove",onMove);
  pane.addEventListener("pointerleave",function () { mouseAt=null; hovered=-1; cancelPress(); placePick(); });
  pane.addEventListener("pointerdown",function (e) {
    pointerAt=Date.now(); cancelledTap=false;
    if (!e.isPrimary || e.button!==0 || done) return;
    var i=indexOf(e.target); if(i<0 || state[i].thawed) return;
    if (!near) arrive();
    var p=local(e);
    press={i:i,x:p.x,y:p.y,clientX:e.clientX,clientY:e.clientY};
    onMove(e); sound("tick"); kick();
  });
  window.addEventListener("pointerup",function () { if (press) { press=null; kick(); } });
  pane.addEventListener("pointercancel",cancelPress);
  window.addEventListener("blur",function () { cancelPress(); mouseAt=null; hovered=-1; placePick(); });
  window.addEventListener("scroll",function () {
    cancelPress();
    if (!mouseAt || done) return;
    hovered=indexOf(document.elementFromPoint(mouseAt.x,mouseAt.y));
    paintPick(performance.now());
  },{passive:true});
  pane.addEventListener("click",function (e) {
    var i=indexOf(e.target); if(i<0) return;
    if(cancelledTap && e.detail!==0) { cancelledTap=false; e.preventDefault(); e.stopPropagation(); return; }
    if(state[i].thawed) { hovered=-1; placePick(); return; }
    e.preventDefault(); e.stopPropagation();
    var p=e.detail===0 ? {x:null,y:null} : local(e);
    revealItem(i,p.x,p.y);
  },true);
  // Keyboard focus uncovers the icon; its button continues to open the detail.
  pane.addEventListener("focusin",function (e) {
    if(Date.now()-pointerAt<600) return;
    var i=indexOf(e.target); if(i>=0) revealItem(i,null,null,true);
  });
  allBtn.addEventListener("click",function () {
    // This is the fast path for people who want to browse, without a wall of effects.
    if(!near) arrive();
    breaks=[]; press=null;
    state.forEach(function(s,i) { s.thawed=true; items[i].classList.remove("is-breaking"); });
    thawedCount=items.length; ctx.clearRect(0,0,W,H);
    updateCount(); placePick(); kick();
  });

  /* ── Build, and rebuild when the layout moves ─────────────────────── */

  // Resizing preserves all revealed icons; old flying fragments can be discarded.
  function build() {
    breaks = []; press = null;
    measure();
    size();
    paint();
    state.forEach(function (s, i) {
      if (!s.thawed) return;
      items[i].classList.remove("is-breaking");
      items[i].classList.add("is-thawed");
      ctx.save();
      ctx.globalCompositeOperation = "destination-out";
      ctx.shadowColor = "#000";
      ctx.shadowBlur = 10 * dpr;
      ctx.fillStyle = "#000";
      continuousRect(ctx, s.rect.x - 1, s.rect.y - 1, s.rect.w + 2, s.rect.h + 2, 12);
      ctx.fill();
      ctx.restore();
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
  // scrolling remains available; Reveal all is the immediate alternative.

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
