/* Nivolo night sky + icon-bowl physics hero.
   Requires matter.js (loaded before this script); degrades to a static
   arrangement when Matter is missing or reduced motion is preferred. */
(function () {
  "use strict";

  var REDUCED = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ── Star field ─────────────────────────────────────────────── */
  var sky = document.createElement("div");
  sky.className = "sky";
  sky.setAttribute("aria-hidden", "true");
  var starCount = window.innerWidth < 640 ? 50 : 95;
  for (var i = 0; i < starCount; i++) {
    var s = document.createElement("i");
    var size = Math.random() < 0.85 ? 1 + Math.random() : 2 + Math.random();
    s.style.width = s.style.height = size.toFixed(1) + "px";
    s.style.left = (Math.random() * 100).toFixed(2) + "%";
    s.style.top = (Math.random() * 100).toFixed(2) + "%";
    s.style.setProperty("--o", (0.25 + Math.random() * 0.55).toFixed(2));
    s.style.setProperty("--tw", (3 + Math.random() * 5).toFixed(1) + "s");
    s.style.setProperty("--td", (-Math.random() * 8).toFixed(1) + "s");
    sky.appendChild(s);
  }
  document.body.prepend(sky);

  /* ── Icon bowl ──────────────────────────────────────────────── */
  var pit = document.getElementById("iconPit");
  var stage = document.getElementById("pitStage");
  if (!pit || !stage) return;

  /* Container variants: iceberg is the shipped default (Jack's pick,
     2026-08-13); ?variant=bowl|zerog keep the alternatives reachable. */
  var VARIANT = (location.search.match(/[?&]variant=([a-z]+)/) || [])[1] || "iceberg";
  if (VARIANT !== "bowl") pit.classList.add("pit--" + VARIANT);

  var ICONS = [
    ["classic", "Classic"],
    ["blaze", "Blaze"],
    ["gold", "Gold"],
    ["party", "Party"],
    ["ghost", "Ghost"],
    ["glitch", "Glitch"],
    ["grumpy", "Grumpy"],
    ["melting", "Melty"],
    ["sick", "Sick Day"],
    ["snowy", "Snowy"],
    ["bored", "Bored"],
    ["champion", "Champion"],
    ["detective", "Detective"],
    ["focused", "Focused"],
    ["love", "Love"],
    ["peekaboo", "Peekaboo"],
    ["rainy", "Rainy"],
    ["relieved", "Relieved"],
    ["repair", "Repair"],
    ["revived", "Revived"],
    ["sleepy", "Sleepy"],
    ["squished", "Squished"],
    ["starstruck", "Starstruck"],
    ["turbo", "Turbo"],
    ["upside_down", "Upside Down"],
    ["waiting", "Waiting"],
    ["coming_soon", "More coming soon…"],
  ];
  // Pour cadence scales down as the roster grows so the show stays short.
  var SPAWN_GAP = Math.max(130, Math.round(4800 / ICONS.length));

  function iconSrc(name) { return "assets/icons/" + name + ".png"; }

  /* Static fallback: icons resting in the bowl, no physics. */
  function staticFallback() {
    var w = stage.clientWidth, h = stage.clientHeight;
    var size = iconSize();
    var cx = w / 2;
    var mobile = w < 640;
    // Rows rest on the container floor: berg surface or bowl belly.
    var iceberg = VARIANT === "iceberg";
    var bowlW = iceberg ? Math.min(680, w * 0.78) : Math.min(760, w * 0.92);
    var baseY = iceberg
      ? h - (mobile ? 90 : 120) - (mobile ? 24 : 34) + 4
      : h - 12 - 60;
    var PER_ROW = 7;
    ICONS.forEach(function (icon, i) {
      var el = document.createElement("div");
      el.className = "pit-icon";
      el.style.width = el.style.height = size + "px";
      var row = Math.floor(i / PER_ROW);
      var inRow = Math.min(PER_ROW, ICONS.length - row * PER_ROW);
      var idx = i % PER_ROW;
      // Rows narrow as the mound rises so it reads as a pile, not a wall.
      var spread = bowlW * Math.max(0.3, (iceberg ? 0.78 : 0.62) - row * 0.09);
      var x = inRow === 1 ? cx - size / 2
        : cx - spread / 2 + (spread / (inRow - 1)) * idx - size / 2;
      var y = baseY - row * (size + 6) - size / 2;
      var rot = (Math.random() * 24 - 12).toFixed(1);
      el.style.transform = "translate(" + x + "px," + y + "px) rotate(" + rot + "deg)";
      el.innerHTML = '<img src="' + iconSrc(icon[0]) + '" alt="' + icon[1] + ' app icon" />';
      stage.appendChild(el);
    });
    pit.classList.add("ready");
  }

  if (REDUCED || typeof Matter === "undefined") {
    staticFallback();
    return;
  }

  /* Berg and pile bob as one unit over still water (visual only — the
     physics stays in unbobbed coordinates; the few px of drift is well
     inside every tap target). Inert outside the iceberg variant. */
  var bobWrap = document.createElement("div");
  bobWrap.className = "pit-bob";
  var bergVisual = stage.querySelector(".bowl-visual");
  if (bergVisual) bobWrap.appendChild(bergVisual);
  stage.insertBefore(bobWrap, stage.firstChild);

  var Engine = Matter.Engine, Bodies = Matter.Bodies, Body = Matter.Body,
      Composite = Matter.Composite, Constraint = Matter.Constraint,
      Query = Matter.Query, Vector = Matter.Vector;

  var engine = Engine.create({ enableSleeping: true });
  engine.gravity.y = VARIANT === "zerog" ? 0 : 1;

  var walls = [];
  var icons = []; // { body, el, key, label }
  var rimYCurrent = 0;   // top of the container, set by buildWalls
  var bowlHalfCurrent = 0; // container half-width, set by buildWalls
  var waterYCurrent = 0; // iceberg only: the waterline, set by buildWalls
  var skyTop = 0;        // stage-relative y of the PAGE top (negative)

  /* Stage-relative y of the top of the page — icons spawn above it so
     they enter falling from the real top of the viewport. */
  function measureSky() {
    var r = stage.getBoundingClientRect();
    skyTop = -(r.top + window.scrollY);
  }

  function stageSize() {
    return { w: stage.clientWidth, h: stage.clientHeight };
  }

  function iconSize() {
    // Size from container area vs roster count: fill ~55% of the bowl's
    // half-ellipse so the pile settles below the rim (resting above it
    // trips the arch-breaker and the pile never sleeps). Cap at 88:
    // bigger and a few icons wedge into a stable arch across the mouth.
    var s = stageSize();
    if (VARIANT === "zerog") {
      // Free-floating: fill ~28% of the whole stage.
      return Math.round(Math.max(36, Math.min(84, Math.sqrt(s.w * s.h * 0.28 / ICONS.length))));
    }
    var bw = Math.min(760, s.w * 0.92);
    var bh = s.w < 640 ? 200 : 285;
    var area = Math.PI * (bw / 2) * bh / 2;
    var size = Math.sqrt(area * 0.55 / ICONS.length);
    if (VARIANT === "iceberg") size *= 0.8; // open mound holds less than a bowl
    return Math.round(Math.max(26, Math.min(88, size)));
  }

  /* Build the bowl from static segments tracing a U-shaped ellipse arc
     that matches .bowl-visual, plus outer guards so tossed icons return. */
  function buildWalls() {
    walls.forEach(function (wb) { Composite.remove(engine.world, wb); });
    walls = [];
    var s = stageSize();
    var cx = s.w / 2;
    measureSky();
    sizeLines();

    if (VARIANT === "zerog") {
      // Drift tank: thick borders just outside every stage edge.
      rimYCurrent = 0; bowlHalfCurrent = s.w / 2;
      var t = 80;
      walls.push(Bodies.rectangle(cx, -t / 2 + 6, s.w + 240, t, { isStatic: true, restitution: 1 }));
      walls.push(Bodies.rectangle(cx, s.h + t / 2 - 6, s.w + 240, t, { isStatic: true, restitution: 1 }));
      walls.push(Bodies.rectangle(-t / 2 + 6, s.h / 2, t, s.h + 240, { isStatic: true, restitution: 1 }));
      walls.push(Bodies.rectangle(s.w + t / 2 - 6, s.h / 2, t, s.h + 240, { isStatic: true, restitution: 1 }));
      walls.forEach(function (wb) { Composite.add(engine.world, wb); });
      return;
    }

    if (VARIANT === "iceberg") {
      // Floe: a gently dished slab at the waterline; ends slope off into
      // the water, and anything that sinks gets re-dropped from the sky.
      var mobile = s.w < 640;
      var waterY = s.h - (mobile ? 90 : 120);
      var bergW = Math.min(680, s.w * 0.78);
      var topEnd = waterY - (mobile ? 24 : 34);
      var dip = 13, half = bergW / 2, quarter = bergW / 4;
      waterYCurrent = waterY;
      rimYCurrent = topEnd;
      bowlHalfCurrent = half;
      var slope = Math.atan(dip / half);
      var segLen = Math.sqrt(half * half + dip * dip) + 6;
      walls.push(Bodies.rectangle(cx - quarter, topEnd + dip / 2 + 14, segLen, 30, { isStatic: true, angle: slope, friction: 0.35, restitution: 0.1 }));
      walls.push(Bodies.rectangle(cx + quarter, topEnd + dip / 2 + 14, segLen, 30, { isStatic: true, angle: -slope, friction: 0.35, restitution: 0.1 }));
      // Underwater flanks lean outward so edge landings slide off, not perch.
      walls.push(Bodies.rectangle(cx - half - 35, topEnd + 79, 30, 150, { isStatic: true, angle: 0.5 }));
      walls.push(Bodies.rectangle(cx + half + 35, topEnd + 79, 30, 150, { isStatic: true, angle: -0.5 }));
      // Water floor inside the stage: sunk icons rest hidden in the water
      // band until the maintenance pass re-drops them.
      walls.push(Bodies.rectangle(cx, s.h + 8, s.w + 240, 40, { isStatic: true }));
      var skyHb = -skyTop + 600;
      walls.push(Bodies.rectangle(-40, topEnd - skyHb / 2, 80, skyHb + s.h, { isStatic: true }));
      walls.push(Bodies.rectangle(s.w + 40, topEnd - skyHb / 2, 80, skyHb + s.h, { isStatic: true }));
      walls.push(Bodies.rectangle(cx, skyTop - 460, s.w + 400, 80, { isStatic: true }));
      walls.forEach(function (wb) { Composite.add(engine.world, wb); });
      return;
    }

    var bowlW = Math.min(760, s.w * 0.92);
    var bowlH = s.w < 640 ? 200 : 285;
    var rimY = s.h - 12 - bowlH;
    rimYCurrent = rimY;
    var a = bowlW / 2, b = bowlH;
    bowlHalfCurrent = a;

    var pts = [];
    var SEGS = 26;
    for (var i = 0; i <= SEGS; i++) {
      var t = Math.PI + (Math.PI * i) / SEGS; // 180° → 360°
      pts.push({ x: cx + a * Math.cos(t), y: rimY + -b * Math.sin(t) });
    }
    for (var j = 0; j < pts.length - 1; j++) {
      var p1 = pts[j], p2 = pts[j + 1];
      var mid = { x: (p1.x + p2.x) / 2, y: (p1.y + p2.y) / 2 };
      var len = Math.hypot(p2.x - p1.x, p2.y - p1.y) + 6;
      var ang = Math.atan2(p2.y - p1.y, p2.x - p1.x);
      walls.push(Bodies.rectangle(mid.x, mid.y + 14, len, 30, {
        isStatic: true, angle: ang, friction: 0.4, restitution: 0.1,
      }));
    }
    // Funnel flares instead of near-vertical guards: their lower ends sit
    // at the rim endpoints and they lean 20° outward, so the rim corner is
    // obtuse — edge landings slide into the bowl, and columns can't stack
    // against them the way they could against a vertical wall.
    var skyH = -skyTop + 600;
    var FLARE = 0.35, glen = 560, ghalf = glen / 2;
    var gdx = Math.sin(FLARE) * ghalf, gdy = Math.cos(FLARE) * ghalf;
    walls.push(Bodies.rectangle(cx - a - 4 - gdx, rimY + 10 - gdy, 28, glen, { isStatic: true, angle: -FLARE }));
    walls.push(Bodies.rectangle(cx + a + 4 + gdx, rimY + 10 - gdy, 28, glen, { isStatic: true, angle: FLARE }));
    walls.push(Bodies.rectangle(-40, rimY - skyH / 2, 80, skyH + s.h, { isStatic: true }));
    walls.push(Bodies.rectangle(s.w + 40, rimY - skyH / 2, 80, skyH + s.h, { isStatic: true }));
    walls.push(Bodies.rectangle(cx, skyTop - 460, s.w + 400, 80, { isStatic: true }));
    walls.push(Bodies.rectangle(cx, s.h + 220, s.w + 400, 80, { isStatic: true })); // last-resort net
    walls.forEach(function (wb) { Composite.add(engine.world, wb); });
  }

  function spawnIcons() {
    var s = stageSize();
    var size = iconSize();
    var cx = s.w / 2;

    if (VARIANT === "zerog") {
      // Scatter on a jittered grid with a slow drift; no pour.
      var cols = Math.ceil(Math.sqrt(ICONS.length * s.w / s.h));
      var rows = Math.ceil(ICONS.length / cols);
      ICONS.forEach(function (icon, i) {
        var el = document.createElement("div");
        el.className = "pit-icon";
        el.style.width = el.style.height = size + "px";
        el.innerHTML = '<img src="' + iconSrc(icon[0]) + '" alt="' + icon[1] + ' app icon" draggable="false" />';
        bobWrap.appendChild(el);
        var gx = i % cols, gy = Math.floor(i / cols);
        var body = Bodies.rectangle(
          (s.w / (cols + 1)) * (gx + 1) + Math.random() * 36 - 18,
          (s.h / (rows + 1)) * (gy + 1) + Math.random() * 28 - 14,
          size, size,
          {
            chamfer: { radius: size * 0.225 },
            restitution: 0.9,
            friction: 0,
            frictionAir: 0.002,
            angle: Math.random() * 6.28,
          }
        );
        Body.setVelocity(body, { x: Math.random() * 1.6 - 0.8, y: Math.random() * 1.6 - 0.8 });
        Body.setAngularVelocity(body, Math.random() * 0.03 - 0.015);
        icons.push({ body: body, el: el, key: icon[0], label: icon[1] });
        setTimeout(function () {
          Composite.add(engine.world, body);
          if (i === ICONS.length - 1) pit.classList.add("ready");
        }, 60 * i);
      });
      return;
    }

    var halfBowl = VARIANT === "iceberg"
      ? Math.min(680, s.w * 0.78) / 2 * 0.75
      : Math.min(760, s.w * 0.92) / 2;
    // Drop points stay well inside the bowl mouth (alternating sides) so
    // icons slide down the curve — spreading to the rim lets them wedge
    // into a stable arch across the mouth; stacking one column is worse.
    var offsets = [-0.42, 0.34, -0.22, 0.42, -0.08, 0.16, -0.34, 0, 0.26, -0.14];
    ICONS.forEach(function (icon, i) {
      var el = document.createElement("div");
      el.className = "pit-icon";
      el.style.width = el.style.height = size + "px";
      el.innerHTML = '<img src="' + iconSrc(icon[0]) + '" alt="' + icon[1] + ' app icon" draggable="false" />';
      bobWrap.appendChild(el);

      var body = Bodies.rectangle(
        cx + halfBowl * (offsets[i % offsets.length] || 0),
        skyTop - size / 2 - Math.random() * 140,
        size, size,
        {
          chamfer: { radius: size * 0.225 },
          restitution: 0.35,
          friction: 0.08,
          frictionAir: 0.015,
          angle: Math.random() * 0.8 - 0.4,
        }
      );
      Body.setAngularVelocity(body, Math.random() * 0.08 - 0.04);
      icons.push({ body: body, el: el, key: icon[0], label: icon[1] });
      // Stagger the drop so they pour in rather than dump at once.
      setTimeout(function () {
        Composite.add(engine.world, body);
        if (i === ICONS.length - 1) pit.classList.add("ready");
      }, 260 + i * SPAWN_GAP);
    });
  }

  /* ── Bowl SFX: tiny synthesized clacks + pops (Web Audio, no assets).
     Arms on the first real pointer gesture (autoplay policy blocks
     anything earlier), so the initial pour is silent by design. ── */
  var sfx = (function () {
    var ctx = null, master = null, armed = false, lastAt = 0, played = 0;
    var muted = false;
    try { muted = localStorage.getItem("nivolo-sfx") === "off"; } catch (e) {}
    function ensure() {
      if (ctx) return ctx;
      var AC = window.AudioContext || window.webkitAudioContext;
      if (!AC) return null;
      ctx = new AC();
      master = ctx.createGain();
      master.gain.value = 0.5;
      master.connect(ctx.destination);
      return ctx;
    }
    function arm() {
      armed = true;
      var c = ensure();
      if (c && c.state === "suspended") c.resume();
    }
    /* Oscillator scheduled while the context is still resuming plays the
       moment it comes alive — no need to await resume(). */
    function tone(type, f0, f1, vol, dur) {
      var t = ctx.currentTime;
      var o = ctx.createOscillator(), g = ctx.createGain();
      o.type = type;
      o.frequency.setValueAtTime(f0, t);
      o.frequency.exponentialRampToValueAtTime(Math.max(1, f1), t + dur);
      g.gain.setValueAtTime(vol, t);
      g.gain.exponentialRampToValueAtTime(0.0004, t + dur);
      o.connect(g); g.connect(master);
      o.start(t); o.stop(t + dur + 0.02);
    }
    function hit(strength) {
      if (!armed || muted || !ctx) return;
      var t = ctx.currentTime;
      if (t - lastAt < 0.03) return; // a pile settling is one pop, not ten
      lastAt = t;
      played++;
      // Same rising "bloop" family as the grab pop — pitch and volume
      // scale with impact so landings pop and nudges blip.
      var v = 0.06 + 0.22 * strength;
      var f = 420 + Math.random() * 140 + 260 * strength;
      tone("sine", f * 0.52, f, v, 0.07);
    }
    function pop() {
      if (muted || !ensure()) return;
      played++;
      tone("sine", 330, 640, 0.14, 0.07);
    }
    function setMuted(m) {
      muted = m;
      try { localStorage.setItem("nivolo-sfx", m ? "off" : "on"); } catch (e) {}
    }
    return { arm: arm, hit: hit, pop: pop, setMuted: setMuted,
             isMuted: function () { return muted; },
             stats: function () { return { armed: armed, state: ctx ? ctx.state : null, played: played }; } };
  })();

  Matter.Events.on(engine, "collisionStart", function (e) {
    for (var i = 0; i < e.pairs.length; i++) {
      var pa = e.pairs[i];
      var rel = Math.hypot(pa.bodyA.velocity.x - pa.bodyB.velocity.x,
                           pa.bodyA.velocity.y - pa.bodyB.velocity.y);
      if (rel > 2.2) sfx.hit(Math.min(1, rel / 16));
    }
  });

  /* Any first gesture on the page unlocks audio (browser autoplay rule),
     so icons landing after that first click pop even if the visitor
     hasn't touched the bowl yet. Kept permanent: re-resumes if the
     browser ever re-suspends the context. */
  ["pointerdown", "pointerup", "keydown"].forEach(function (type) {
    document.addEventListener(type, function () { sfx.arm(); }, { capture: true, passive: true });
  });

  /* ── Drag interaction (custom constraint; keeps page scroll usable) ── */
  var dragConstraint = null;
  var dragMeta = null; // { startX, startY, t, item }

  function stagePoint(clientX, clientY) {
    var r = stage.getBoundingClientRect();
    return { x: clientX - r.left, y: clientY - r.top };
  }

  function bodyAt(pt) {
    var hits = Query.point(icons.map(function (it) { return it.body; }), pt);
    return hits.length ? hits[0] : null;
  }

  function startDrag(pt, clientEvent) {
    var body = bodyAt(pt);
    if (!body) return false;
    var local = Vector.rotate(Vector.sub(pt, body.position), -body.angle);
    dragConstraint = Constraint.create({
      pointA: pt,
      bodyB: body,
      pointB: local,
      length: 0,
      stiffness: 0.1,
      damping: 0.18,
    });
    Composite.add(engine.world, dragConstraint);
    Matter.Sleeping.set(body, false);
    dragMeta = { startX: pt.x, startY: pt.y, t: Date.now(), body: body };
    stage.classList.add("dragging");
    pit.classList.add("touched");
    sfx.pop();
    if (clientEvent && clientEvent.cancelable) clientEvent.preventDefault();
    return true;
  }

  function moveDrag(pt) {
    if (dragConstraint) dragConstraint.pointA = pt;
  }

  function endDrag(pt) {
    if (!dragConstraint) return;
    var meta = dragMeta;
    Composite.remove(engine.world, dragConstraint);
    dragConstraint = null;
    dragMeta = null;
    stage.classList.remove("dragging");
    // A short, small movement counts as a tap → show the icon's name.
    if (meta && pt && Date.now() - meta.t < 350 &&
        Math.hypot(pt.x - meta.startX, pt.y - meta.startY) < 7) {
      showName(meta.body);
    }
  }

  var nameChip = null;
  function showName(body) {
    var item = icons.find(function (it) { return it.body === body; });
    if (!item) return;
    if (nameChip) nameChip.remove();
    nameChip = document.createElement("span");
    nameChip.className = "pit-name pop";
    nameChip.textContent = item.label;
    nameChip.style.left = body.position.x + "px";
    nameChip.style.top = body.position.y + "px";
    stage.appendChild(nameChip);
    setTimeout(function () { if (nameChip) { nameChip.remove(); nameChip = null; } }, 1600);
  }

  stage.addEventListener("mousedown", function (e) {
    e.preventDefault(); // play area — never start a text selection here
    sfx.arm();
    if (startDrag(stagePoint(e.clientX, e.clientY), e)) {
      var onMove = function (ev) { moveDrag(stagePoint(ev.clientX, ev.clientY)); };
      var onUp = function (ev) {
        endDrag(stagePoint(ev.clientX, ev.clientY));
        window.removeEventListener("mousemove", onMove);
        window.removeEventListener("mouseup", onUp);
      };
      window.addEventListener("mousemove", onMove);
      window.addEventListener("mouseup", onUp);
    }
  });

  stage.addEventListener("touchstart", function (e) {
    var t = e.touches[0];
    sfx.arm();
    startDrag(stagePoint(t.clientX, t.clientY), e);
  }, { passive: false });
  stage.addEventListener("touchmove", function (e) {
    if (!dragConstraint) return;
    var t = e.touches[0];
    moveDrag(stagePoint(t.clientX, t.clientY));
    if (e.cancelable) e.preventDefault();
  }, { passive: false });
  stage.addEventListener("touchend", function (e) {
    var t = e.changedTouches[0];
    endDrag(stagePoint(t.clientX, t.clientY));
  });
  stage.addEventListener("touchcancel", function () { endDrag(null); });

  /* ── Constellation overlay (zerog only): faint lines join neighbors ── */
  var linesCanvas = null, linesCtx = null;
  if (VARIANT === "zerog") {
    linesCanvas = document.createElement("canvas");
    linesCanvas.className = "pit-lines";
    stage.insertBefore(linesCanvas, stage.firstChild);
    linesCtx = linesCanvas.getContext("2d");
  }
  function sizeLines() {
    if (!linesCanvas) return;
    linesCanvas.width = stage.clientWidth;
    linesCanvas.height = stage.clientHeight;
  }
  function drawLines() {
    if (!linesCtx) return;
    var REACH = 150;
    linesCtx.clearRect(0, 0, linesCanvas.width, linesCanvas.height);
    linesCtx.lineWidth = 1;
    for (var i = 0; i < icons.length; i++) {
      for (var j = i + 1; j < icons.length; j++) {
        var p = icons[i].body.position, q = icons[j].body.position;
        var d = Math.hypot(p.x - q.x, p.y - q.y);
        if (d > REACH) continue;
        linesCtx.strokeStyle = "rgba(150, 210, 255," + ((1 - d / REACH) * 0.35).toFixed(3) + ")";
        linesCtx.beginPath();
        linesCtx.moveTo(p.x, p.y);
        linesCtx.lineTo(q.x, q.y);
        linesCtx.stroke();
      }
    }
  }

  /* ── Render loop (DOM transforms; paused when off-screen) ────── */
  var running = false, rafId = null, lastT = 0;
  var SPEED_CAP = VARIANT === "zerog" ? 4 : 24;

  function frame(t) {
    if (!running) return;
    var dt = lastT ? Math.min(t - lastT, 33) : 16.7;
    lastT = t;
    Engine.update(engine, dt);
    for (var i = 0; i < icons.length; i++) {
      var it = icons[i], b = it.body, half = it.el.offsetWidth / 2;
      // Keep tosses fun but sub-orbital: cap linear and angular speed.
      var sp = Math.hypot(b.velocity.x, b.velocity.y);
      if (sp > SPEED_CAP) Body.setVelocity(b, { x: b.velocity.x * SPEED_CAP / sp, y: b.velocity.y * SPEED_CAP / sp });
      if (Math.abs(b.angularVelocity) > 0.45) Body.setAngularVelocity(b, 0.45 * Math.sign(b.angularVelocity));
      it.el.style.transform =
        "translate(" + (b.position.x - half).toFixed(1) + "px," +
        (b.position.y - half).toFixed(1) + "px) rotate(" + b.angle.toFixed(3) + "rad)";
    }
    drawLines();
    rafId = requestAnimationFrame(frame);
  }

  function setRunning(on) {
    if (on === running) return;
    running = on;
    lastT = 0;
    if (on) rafId = requestAnimationFrame(frame);
    else if (rafId) cancelAnimationFrame(rafId);
  }

  new IntersectionObserver(function (entries) {
    setRunning(entries[0].isIntersecting && !document.hidden);
  }, { threshold: 0.02 }).observe(stage);
  document.addEventListener("visibilitychange", function () {
    if (document.hidden) setRunning(false);
    else if (stage.getBoundingClientRect().bottom > 0) setRunning(true);
  });

  /* Maintenance pass on the ENGINE TICK (not wall clock — must advance
     with sim time, and pause with it). Escape hatch: anything that clips
     through geometry gets re-dropped. Arch breaker: icons at rest above
     the rim are perched or wedged — shear them loose. */
  var maintTick = 0;
  Matter.Events.on(engine, "afterUpdate", function () {
    if (++maintTick % 100 !== 0) return;
    var s = stageSize();
    if (VARIANT === "zerog") {
      icons.forEach(function (it) {
        var b = it.body, p = b.position;
        if (p.x < -80 || p.x > s.w + 80 || p.y < -80 || p.y > s.h + 80) {
          Body.setPosition(b, { x: s.w * (0.2 + Math.random() * 0.6), y: s.h * (0.2 + Math.random() * 0.6) });
          Body.setVelocity(b, { x: 0, y: 0 });
        }
        // Nothing truly stops in orbit: nudge the becalmed back adrift.
        if (!dragConstraint && b.speed < 0.15) {
          Matter.Sleeping.set(b, false);
          Body.setVelocity(b, {
            x: b.velocity.x + Math.random() * 0.8 - 0.4,
            y: b.velocity.y + Math.random() * 0.8 - 0.4,
          });
        }
      });
      return;
    }
    if (VARIANT === "iceberg") {
      icons.forEach(function (it) {
        var b = it.body, p = b.position;
        // Overboard: resting in the water (or gone entirely) → back in
        // from the sky, aimed at the floe.
        if (p.y > s.h + 160 || p.x < -160 || p.x > s.w + 160 ||
            (p.y > waterYCurrent + 24 && b.speed < 0.35)) {
          Body.setPosition(b, {
            x: s.w / 2 + (Math.random() * 2 - 1) * bowlHalfCurrent * 0.6,
            y: skyTop - 120,
          });
          Body.setVelocity(b, { x: 0, y: 0 });
          Matter.Sleeping.set(b, false);
        }
      });
      return;
    }
    icons.forEach(function (it) {
      var b = it.body, p = b.position;
      // Clipped through geometry, or settled in the dead channel between
      // the bowl and the stage edge → drop it back in from the sky.
      var inSideChannel = p.y > rimYCurrent && b.speed < 0.3 &&
        Math.abs(p.x - s.w / 2) > bowlHalfCurrent + 4;
      if (p.y > s.h + 160 || p.x < -160 || p.x > s.w + 160 || inSideChannel) {
        Body.setPosition(b, { x: s.w / 2 + (Math.random() * 240 - 120), y: skyTop - 120 });
        Body.setVelocity(b, { x: 0, y: 0 });
        Matter.Sleeping.set(b, false);
        return;
      }
      if (!dragConstraint && p.y < rimYCurrent && b.speed < 0.3) {
        // At rest above the rim = wedged near the mouth. Push INWARD —
        // topples piles into the bowl; outward jams them into the flares.
        Matter.Sleeping.set(b, false);
        Body.applyForce(b, p, {
          x: (p.x < s.w / 2 ? 1 : -1) * 0.006 * b.mass,
          y: 0.002 * b.mass,
        });
      }
    });
  });

  /* Rebuild walls on resize; nudge icons back over the bowl. */
  var resizeTimer = null;
  window.addEventListener("resize", function () {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(function () {
      buildWalls();
      var s = stageSize();
      icons.forEach(function (it) {
        Body.setPosition(it.body, {
          x: s.w / 2 + (Math.random() * 160 - 80),
          y: Math.min(it.body.position.y, s.h - 160),
        });
        Matter.Sleeping.set(it.body, false);
      });
    }, 220);
  });

  /* Mute toggle — only shown on the physics path (the reduced-motion
     fallback returns before this and stays silent). */
  var soundBtn = document.getElementById("pitSound");
  if (soundBtn) {
    soundBtn.hidden = false;
    var syncSound = function () {
      soundBtn.classList.toggle("muted", sfx.isMuted());
      soundBtn.setAttribute("aria-pressed", String(!sfx.isMuted()));
    };
    soundBtn.addEventListener("click", function () {
      sfx.setMuted(!sfx.isMuted());
      sfx.arm();
      if (!sfx.isMuted()) sfx.pop(); // audible confirmation
      syncSound();
    });
    syncSound();
  }

  buildWalls();
  spawnIcons();
  setRunning(true);
  // Button rects shift once the webfont lands — remeasure the terrain.
  if (document.fonts && document.fonts.ready) {
    document.fonts.ready.then(function () { buildWalls(); });
  }

  // Console/debug handle: lets tooling step the sim deterministically
  // (rAF never fires in hidden tabs, so screenshots freeze mid-pour).
  window.__nivolo = { engine: engine, icons: icons, sfx: sfx, step: function (n) {
    for (var i = 0; i < n; i++) Engine.update(engine, 16.7);
    drawLines();
  } };
  // ?settle fast-forwards past the pour once all icons have spawned —
  // for screenshot tooling that can't wait out the animation.
  if (/[?&]settle\b/.test(location.search)) {
    setTimeout(function () { window.__nivolo.step(2600); },
      260 + ICONS.length * SPAWN_GAP + 600);
  }
})();
