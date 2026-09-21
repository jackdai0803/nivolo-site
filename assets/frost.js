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
  var RADIUS = 22;               // the pane's corner, matches .frost in styles.css
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

  // Status line above the ice: a count, and a way past it for anyone who
  // would rather just read.
  var bar = document.createElement("div");
  bar.className = "frost-bar";
  bar.innerHTML = '<span class="frost-count"></span><span class="frost-sep" aria-hidden="true"></span>' +
                  '<button type="button" class="frost-all">Thaw all</button>';
  pane.parentNode.insertBefore(bar, pane);
  var countEl = bar.querySelector(".frost-count");
  var allBtn = bar.querySelector(".frost-all");

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
      ["h5", "p"].forEach(function (sel, k) {
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
    dpr = Math.min(2, window.devicePixelRatio || 1);
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
    cols = Math.ceil(W / CELL);
    rows = Math.ceil(H / CELL);
    cells = new Float32Array(cols * rows);
    for (var k = 0; k < cells.length; k++) cells[k] = 1;
  }

  function roundRect(c, x, y, w, h, r) {
    c.beginPath();
    c.moveTo(x + r, y);
    c.arcTo(x + w, y, x + w, y + h, r);
    c.arcTo(x + w, y + h, x, y + h, r);
    c.arcTo(x, y + h, x, y, r);
    c.arcTo(x, y, x + w, y, r);
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

  function paint() {
    var rnd = seeded(11);
    ctx.globalCompositeOperation = "source-over";
    ctx.clearRect(0, 0, W, H);
    ctx.save();
    roundRect(ctx, 0.5, 0.5, W - 1, H - 1, RADIUS);
    ctx.clip();

    // The body: pale glacier blue, a shade deeper toward the foot.
    var g = ctx.createLinearGradient(0, 0, 0, H);
    g.addColorStop(0, "#E4EEF3");
    g.addColorStop(1, "#D3E3EA");
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, W, H);

    // What's trapped inside: each icon a soft bloom of its own colour,
    // each line of text a smudge. Enough to want, not enough to read.
    state.forEach(function (s) {
      s.lines.forEach(smudge);
      if (s.img) ghost(s.img);
    });

    rim();
    grain(rnd);
    ferns(rnd);
    writing();
    ctx.restore();

    roundRect(ctx, 0.5, 0.5, W - 1, H - 1, RADIUS);
    ctx.strokeStyle = "rgba(20, 112, 159, 0.16)";
    ctx.lineWidth = 1;
    ctx.stroke();
  }

  var blobs = {};
  function blob(im) {
    var key = im.el.currentSrc || im.el.src;
    if (blobs[key]) return blobs[key];
    if (!im.el.complete || !im.el.naturalWidth) return null;
    // Shrink the icon to 4x4 and let smoothing blow it back up: the
    // cheapest blur there is, and it works where ctx.filter doesn't.
    var tiny = document.createElement("canvas");
    tiny.width = tiny.height = 4;
    tiny.getContext("2d").drawImage(im.el, 0, 0, 4, 4);
    var S = 48, soft = document.createElement("canvas");
    soft.width = soft.height = S;
    var sc = soft.getContext("2d");
    sc.imageSmoothingEnabled = true;
    sc.drawImage(tiny, 0, 0, S, S);
    sc.globalCompositeOperation = "destination-in";
    var rg = sc.createRadialGradient(S / 2, S / 2, 0, S / 2, S / 2, S / 2);
    rg.addColorStop(0, "rgba(0,0,0,1)");
    rg.addColorStop(0.55, "rgba(0,0,0,0.75)");
    rg.addColorStop(1, "rgba(0,0,0,0)");
    sc.fillStyle = rg;
    sc.fillRect(0, 0, S, S);
    return (blobs[key] = soft);
  }

  function ghost(im) {
    var b = blob(im);
    if (!b) return;
    var grow = im.w * 0.5;
    ctx.globalAlpha = 0.55;
    ctx.drawImage(b, im.x - grow, im.y - grow, im.w + grow * 2, im.h + grow * 2);
    ctx.globalAlpha = 1;
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
    roundRect(ctx, l.x - 4000, l.y + (l.h - hh) / 2, l.w, hh, hh / 2);
    ctx.fill();
    ctx.restore();
  }

  // Frost is thicker at the edge of a pane than in the middle.
  function rim() {
    ctx.save();
    ctx.shadowColor = "rgba(255, 255, 255, 0.95)";
    ctx.shadowBlur = 26 * dpr;
    ctx.lineWidth = 30;
    ctx.strokeStyle = "rgba(255, 255, 255, 0.85)";
    roundRect(ctx, -14, -14, W + 28, H + 28, RADIUS + 14);
    ctx.stroke();
    ctx.restore();
  }

  var grainPattern = null;
  function grain(rnd) {
    if (!grainPattern) {
      var n = 160, gc = document.createElement("canvas");
      gc.width = gc.height = n;
      var g2 = gc.getContext("2d"), id = g2.createImageData(n, n), d = id.data;
      for (var i = 0; i < d.length; i += 4) {
        var v = rnd();
        if (v > 0.93) { d[i] = d[i + 1] = d[i + 2] = 255; d[i + 3] = 60 + rnd() * 120; }
        else if (v < 0.05) { d[i] = 132; d[i + 1] = 170; d[i + 2] = 194; d[i + 3] = 36 + rnd() * 44; }
      }
      g2.putImageData(id, 0, 0);
      grainPattern = ctx.createPattern(gc, "repeat");
    }
    ctx.fillStyle = grainPattern;
    ctx.fillRect(0, 0, W, H);
    var count = Math.round(W * H / 900);
    for (var k = 0; k < count; k++) {
      ctx.fillStyle = "rgba(255, 255, 255, " + (0.5 + rnd() * 0.5).toFixed(2) + ")";
      ctx.beginPath();
      ctx.arc(rnd() * W, rnd() * H, 0.4 + rnd() * 0.9, 0, 6.2832);
      ctx.fill();
    }
  }

  // Window frost grows in from the frame as feathered fronds. Each is
  // drawn twice, a faint blue-grey line under a white one, so it reads as
  // relief in the ice rather than a white drawing on it.
  function ferns(rnd) {
    var per = 2 * (W + H), n = Math.round(per / 46);
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    for (var i = 0; i < n; i++) {
      var t = rnd() * per, x, y, a;
      if (t < W) { x = t; y = 0; a = Math.PI / 2; }
      else if (t < W + H) { x = W; y = t - W; a = Math.PI; }
      else if (t < 2 * W + H) { x = t - W - H; y = H; a = -Math.PI / 2; }
      else { x = 0; y = t - 2 * W - H; a = 0; }
      frond(x, y, a + (rnd() - 0.5) * 1.1, 22 + rnd() * rnd() * 130, 0, rnd);
    }
  }
  // Barbs come off both sides of every segment at ~55 degrees and shorten
  // toward the tip, which is what makes it a feather and not a twig.
  function frond(x, y, a, len, depth, rnd) {
    var steps = Math.max(3, Math.round(len / 5)), seg = len / steps;
    var pts = [x, y], bend = (rnd() - 0.5) * 0.05;
    for (var s = 0; s < steps; s++) {
      a += bend + (rnd() - 0.5) * 0.12;
      x += Math.cos(a) * seg;
      y += Math.sin(a) * seg;
      pts.push(x, y);
      if (depth < 2 && s > 0) {
        var bl = len * (depth ? 0.3 : 0.3) * Math.pow(1 - s / steps, 0.8);
        for (var side = -1; side <= 1; side += 2) {
          if (rnd() > (depth ? 0.7 : 0.92)) continue;
          var l2 = bl * (0.7 + rnd() * 0.45);
          if (l2 > 3.5) frond(x, y, a + side * (0.9 + rnd() * 0.22), l2, depth + 1, rnd);
        }
      }
    }
    line(pts, "rgba(96, 138, 164, " + (0.16 - depth * 0.04) + ")", 1.3 - depth * 0.3, 0.6);
    line(pts, "rgba(255, 255, 255, " + (0.9 - depth * 0.18) + ")", 0.95 - depth * 0.22, 0);
  }
  function line(pts, color, width, dy) {
    ctx.beginPath();
    ctx.moveTo(pts[0], pts[1] + dy);
    for (var i = 2; i < pts.length; i += 2) ctx.lineTo(pts[i], pts[i + 1] + dy);
    ctx.strokeStyle = color;
    ctx.lineWidth = width;
    ctx.stroke();
  }

  // The invitation, written on the glass the way you would with a
  // fingertip: darker where the frost was wiped, a bright lip under it.
  function writing() {
    var msg = FINE ? "linger here to thaw" : "tap one to thaw it";
    var fs = Math.round(Math.max(21, Math.min(30, W / 28)));
    var x = W / 2, y = Math.min(H / 2, 118);
    ctx.save();
    ctx.font = "italic 500 " + fs + "px Newsreader, 'Iowan Old Style', Georgia, serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillStyle = "rgba(255, 255, 255, 0.75)";
    ctx.fillText(msg, x, y + 1.2);
    ctx.shadowColor = "rgba(60, 100, 124, 0.35)";
    ctx.shadowBlur = 1.5 * dpr;
    ctx.fillStyle = "rgba(62, 104, 128, 0.42)";
    ctx.fillText(msg, x, y);
    ctx.restore();
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

  var thaws = [];
  function thawItem(i, ox, oy, quiet) {
    var s = state[i];
    if (s.thawed) return;
    s.thawed = true;
    s.thawedAt = Date.now();
    thawedCount++;
    items[i].classList.add("is-thawed");
    var r = s.rect;
    if (ox == null) { ox = r.x + 30; oy = r.y + r.h / 2; } // from the icon outward
    var far = Math.sqrt(Math.pow(Math.max(ox - r.x, r.x + r.w - ox), 2) +
                        Math.pow(Math.max(oy - r.y, r.y + r.h - oy), 2));
    thaws.push({ i: i, x: ox, y: oy, t0: 0, far: far + 16 });
    if (!quiet) drip();
    updateCount();
    kick();
  }
  function stepThaws(now) {
    for (var k = thaws.length - 1; k >= 0; k--) {
      var t = thaws[k], r = state[t.i].rect;
      if (!t.t0) t.t0 = now;
      var p = Math.min(1, (now - t.t0) / 560), e = 1 - Math.pow(1 - p, 3);
      var R = Math.max(2, t.far * e);
      ctx.save();
      roundRect(ctx, r.x - 6, r.y - 6, r.w + 12, r.h + 12, 16);
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
        roundRect(ctx, r.x - 1, r.y - 1, r.w + 2, r.h + 2, 12);
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
    countEl.textContent = thawedCount + " of " + items.length + " thawed";
    if (thawedCount === items.length) finish();
  }
  function finish() {
    if (done) return;
    done = true;
    allBtn.hidden = true;
    bar.classList.add("is-done");
    countEl.textContent = "All " + items.length + " thawed. In the app, they take a little longer.";
    pane.classList.remove("is-frozen");
    // Let the last thaw finish, then fade the canvases out and drop them.
    setTimeout(function () {
      pane.classList.add("is-clear");
      setTimeout(function () {
        cancelAnimationFrame(raf);
        if (ice.parentNode) ice.parentNode.removeChild(ice);
        if (fx.parentNode) fx.parentNode.removeChild(fx);
      }, 900);
    }, 650);
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
    if (!raf && !done) { last = 0; raf = requestAnimationFrame(tick); }
  }
  function tick(now) {
    raf = 0;
    var dt = last ? Math.min(50, now - last) : 16.7;
    last = now;
    var busy = false;
    if (heat.on && thawedCount < items.length) {
      // A still cursor or a held finger keeps radiating, and the patch
      // under it widens the longer it stays.
      heat.dwell = Math.min(1, heat.dwell + dt / 1500);
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
    if (busy) raf = requestAnimationFrame(tick);
    else clearFx();
  }

  // The warm light itself, on its own canvas so it never marks the ice.
  function drawFx(now) {
    clearFx();
    fxc.save();
    roundRect(fxc, 0, 0, W, H, RADIUS);
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
    if (heat.on && FINE && thawedCount < items.length) drawTorch(heat.x, heat.y, now);
    bits.forEach(function (b) { if (!b.steam) ember(b); });
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
  function drawTorch(x, y, now) {
    var c = fxc;
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
      // Over an icon that has already thawed the torch goes out and the
      // ordinary hand comes back: here a click opens, it doesn't melt.
      var i = indexOf(e.target);
      if (i >= 0 && state[i].thawed) { heat.on = false; kick(); return; }
      if (heat.on) sweep(heat.x, heat.y, p.x, p.y);
      else torch.px = p.x;
      heat.on = true;
    } else if (heat.on) {
      sweep(heat.x, heat.y, p.x, p.y);
    } else {
      return;
    }
    heat.x = p.x; heat.y = p.y;
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
    if (done || e.pointerType === "mouse") return;
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

  allBtn.addEventListener("click", function () {
    var k = 0;
    state.forEach(function (s, i) {
      if (s.thawed) return;
      var n = k++;
      setTimeout(function () { thawItem(i, null, null, n % 3 !== 0); }, 70 * n);
    });
  });

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
      roundRect(ctx, s.rect.x - 1, s.rect.y - 1, s.rect.w + 2, s.rect.h + 2, 12);
      ctx.fill();
      ctx.restore();
      clearCells(s.rect);
    });
    lastW = W;
  }

  build();
  updateCount();

  // Fonts and lazy icons land after the first paint and move the text and
  // colour blooms. Repaint for them only while the ice is untouched.
  function refresh() { if (!touched && !done) build(); }
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(refresh);
  items.forEach(function (li) {
    var img = li.querySelector("img");
    if (img && !img.complete) img.addEventListener("load", refresh);
  });
  if (window.ResizeObserver) {
    new ResizeObserver(function () {
      if (done) return;
      var w = Math.round(pane.getBoundingClientRect().width);
      if (!touched || Math.abs(w - lastW) > 1) build();
    }).observe(pane);
  } else {
    window.addEventListener("resize", function () { if (!done) build(); });
  }
})();
