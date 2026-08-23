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

  /* Container variants: the floating ice shelf is the shipped default,
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
  /* ── How much shelf there is ──────────────────────────────────────────
     The floe is only as wide as the screen allows. A desktop floe carries
     the whole roster in three courses; a phone's ice is barely 290px
     across, where all 27 pile four deep, spread wider than the ice itself
     and push their own bottom course off the ends — which drops them in
     the sea, respawns them from the sky, and knocks the next ones off in
     turn, forever. So the shelf is cut to fit the ice: three courses with
     a margin at each tip, at a size that still reads at arm's length. */
  function bergWidthFor(w) { return Math.min(790, w * 0.846); }
  function idealSize(w) { return w < 640 ? 46 : 76; }
  function leastSize(w) { return w < 640 ? 40 : 54; }
  /* What a floe of width W holds, measured rather than guessed: a mound
     settles into three courses, the bottom one a body short of the ice at
     each end and every course above it losing about one and a half. Both
     the 980px stage (25 of 27 at 76px) and the 342px one (12 at 46px)
     land on n = 3W/size − slack, so the size that fits n is 3W/(n + slack).
     Narrow ice loses proportionally more to its own ends, so it keeps a
     bigger reserve: measured, a phone holds about three fewer than the
     desktop rule predicts. */
  function slack(w) { return w < 640 ? 10 : 7.5; }
  function sizeFor(w, n) { return Math.min(idealSize(w), 3 * bergWidthFor(w) / (n + slack(w))); }
  function rosterFor(w) {
    if (VARIANT !== "iceberg") return ICONS;
    // Shrink the icons before dropping any: the full shelf is the point.
    var fits = ICONS.length;
    while (fits > 6 && sizeFor(w, fits) < leastSize(w)) fits--;
    if (fits >= ICONS.length) return ICONS;
    // Classic leads and "more coming soon" closes; between them a shuffled
    // slice, so a phone doesn't always show the same faces.
    var rest = ICONS.slice(1, ICONS.length - 1);
    for (var i = rest.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var t = rest[i]; rest[i] = rest[j]; rest[j] = t;
    }
    return [ICONS[0]].concat(rest.slice(0, Math.max(4, fits - 2)), [ICONS[ICONS.length - 1]]);
  }
  var ROSTER = rosterFor(stage.clientWidth || window.innerWidth);
  // Pour cadence scales down as the roster grows so the show stays short.
  var SPAWN_GAP = Math.max(130, Math.round(4800 / ROSTER.length));

  function iconSrc(name) { return "assets/icons/" + name + ".png"; }

  /* Static fallback: icons resting in the bowl, no physics. */
  function staticFallback() {
    var w = stage.clientWidth, h = stage.clientHeight;
    var size = iconSize();
    var cx = w / 2;
    var mobile = w < 640;
    // Rows rest on the container floor: berg surface or bowl belly.
    var iceberg = VARIANT === "iceberg";
    var bowlW = iceberg ? Math.min(740, w * 0.82) : Math.min(760, w * 0.92);
    var baseY = iceberg
      ? h - (mobile ? 90 : 120) - (mobile ? 24 : 34) + 4
      : h - 12 - 60;
    var PER_ROW = 7;
    ROSTER.forEach(function (icon, i) {
      var el = document.createElement("div");
      el.className = "pit-icon";
      el.style.width = el.style.height = size + "px";
      var row = Math.floor(i / PER_ROW);
      var inRow = Math.min(PER_ROW, ROSTER.length - row * PER_ROW);
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
  var waterFadeStartCurrent = 0; // where submerged icons begin fading
  var waterFadeEndCurrent = 0; // where they vanish and re-enter from the sky
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
      return Math.round(Math.max(36, Math.min(84, Math.sqrt(s.w * s.h * 0.28 / ROSTER.length))));
    }
    if (VARIANT === "iceberg") {
      // The size at which the shelf the floe was given is the shelf it can
      // hold — see holds() above.
      return Math.round(Math.max(30, sizeFor(s.w, ROSTER.length)));
    }
    var bw = Math.min(760, s.w * 0.92);
    var bh = s.w < 640 ? 200 : 285;
    var area = Math.PI * (bw / 2) * bh / 2;
    var size = Math.sqrt(area * 0.55 / ROSTER.length);
    return Math.round(Math.max(30, Math.min(88, size)));
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
      // Match the PAINTED ice, not an arbitrary width: .bowl-visual is
      // min(840, 90%) wide and its clip-path keeps 3%..97% of that at the
      // top, so the ice a visitor can see is 94% of the box. The floe used
      // to be 50px narrower than the ice on each side, which put the outer
      // icons over painted-but-unsupported snow.
      var bergW = Math.min(790, s.w * 0.846);
      var topEnd = waterY - (mobile ? 24 : 34);
      var waterLayerH = mobile ? 240 : 300;
      var dip = 14, half = bergW / 2, quarter = bergW / 4;
      waterYCurrent = waterY;
      waterFadeStartCurrent = waterY + waterLayerH * 0.56;
      waterFadeEndCurrent = waterY + waterLayerH * 0.94;
      rimYCurrent = topEnd;
      bowlHalfCurrent = half;
      var slope = Math.atan(dip / half);
      var segLen = Math.sqrt(half * half + dip * dip) + 6;
      walls.push(Bodies.rectangle(cx - quarter, topEnd + dip / 2 + 14, segLen, 30, {
        isStatic: true, angle: slope, friction: 0.6, restitution: 0.1,
        label: "nivolo-ground",
      }));
      walls.push(Bodies.rectangle(cx + quarter, topEnd + dip / 2 + 14, segLen, 30, {
        isStatic: true, angle: -slope, friction: 0.6, restitution: 0.1,
        label: "nivolo-ground",
      }));
      // Shed ramps: steep continuations of the floe's tips, running from
      // the slab ends down past the waterline. They replace the old
      // outward-leaning guards, whose FLAT tops sat ~28px above the water
      // and ~50px beyond the visible ice — an icon could balance up there,
      // off the side of the berg with nothing under it, and never sink,
      // because sinking only starts once a body's bottom crosses the
      // waterline. At 49° and near-frictionless nothing rests: an icon
      // that reaches the edge slides into the sea and swims home.
      var rampA = 0.85, rampL = 150;
      var rampDX = Math.cos(rampA) * rampL / 2, rampDY = Math.sin(rampA) * rampL / 2;
      walls.push(Bodies.rectangle(cx - half + 6 - rampDX, topEnd + 14 + rampDY, rampL, 20, {
        isStatic: true, angle: -rampA, friction: 0.05, restitution: 0.02,
      }));
      walls.push(Bodies.rectangle(cx + half - 6 + rampDX, topEnd + 14 + rampDY, rampL, 20, {
        isStatic: true, angle: rampA, friction: 0.05, restitution: 0.02,
      }));
      /* Snow lips. A mound spreads until something stops it, and a floe
         that ends in a frictionless ramp stops nothing: under the weight
         of the courses above it the bottom row walks outward, steps off
         the tip and drops in the sea — which respawns it from the sky
         onto the pile, shoving the next one off in turn. These are short,
         steep and INSIDE the painted ice, so the pile leans on the lip at
         the edge of the snow instead of shedding over it. They are not
         labelled ground: sliding into the kerb is not a touchdown. */
      var lipH = Math.max(14, iconSize() * 0.4);
      var lipA = 1.15;                       // ~66° from horizontal
      var lipL = lipH / Math.sin(lipA) + 8;
      var lipDX = Math.cos(lipA) * lipL / 2, lipDY = Math.sin(lipA) * lipL / 2;
      [-1, 1].forEach(function (sgn) {
        walls.push(Bodies.rectangle(
          cx + sgn * (half - 10) - sgn * lipDX,
          topEnd - 1 - lipDY,
          lipL, 11,
          { isStatic: true, angle: sgn * lipA, friction: 0.4, restitution: 0.02 }
        ));
      });
      // Everything built so far is the floe itself, and the floe floats:
      // remember where each piece sits at zero load so the sink pass can
      // move them as one.
      walls.forEach(function (wb) { wb.bergBaseY = wb.position.y; });
      // No left/right stage walls: tossed icons may travel freely beyond
      // either viewport edge before gravity carries them into the ocean.
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
      var cols = Math.ceil(Math.sqrt(ROSTER.length * s.w / s.h));
      var rows = Math.ceil(ROSTER.length / cols);
      ROSTER.forEach(function (icon, i) {
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
          if (i === ROSTER.length - 1) pit.classList.add("ready");
        }, 60 * i);
      });
      return;
    }

    var halfBowl = VARIANT === "iceberg"
      ? Math.min(740, s.w * 0.82) / 2 * 0.6
      : Math.min(760, s.w * 0.92) / 2;
    // Drop points stay well inside the bowl mouth (alternating sides) so
    // icons slide down the curve — spreading to the rim lets them wedge
    // into a stable arch across the mouth; stacking one column is worse.
    var offsets = [-0.42, 0.34, -0.22, 0.42, -0.08, 0.16, -0.34, 0, 0.26, -0.14];
    ROSTER.forEach(function (icon, i) {
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
          restitution: VARIANT === "iceberg" ? 0.25 : 0.35,
          // Grippy on ice so the open mound piles steep instead of
          // shedding its edges into the water. frictionStatic is the half
          // that matters for the bottom course: it is not sliding yet, it
          // is being squeezed, and this is what makes it hold.
          friction: VARIANT === "iceberg" ? 0.5 : 0.08,
          frictionStatic: VARIANT === "iceberg" ? 1.4 : 0.5,
          frictionAir: 0.015,
          angle: Math.random() * 0.8 - 0.4,
        }
      );
      Body.setAngularVelocity(body, Math.random() * 0.08 - 0.04);
      icons.push({ body: body, el: el, key: icon[0], label: icon[1], lastGroundPopAt: -1e9 });
      // Stagger the automatic drop so the icons pour in rather than dump.
      setTimeout(function () {
        Composite.add(engine.world, body);
        if (i === ROSTER.length - 1) { pit.classList.add("ready"); allSpawned = true; }
      }, 260 + i * SPAWN_GAP);
    });
  }

  /* ── Bowl SFX: tiny synthesized clacks + pops (Web Audio, no assets).
     Arms on the first real pointer gesture (autoplay policy blocks
     anything earlier), so the initial pour is silent by design. ── */
  var sfx = (function () {
    var ctx = null, master = null, armed = false;
    var lastAt = -1, lastLandAt = -1, lastSplashAt = -1, played = 0;
    var muted = false;
    try { muted = localStorage.getItem("nivolo-sfx") === "off"; } catch (e) {}
    var onLive = null; // fired the moment audio genuinely starts playing
    function ensure() {
      if (ctx) return ctx;
      var AC = window.AudioContext || window.webkitAudioContext;
      if (!AC) return null;
      ctx = new AC();
      master = ctx.createGain();
      master.gain.value = 0.5;
      master.connect(ctx.destination);
      // However it comes alive — gesture, engagement history, a site the
      // visitor has allowed — that is the signal to pour out loud.
      ctx.onstatechange = function () {
        if (ctx.state !== "running") {
          // iOS parks a context as "interrupted" (a call, the lock screen)
          // and as "suspended" after a long idle. Either way it is not
          // audible any more, so stop claiming it is.
          armed = false;
          return;
        }
        armed = true;
        if (onLive) onLive();
      };
      return ctx;
    }
    /* Nudge the context awake without claiming a gesture happened. Costs
       nothing when the browser says no (the resume simply never lands),
       and on a browser that allows audio — engagement history, autoplay
       permitted for the site — a mouse move is enough to start the show
       with nobody having to tap anything. */
    /* iOS mutes Web Audio outright whenever the ring/silent switch is on
       — no error, no state change, just silence — unless the page claims a
       playback session. Safari 16.4+ only; everywhere else this is a
       no-op. It is the difference between a phone that pops and a phone
       that does nothing, which is exactly what Jack saw. */
    function claimSession() {
      try {
        if (navigator.audioSession && navigator.audioSession.type !== "playback")
          navigator.audioSession.type = "playback";
      } catch (e) {}
    }
    var lastTry = -1e9;
    function tryResume() {
      if (muted) return;
      if (armed && ctx && ctx.state === "running") return; // already live
      var now = (window.performance && performance.now) ? performance.now() : +new Date();
      if (now - lastTry < 400) return; // mousemove fires by the hundred
      lastTry = now;
      var c = ensure();
      if (!c) return;
      if (c.state === "running") { if (!armed) { armed = true; if (onLive) onLive(); } return; }
      var r = c.resume();
      if (r && r.catch) r.catch(function () {});
    }
    /* A gesture is not the same thing as permission. WebKit only counts
       ACTIVATION events — touchend, click, keydown — so the resume asked
       for inside a pointerdown is refused and the context stays suspended.
       The old arm() believed itself anyway: it latched armed = true, every
       cue after it was scheduled into a dead context, and tryResume's
       `if (armed) return` meant the touchend that WOULD have worked never
       tried again. A phone therefore went silent on the first tap and
       stayed silent for the whole visit. armed now means one thing only —
       the context is genuinely running (ctx.onstatechange sets it, and it
       is what every cue checks). arm() just asks, as often as it likes. */
    function arm() {
      claimSession();
      var c = ensure();
      if (!c) return;
      if (c.state === "running") {
        if (!armed) { armed = true; if (onLive) onLive(); }
        return;
      }
      var r = c.resume();
      if (r && r.catch) r.catch(function () {});
    }
    /* Oscillator scheduled while the context is still resuming plays the
       moment it comes alive — no need to await resume(). */
    function tone(type, f0, f1, vol, dur, delay, atk) {
      var t = ctx.currentTime + (delay || 0);
      var o = ctx.createOscillator(), g = ctx.createGain();
      o.type = type;
      o.frequency.setValueAtTime(f0, t);
      o.frequency.exponentialRampToValueAtTime(Math.max(1, f1), t + dur);
      if (atk) {
        g.gain.setValueAtTime(0.0004, t);
        g.gain.exponentialRampToValueAtTime(vol, t + atk);
      } else {
        g.gain.setValueAtTime(vol, t);
      }
      g.gain.exponentialRampToValueAtTime(0.0004, t + dur);
      o.connect(g); g.connect(master);
      o.start(t); o.stop(t + dur + 0.02);
    }
    function waterNoise(vol, dur, strength, spec) {
      var frames = Math.max(1, Math.floor(ctx.sampleRate * dur));
      var buffer = ctx.createBuffer(1, frames, ctx.sampleRate);
      var data = buffer.getChannelData(0);
      for (var i = 0; i < frames; i++) data[i] = Math.random() * 2 - 1;
      var src = ctx.createBufferSource(), filter = ctx.createBiquadFilter(), g = ctx.createGain();
      src.buffer = buffer;
      filter.type = (spec && spec.type) || "bandpass";
      var t = ctx.currentTime;
      filter.frequency.setValueAtTime(spec ? spec.f0 : 720 + 520 * strength, t);
      if (spec && spec.f1) filter.frequency.exponentialRampToValueAtTime(Math.max(20, spec.f1), t + dur);
      filter.Q.value = (spec && spec.q) || 0.7;
      g.gain.setValueAtTime(vol, t);
      g.gain.exponentialRampToValueAtTime(0.0004, t + dur);
      src.connect(filter); filter.connect(g); g.connect(master);
      src.start(t); src.stop(t + dur + 0.02);
    }
    /* A dull brown-noise crunch — the ice under the pock. Brown rather
       than white, and a 6ms attack rather than 1.5ms: fast attacks on
       white noise are what made the earlier grain scatter read as
       digital glitch instead of a surface. */
    function crunch(o) {
      var dur = o.dur, frames = Math.max(2, Math.floor(ctx.sampleRate * dur));
      var buffer = ctx.createBuffer(1, frames, ctx.sampleRate);
      var data = buffer.getChannelData(0), last = 0;
      var col = o.col == null ? 1 : o.col; // 1 = brown (dull), 0 = white (bright)
      for (var i = 0; i < frames; i++) {
        var w = Math.random() * 2 - 1;
        last = (last + 0.035 * w) / 1.035;
        data[i] = Math.max(-1, Math.min(1, last * 3.2 * col + w * (1 - col) * 0.55));
      }
      var src = ctx.createBufferSource(), filter = ctx.createBiquadFilter(), g = ctx.createGain();
      var t = ctx.currentTime;
      src.buffer = buffer;
      filter.type = "lowpass";
      filter.frequency.setValueAtTime(o.f0, t);
      filter.frequency.exponentialRampToValueAtTime(Math.max(60, o.f1), t + dur);
      g.gain.setValueAtTime(0.0001, t);
      g.gain.linearRampToValueAtTime(o.vol, t + (o.atk || 0.006));
      g.gain.exponentialRampToValueAtTime(0.0004, t + dur);
      src.connect(filter); filter.connect(g); g.connect(master);
      src.start(t); src.stop(t + dur + 0.02);
    }
    function rand(a, b) { return a + Math.random() * (b - a); }
    function hit(strength) {
      if (!armed || muted || !ctx) return false;
      var t = ctx.currentTime;
      if (t - lastAt < 0.03) return false; // a pile settling is one pop, not ten
      lastAt = t;
      played++;
      // Icons meeting each other: a dry, PITCHLESS tick cut from the same
      // brown noise as the landing's surface, but darker (1kHz down to
      // 620Hz), 26ms long and about a third of a landing's volume. Two
      // separate sound families is the point — the old shared "bloop"
      // meant a settling pile and a touchdown were the same noise, so
      // neither read. Nothing here has a note or a low body, which is
      // what keeps a pile behind the pock instead of on top of it.
      crunch({ f0: 1050 + 300 * strength, f1: 620, vol: 0.03 + 0.034 * strength, dur: 0.026, atk: 0.005 });
      return true;
    }
    function land(strength) {
      if (!armed || muted || !ctx) return false;
      var t = ctx.currentTime;
      if (t - lastLandAt < 0.025) return false;
      lastLandAt = t;
      strength = Math.max(0.28, Math.min(1, strength || 0.45));
      played++;
      // The icon's first contact with the white ice: a round two-note
      // pock — pop, then an answer an octave below — over a dull crunch
      // for the surface. Both notes FALL, where the water's two notes
      // rise; that is what keeps a landing and a splash apart when they
      // happen in the same second.
      var f = 385 + 150 * strength;
      var v = 0.11 + 0.11 * strength;
      crunch({ f0: rand(900, 1150), f1: 380, vol: 0.03 + 0.035 * strength, dur: 0.055 });
      tone("sine", f * 0.52, f, v, 0.085);
      tone("sine", f * 0.32, f * 0.5, v * 0.55, 0.075, 0.085);
      return true;
    }
    function pop() {
      if (muted || !ensure()) return;
      played++;
      // Grabbing an icon: a cork pop — a bright click on the front, then
      // a fast 180→900Hz rise. The only cue the visitor fires themselves,
      // so it is allowed to be the most tactile thing in the set, and it
      // rises where a landing falls.
      crunch({ col: 0.4, f0: 3000, f1: 1800, vol: 0.03, dur: 0.006, atk: 0.001 });
      tone("sine", 180, 900, 0.15, 0.032, 0, 0.002);
    }
    function plop(strength) {
      if (!armed || muted || !ctx) return;
      var t = ctx.currentTime;
      if (t - lastSplashAt < 0.08) return;
      lastSplashAt = t;
      strength = Math.max(0.18, Math.min(1, strength || 0.45));
      played++;
      // Water rings UP as the cavity closes — the old falling bloop had it
      // backwards. Two rising notes: the drop, then a second an octave
      // above, shorter and quieter — bright enough to read through a pour.
      var f = 560 + 220 * strength;
      var v = 0.10 + 0.12 * strength;
      tone("sine", f * 0.55, f * 1.75, v, 0.075);
      tone("sine", f * 1.10, f * 3.50, v * 0.55, 0.05, 0.085);
      waterNoise(0.03 + 0.02 * strength, 0.02, strength, { type: "lowpass", f0: 1400, f1: 700 });
    }
    function setMuted(m) {
      muted = m;
      try { localStorage.setItem("nivolo-sfx", m ? "off" : "on"); } catch (e) {}
    }
    /* Not every visit needs a gesture: a site the browser already trusts
       (autoplay allowed, enough media engagement, desktop Safari set to
       allow auto-play) hands out a context that comes up "running". Build
       it early to find out — if it does, the pour can pour and be heard
       with nobody having touched anything. */
    function probe() {
      var c = ensure();
      if (!c) return false;
      if (c.state === "running") { armed = true; return true; }
      c.resume().catch(function () {}); // allowed? then onstatechange fires
      return false;
    }
    return { arm: arm, probe: probe, tryResume: tryResume, hit: hit, land: land, pop: pop, plop: plop,
             claimSession: claimSession,
             setMuted: setMuted, onLive: function (fn) { onLive = fn; },
             isMuted: function () { return muted; },
             stats: function () { return { armed: armed, state: ctx ? ctx.state : null, played: played }; } };
  })();

  /* ── Haptics: the ice knocks back ────────────────────────────────────
     Android hands out the Vibration API. iOS never has — but since 17.4 a
     switch-style checkbox buzzes the Taptic engine as it toggles, so an
     off-screen switch clicked from code is the only way a web page taps
     back on an iPhone. Both routes are throttled hard: 27 icons landing
     inside five seconds would otherwise be one continuous buzz, which
     reads as a malfunction rather than a pour. */
  var haptics = (function () {
    var canVibrate = !!(navigator.vibrate && typeof navigator.vibrate === "function");
    var iosSwitch = !canVibrate && "ontouchend" in window &&
      /iP(hone|od|ad)|Macintosh/.test(navigator.userAgent || "");
    var label = null, lastAt = -1e9;
    function ensure() {
      if (label || !iosSwitch) return;
      label = document.createElement("label");
      label.className = "haptic-tap";
      label.setAttribute("aria-hidden", "true");
      var input = document.createElement("input");
      input.type = "checkbox";
      input.setAttribute("switch", ""); // the toggle that carries the buzz
      input.tabIndex = -1;
      label.appendChild(input);
      document.body.appendChild(label);
    }
    function tap(strength) {
      if (REDUCED || (!canVibrate && !iosSwitch)) return;
      var now = (window.performance && performance.now) ? performance.now() : +new Date();
      if (now - lastAt < 90) return; // one knock per landing, not per contact
      lastAt = now;
      if (canVibrate) {
        // 7ms for a graze, 20 for a real drop — a tap, never a rumble.
        navigator.vibrate(Math.round(7 + 13 * Math.max(0, Math.min(1, strength || 0.4))));
        return;
      }
      ensure();
      if (label) label.click();
    }
    return { tap: tap, supported: function () { return canVibrate || iosSwitch; } };
  })();

  /* ── Give: the icons are not rigid ───────────────────────────────────
     A sprite that falls at a constant shape and stops dead reads as a
     sticker dropped on a photograph. Real things take the hit: they
     flatten along the line of the blow, the side away from the contact
     flexes up a beat later, and both spring back past their own shape
     before they settle. Two damped springs per icon do that — a quick one
     for the squash (~200ms, two visible bounces) and a slower, floppier
     one for the fold, so the bend trails the flattening instead of moving
     with it. That lag is the whole difference between something that
     gives and something that is merely being scaled.

     The squash runs along the CONTACT axis rather than the screen's, and
     pivots on the point that was struck, so an icon that lands on a
     corner folds over that corner. Hard enough and it keeps a little of
     both — a dent that eases out over the next second, so the icon wears
     the fall for a moment instead of snapping straight back to perfect.

     It all rides on the <img>, because the wrapper's transform belongs to
     the render loop, and it is only written for icons that are moving,
     deforming or held: a settled colony costs nothing per frame. */
  var GIVE = {
    stiff: 0.28, damp: 0.86,          // squash spring: ~200ms, two bounces
    amt: 0.38,                        // how much of `s` becomes flattening
    foldStiff: 0.12, foldDamp: 0.885, // the bend, deliberately slower
    // Perspective has to be a MULTIPLE of the icon, not a fixed distance:
    // a 420px vanishing point barely bends a 69px square, and the same
    // number on a phone's 41px icon does nothing at all.
    perspRatio: 2.6,
    airFrom: 4.5, airRate: 0.011, airMax: 0.13,
    maxS: 0.75, maxStretch: 0.55, maxFold: 19,
    keep: 0.978,                      // what the landing left behind, per tick
    holdScale: 1.06,
  };
  var DEG = 180 / Math.PI;

  function giveState(it) {
    return it.give || (it.give = { s: 0, sv: 0, a: 0, fold: 0, foldV: 0,
                                   res: 0, resFold: 0, hold: 0, ox: 50, oy: 50 });
  }

  /* Which way the blow came from: the real contact points when Matter
     hands them over, otherwise the line between the two centres. The
     difference matters — an icon landing on the tip of the floe is struck
     from below, not from the middle of the slab. */
  function contactDir(it, otherBody, pair) {
    var p = it.body.position;
    var col = pair && pair.collision;
    var sup = col && col.supports;
    // Matter keeps `supports` as a reused, over-long array — only the
    // first `supportCount` entries are this collision's, the rest are
    // stale or null. Reading past the count throws.
    var count = sup ? Math.min(sup.length, col.supportCount == null ? sup.length : col.supportCount) : 0;
    if (count) {
      var sx = 0, sy = 0, used = 0;
      for (var i = 0; i < count; i++) {
        if (!sup[i]) continue;
        sx += sup[i].x; sy += sup[i].y; used++;
      }
      if (used) {
        var dx = sx / used - p.x, dy = sy / used - p.y;
        if (Math.abs(dx) + Math.abs(dy) > 0.5) return { x: dx, y: dy };
      }
    }
    return { x: otherBody.position.x - p.x, y: otherBody.position.y - p.y };
  }

  /* Kick both springs. `dir` points from the icon's centre toward whatever
     it hit, in world space; `imp` is 0..1; `spin` decides which way the
     free side folds. */
  function giveKick(it, imp, dir, spin) {
    if (REDUCED || !it) return;
    var g = giveState(it);
    imp = Math.max(0, Math.min(1, imp));
    var len = Math.hypot(dir.x, dir.y) || 1;
    var ux = dir.x / len, uy = dir.y / len;
    // Held in the icon's OWN frame: a dent belongs to the material, so it
    // turns with the icon as it rolls and settles.
    g.a = Math.atan2(uy, ux) - it.body.angle;
    g.ox = 50 + 45 * ux;
    g.oy = 50 + 45 * uy;
    // The strongest blow wins; blows do NOT add up. An icon buried in the
    // mound is in contact with three neighbours and the ice at once, and
    // summing those kicks folded it clean in half on the first tick.
    var kick = 0.055 + 0.30 * imp;
    if (kick > g.sv) g.sv = kick;
    var fk = (1.3 + 4.6 * imp) * (spin < 0 ? -1 : 1);
    if (Math.abs(fk) > Math.abs(g.foldV)) g.foldV = fk;
    if (imp > 0.62) { // a real drop leaves a mark for a second or so
      var over = (imp - 0.62) / 0.38;
      g.res = Math.max(g.res, 0.035 + 0.075 * over);
      g.resFold = (Math.abs(g.resFold) > 2 + 4.2 * over ? g.resFold
        : (2 + 4.2 * over) * (spin < 0 ? -1 : 1));
    }
  }

  function giveStep(it) {
    if (REDUCED) return;
    var g = it.give, b = it.body;
    var img = it.img || (it.img = it.el.querySelector("img"));
    if (!img) return;
    var held = !!(dragConstraint && dragConstraint.bodyB === b);
    var sp = Math.hypot(b.velocity.x, b.velocity.y);
    var stretching = sp > GIVE.airFrom;
    var busy = g && (Math.abs(g.s) > 0.002 || Math.abs(g.sv) > 0.002 ||
                     Math.abs(g.fold) > 0.05 || Math.abs(g.foldV) > 0.05 ||
                     g.res > 0.002 || Math.abs(g.resFold) > 0.05 || g.hold > 0.004);
    if (!busy && !stretching && !held) {
      if (it.giveOn) { img.style.transform = ""; img.style.transformOrigin = ""; it.giveOn = false; }
      return;
    }
    g = giveState(it);
    g.sv += -g.s * GIVE.stiff; g.sv *= GIVE.damp; g.s += g.sv;
    g.foldV += -g.fold * GIVE.foldStiff; g.foldV *= GIVE.foldDamp; g.fold += g.foldV;
    // Ceilings, with the velocity killed at the wall so the spring settles
    // instead of grinding against its own limit.
    if (g.s > GIVE.maxS) { g.s = GIVE.maxS; if (g.sv > 0) g.sv = 0; }
    else if (g.s < -GIVE.maxStretch) { g.s = -GIVE.maxStretch; if (g.sv < 0) g.sv = 0; }
    if (g.fold > GIVE.maxFold) { g.fold = GIVE.maxFold; if (g.foldV > 0) g.foldV = 0; }
    else if (g.fold < -GIVE.maxFold) { g.fold = -GIVE.maxFold; if (g.foldV < 0) g.foldV = 0; }
    g.res *= GIVE.keep; g.resFold *= GIVE.keep;
    g.hold += ((held ? 1 : 0) - g.hold) * 0.18;

    var k = 0, ang = 0, atContact = false;
    if (Math.abs(g.s) + g.res > 0.006) {
      k = (g.s + g.res) * GIVE.amt;
      ang = g.a;
      atContact = true;
    } else if (stretching) {
      // Falling or thrown: elongate along the line of travel. The oldest
      // trick there is, and still the one that makes speed read as weight.
      k = -Math.min(GIVE.airMax, (sp - GIVE.airFrom) * GIVE.airRate);
      ang = Math.atan2(b.velocity.y, b.velocity.x) - b.angle;
    }
    k = Math.max(-0.24, Math.min(0.33, k));
    var fold = g.fold + g.resFold;
    var bent = Math.abs(fold) > 0.06;

    var t = "";
    if (bent) {
      var pp = it.persp || (it.persp = Math.max(90, Math.round((it.el.offsetWidth || 64) * GIVE.perspRatio)));
      t += "perspective(" + pp + "px) ";
    }
    if (g.hold > 0.004) t += "scale(" + (1 + (GIVE.holdScale - 1) * g.hold).toFixed(3) + ") ";
    if (bent || Math.abs(k) > 0.0008) {
      var A = ang * DEG;
      t += "rotate(" + A.toFixed(1) + "deg) ";
      if (bent) t += "rotateY(" + fold.toFixed(2) + "deg) ";
      t += "scale(" + (1 - k).toFixed(4) + "," + (1 + k * 0.86).toFixed(4) + ") ";
      t += "rotate(" + (-A).toFixed(1) + "deg)";
    }
    img.style.transformOrigin = atContact
      ? g.ox.toFixed(1) + "% " + g.oy.toFixed(1) + "%" : "50% 50%";
    img.style.transform = t;
    it.giveOn = true;
  }

  function iconForBody(body) {
    for (var i = 0; i < icons.length; i++) {
      if (icons[i].body === body) return icons[i];
    }
    return null;
  }

  Matter.Events.on(engine, "collisionStart", function (e) {
    for (var i = 0; i < e.pairs.length; i++) {
      var pa = e.pairs[i];
      var iconA = iconForBody(pa.bodyA);
      var iconB = iconForBody(pa.bodyB);
      var rel = Math.hypot(pa.bodyA.velocity.x - pa.bodyB.velocity.x,
                           pa.bodyA.velocity.y - pa.bodyB.velocity.y);

      // Two icons get a light pop even from a small nudge. The global sound
      // throttle above folds a many-body pile-up into a pleasant short run.
      if (iconA && iconB) {
        if (rel > 0.7) sfx.hit(Math.max(0.2, Math.min(1, rel / 12)));
        // Both sides of a knock give a little — the one that arrives and
        // the one that was sitting there. Kept well under a landing so a
        // settling pile shivers rather than throbs.
        if (rel > 1) {
          // An icon dropped onto the mound lands on another ICON, not on
          // the ice, so this path has to carry a real landing as well as a
          // settling shiver — hence the wide range off one relative speed.
          var nudge = Math.min(0.7, rel / 16);
          giveKick(iconA, nudge, contactDir(iconA, pa.bodyB, pa), pa.bodyA.velocity.x >= 0 ? 1 : -1);
          giveKick(iconB, nudge, contactDir(iconB, pa.bodyA, pa), pa.bodyB.velocity.x >= 0 ? 1 : -1);
        }
        continue;
      }

      // Touching the white ice gets the clearer landing pop. Throttled per
      // icon on SIM time (not a one-shot flag) so a settling bounce is one
      // pop, but a later landing — dropped after a drag, re-poured from the
      // sky — pops again the way a real touchdown should.
      var landedIcon = iconA || iconB;
      var otherBody = iconA ? pa.bodyB : pa.bodyA;
      if (landedIcon && otherBody.label === "nivolo-ground" && rel > 0.55) {
        var simNow = engine.timing.timestamp;
        var impact = Math.max(0.34, Math.min(1, rel / 11));
        // The give is throttled tighter than the sound on purpose: a
        // settling bounce should still be SEEN taking the ice, it just
        // shouldn't pop a second time.
        if (simNow - (landedIcon.lastGiveAt || -1e9) > 90) {
          landedIcon.lastGiveAt = simNow;
          var lb = landedIcon.body;
          giveKick(landedIcon, impact, contactDir(landedIcon, otherBody, pa),
                   lb.velocity.x + lb.angularVelocity * 24 >= 0 ? 1 : -1);
        }
        if (simNow - (landedIcon.lastGroundPopAt || -1e9) > 260) {
          landedIcon.lastGroundPopAt = simNow;
          if (sfx.land(impact)) landsHeard++; // enough of these and the replay is unnecessary
          if (!sfx.isMuted()) haptics.tap(impact); // and the phone feels it
          thumpBerg(impact);                  // the floe feels it
          if (rel > 1.6) snowImpact(landedIcon, impact); // and the snow shows it
        }
      }
    }
  });

  /* Keep audio resumable after any real gesture. The pour starts at load,
     long before a visitor can click, so the browser's autoplay policy
     silences every landing — the pops Jack expects are simply never heard.
     Arming therefore also schedules a replay of the pour (see maybeRepour):
     the colony lifts back into the sky and falls again, this time out loud. */
  ["pointerdown", "pointerup", "touchend", "click", "keydown"].forEach(function (type) {
    document.addEventListener(type, function (e) {
      // The haptic switch clicks itself; only a real visitor counts.
      if (e && e.isTrusted === false) return;
      sfx.arm();
      hideInvite(); // the gesture it was asking for has arrived
      beginPour();   // the held pour is now allowed to run — and be heard
      maybeRepour(); // (only relevant once a pour has already happened)
    }, { capture: true, passive: true });
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
    // Picked up: it pinches where the finger closed on it, rises toward
    // the viewer and drops a longer shadow — held, not merely selected.
    var grabbed = iconForBody(body);
    if (grabbed) {
      grabbed.el.classList.add("held");
      giveKick(grabbed, 0.26, { x: pt.x - body.position.x, y: pt.y - body.position.y },
               pt.x >= body.position.x ? 1 : -1);
    }
    stage.classList.add("dragging");
    pit.classList.add("touched");
    sfx.pop();
    if (!sfx.isMuted()) haptics.tap(0.55);
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
    // A throw is allowed to outrun a fall for a moment (see TOSS_CAP).
    var thrown = iconForBody(meta && meta.body);
    if (thrown) thrown.tossedAt = Date.now();
    // Clear the lift from whatever is wearing it, not just from the body we
    // think we were holding — a stuck shadow outlives the gesture.
    var lifted = stage.querySelectorAll(".pit-icon.held");
    for (var li = 0; li < lifted.length; li++) lifted[li].classList.remove("held");
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
  /* Terminal velocity. The sky is hundreds of pixels above the ice, so
     an uncapped icon arrives like a dropped brick and splashes the
     course it lands on off the ends of the floe. 13 still reads as a
     fall and still lands hard enough to thump the berg. */
  var SPEED_CAP = VARIANT === "zerog" ? 4 : VARIANT === "iceberg" ? 13 : 24;
  var TOSS_CAP = 24;                     // a throw may outrun the fall


  /* Speed limits belong to the SIM, painting belongs to the frame — kept
     apart so tooling can step the engine many times and paint once. */
  function governSpeeds() {
    for (var i = 0; i < icons.length; i++) {
      var it = icons[i], b = it.body;
      // Keep tosses fun but sub-orbital: cap linear and angular speed.
      var cap = (it.tossedAt && Date.now() - it.tossedAt < 900) ? TOSS_CAP : SPEED_CAP;
      var sp = Math.hypot(b.velocity.x, b.velocity.y);
      if (sp > cap) Body.setVelocity(b, { x: b.velocity.x * cap / sp, y: b.velocity.y * cap / sp });
      if (Math.abs(b.angularVelocity) > 0.45) Body.setAngularVelocity(b, 0.45 * Math.sign(b.angularVelocity));
    }
  }

  function paintIcons() {
    for (var i = 0; i < icons.length; i++) {
      var it = icons[i], b = it.body, half = it.el.offsetWidth / 2;
      it.el.style.transform =
        "translate(" + (b.position.x - half).toFixed(1) + "px," +
        (b.position.y - half).toFixed(1) + "px) rotate(" + b.angle.toFixed(3) + "rad)";
      giveStep(it);
    }
  }

  function frame(t) {
    if (!running) return;
    var dt = lastT ? Math.min(t - lastT, 33) : 16.7;
    lastT = t;
    Engine.update(engine, dt);
    governSpeeds();
    paintIcons();
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

  var stageOnScreen = false;
  new IntersectionObserver(function (entries) {
    stageOnScreen = entries[0].isIntersecting;
    setRunning(stageOnScreen && !document.hidden);
    if (stageOnScreen) maybeRepour();
  }, { threshold: 0.02 }).observe(stage);

  /* The pour waits for the ICE to be somewhere on screen, not merely for
     the stage. The stage's top edge crosses into view long before the floe
     does, and on a short phone that meant the whole pour ran and finished
     below the fold: scroll down and the icons are simply already there.
     The threshold is deliberately low — a laptop shows a sliver of berg at
     load and should still pour on arrival, icons streaming past the
     headline the way they always have. (zerog paints no berg: watch the
     stage there.) */
  var pourTarget = (VARIANT === "zerog" || !bergVisual) ? stage : bergVisual;
  var bergOnScreen = false;
  new IntersectionObserver(function (entries) {
    if (!entries[0].isIntersecting) return;
    bergOnScreen = true;
    armPourGrace();
  }, { threshold: 0.02 }).observe(pourTarget);
  document.addEventListener("visibilitychange", function () {
    if (document.hidden) setRunning(false);
    else if (stage.getBoundingClientRect().bottom > 0) {
      setRunning(true);
      sfx.tryResume(); // iOS parks the context behind a lock screen or a call
      maybeRepour();
    }
  });

  /* ── The floe takes the weight ────────────────────────────────────────
     Ice floats, so it should ride lower as the colony piles on and dip
     when something lands hard. bergSink is a damped spring: the resting
     icons set its target, each landing kicks its velocity. It moves the
     PHYSICS slabs and the painted berg by the same amount, so the whole
     pile rides down with the ice instead of hovering over it. The
     waterline stays put — that is what makes the berg look loaded. */
  var bergSink = 0, bergSinkVel = 0, bergSinkApplied = 0;
  var BERG_SINK_MAX = 16, BERG_SINK_PER_ICON = 0.75;

  function thumpBerg(impact) { bergSinkVel += 0.35 + impact * 1.1; }

  /* Each icon pushes the floe a little further down until it reaches the
     level a full berg sits at — past that the pile can't sink it further,
     and taking icons away lets it come back up. Counts what is actually
     STANDING on the ice: an icon in the visitor's hand, one still falling,
     one already swimming, none of them weigh on it, so lifting one off
     starts the floe rising before it has gone anywhere. */
  function bergLoad() {
    var held = dragConstraint && dragConstraint.bodyB, n = 0;
    for (var i = 0; i < icons.length; i++) {
      var it = icons[i], b = it.body;
      if (it.sinking || b === held || b.speed > 2) continue;
      if (b.position.y <= 0 || b.position.y >= waterYCurrent) continue;
      n++;
    }
    return Math.min(BERG_SINK_MAX, n * BERG_SINK_PER_ICON);
  }

  function stepBergSink() {
    if (VARIANT !== "iceberg") return;
    // Asymmetric on purpose: weight arrives all at once and the ice takes
    // it, but buoyancy is patient. A floe with its load removed drifts
    // back up over seconds — an eased approach, not a spring, which would
    // cover the same distance in a blink. Landings still kick the spring,
    // so a hard hit dips the ice even while it is rising.
    var target = bergLoad(), next;
    if (target < bergSink && Math.abs(bergSinkVel) < 0.08) {
      bergSinkVel = 0;
      next = bergSink + (target - bergSink) * 0.005;
    } else {
      bergSinkVel += (target - bergSink) * 0.035;
      bergSinkVel *= 0.88;
      next = bergSink + bergSinkVel;
    }
    bergSink = Math.max(0, Math.min(BERG_SINK_MAX + 4, next));
    // Compare against what was last APPLIED, not against last tick: a
    // patient rise moves a hundredth of a pixel per tick, and a per-tick
    // threshold would swallow every one of them and freeze the berg
    // mid-float with the physics and the paint drifting apart.
    var d = bergSink - bergSinkApplied;
    if (Math.abs(d) < 0.05) return;
    bergSinkApplied = bergSink;
    for (var i = 0; i < walls.length; i++) {
      var wb = walls[i];
      if (wb.bergBaseY == null) continue;
      Body.setPosition(wb, { x: wb.position.x, y: wb.bergBaseY + bergSink });
    }
    // A SLEEPING body does not fall when the ground drops away from it —
    // it hangs exactly where it was, which left the colony floating above
    // a sinking berg. So carry the cargo: every icon standing on the floe
    // moves by the same delta, which keeps contacts intact without waking
    // (and re-jittering) the whole pile every tick.
    for (var j = 0; j < icons.length; j++) {
      var it = icons[j], b = it.body;
      if (it.sinking || (dragConstraint && dragConstraint.bodyB === b)) continue;
      if (b.position.y < 0 || b.position.y > waterYCurrent) continue;
      Body.translate(b, { x: 0, y: d });
    }
    if (bergVisual) bergVisual.style.setProperty("--berg-sink", bergSink.toFixed(2) + "px");
  }

  /* Snow gives where an icon hits it: a shallow divot at the contact
     point, a few flakes kicked up, and the icon itself pressing in and
     springing back. Appended to the bob wrapper so the marks ride with
     the berg, and the squash goes on the <img> because the render loop
     owns the wrapper's transform. */
  function snowImpact(it, impact) {
    var b = it.body;
    var half = (b.bounds.max.y - b.bounds.min.y) / 2;
    var x = b.position.x, y = b.position.y + half - 3;

    var divot = document.createElement("span");
    divot.className = "snow-divot";
    divot.setAttribute("aria-hidden", "true");
    divot.style.left = x.toFixed(1) + "px";
    divot.style.top = y.toFixed(1) + "px";
    divot.style.width = (44 + impact * 52).toFixed(0) + "px";
    bobWrap.appendChild(divot);
    setTimeout(function () { divot.remove(); }, 950);

    var puff = document.createElement("span");
    puff.className = "snow-puff";
    puff.setAttribute("aria-hidden", "true");
    puff.style.left = x.toFixed(1) + "px";
    puff.style.top = y.toFixed(1) + "px";
    var flakes = 3 + Math.round(impact * 3);
    for (var i = 0; i < flakes; i++) {
      var flake = document.createElement("i");
      var spread = (i - (flakes - 1) / 2) / Math.max(1, (flakes - 1) / 2);
      flake.style.setProperty("--dx", (spread * (16 + impact * 26) + Math.random() * 8 - 4).toFixed(1) + "px");
      flake.style.setProperty("--dy", (-8 - Math.random() * (10 + impact * 16)).toFixed(1) + "px");
      flake.style.setProperty("--delay", (Math.random() * 0.05).toFixed(2) + "s");
      puff.appendChild(flake);
    }
    bobWrap.appendChild(puff);
    setTimeout(function () { puff.remove(); }, 800);

    // The shadow reports it too: it snaps tight under the icon at the
    // moment of contact and eases back out as the icon settles. (The
    // squash and the fold are the give springs' job — see giveKick.)
    it.el.classList.remove("thud");
    void it.el.offsetWidth; // restart the keyframe on a rapid second landing
    it.el.classList.add("thud");
  }

  /* Maintenance pass on the ENGINE TICK (not wall clock — must advance
     with sim time, and pause with it). Escape hatch: anything that clips
     through geometry gets re-dropped. Arch breaker: icons at rest above
     the rim are perched or wedged — shear them loose. */
  function clearSinkState(it) {
    it.inWater = false;
    it.sinking = false;
    it.body.collisionFilter.mask = 0xFFFFFFFF;
    it.el.classList.remove("is-sinking");
    it.el.style.opacity = "1";
  }

  function respawnFromSky(it, s) {
    var b = it.body;
    it.give = null; // it doesn't carry the last landing's dent into the next fall
    it.el.classList.remove("thud", "held");
    if (it.img) { it.img.style.transform = ""; it.img.style.transformOrigin = ""; }
    it.giveOn = false;
    clearSinkState(it);
    it.lastGroundPopAt = -1e9; // a fresh fall always earns a fresh pop
    Body.setPosition(b, {
      x: s.w / 2 + (Math.random() * 2 - 1) * bowlHalfCurrent * 0.62,
      y: skyTop - 90 - Math.random() * 170,
    });
    Body.setVelocity(b, { x: Math.random() * 0.8 - 0.4, y: 0 });
    Body.setAngularVelocity(b, Math.random() * 0.08 - 0.04);
    Matter.Sleeping.set(b, false);
    it.respawns = (it.respawns || 0) + 1;
  }

  /* ── Audible re-pour ──────────────────────────────────────────────────
     The load-time pour is always silent (no user gesture yet = no audio),
     so the "icons land on the ice with a pop" moment is lost on a fresh
     visit. Once sound is genuinely available — armed, unmuted, stage on
     screen, nothing being dragged — lift the settled colony back over the
     page and pour it again, staggered, so each touchdown pops. Runs at
     most once, and is cancelled outright if a real landing was ever heard. */
  var shoved = 0;          // floaters the maintenance pass pushed off the edge
  var landsHeard = 0;      // audible ice landings so far (see collision handler)
  var repourDone = false;
  var repourPending = false;
  var allSpawned = false;  // every icon has entered the world (set by spawnIcons)

  /* "At rest" counts only icons actually sitting on the berg (y > 0 — the
     sky is negative). Counting sky-parked icons as still made a mid-pour
     click look like a settled colony, and the few that HAD landed were
     yanked back up: icons visibly vanishing a moment after touchdown. A
     pour in flight must always be left alone — its own landings are the
     sound, and they are already audible once the visitor has clicked. */
  function colonyIdle() {
    if (dragConstraint || !allSpawned) return false;
    var settled = 0;
    for (var i = 0; i < icons.length; i++) {
      var it = icons[i];
      if (!it.sinking && it.body.position.y > 0 && it.body.speed < 0.5) settled++;
    }
    return settled >= icons.length * 0.6;
  }

  /* Toss the settled colony back into the air rather than teleporting it
     to the sky: every icon stays on screen the whole time, arcs up, and
     drops back onto the ice under its own weight — which is what makes
     the pop. Staggered on the pour's own rhythm. */
  function repour() {
    var s = stageSize();
    var order = icons.map(function (_, i) { return i; });
    for (var i = order.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var tmp = order[i]; order[i] = order[j]; order[j] = tmp;
    }
    order.forEach(function (idx, n) {
      setTimeout(function () {
        var it = icons[idx], b = it.body;
        if (it.sinking || (dragConstraint && dragConstraint.bodyB === b)) return;
        Matter.Sleeping.set(b, false);
        // Lean the toss back towards the middle so nobody is flung off the
        // edge into the water on the way up.
        var inward = (s.w / 2 - b.position.x) * 0.022;
        Body.setVelocity(b, {
          x: Math.max(-3, Math.min(3, inward)) + (Math.random() * 0.8 - 0.4),
          y: -(8.5 + Math.random() * 2.5),
        });
        Body.setAngularVelocity(b, Math.random() * 0.12 - 0.06);
        it.lastGroundPopAt = -1e9; // the landing to come is a fresh one
      }, n * SPAWN_GAP);
    });
  }

  function maybeRepour() {
    // Four-plus audible landings means sound came alive during the pour
    // itself and the visitor already heard it — one stray swimmer flopping
    // back onto the ice does not count.
    if (repourDone || landsHeard >= 4) return;
    if (VARIANT === "zerog") return;      // nothing pours in orbit
    if (sfx.isMuted() || !sfx.stats().armed) return;
    // Not the moment (scrolled away, still settling, mid-drag) — try later.
    if (!running || !stageOnScreen || !colonyIdle()) { repourPending = true; return; }
    repourDone = true;
    repourPending = false;
    repour();
  }

  function splashAt(x, y, strength) {
    strength = Math.max(0.18, Math.min(1, strength || 0.45));
    var splash = document.createElement("span");
    splash.className = "water-splash";
    splash.setAttribute("aria-hidden", "true");
    splash.style.left = x.toFixed(1) + "px";
    splash.style.top = y.toFixed(1) + "px";
    splash.style.width = (64 + strength * 34).toFixed(0) + "px";
    for (var i = 0; i < 7; i++) {
      var drop = document.createElement("i");
      var spread = (i - 3) / 3;
      drop.style.setProperty("--dx", (spread * (26 + strength * 24) + (Math.random() * 7 - 3.5)).toFixed(1) + "px");
      drop.style.setProperty("--dy", (-22 - Math.random() * (24 + strength * 25)).toFixed(1) + "px");
      drop.style.setProperty("--drop-scale", (0.7 + Math.random() * 0.55).toFixed(2));
      drop.style.setProperty("--delay", (Math.random() * 0.07).toFixed(2) + "s");
      splash.appendChild(drop);
    }
    stage.appendChild(splash);
    setTimeout(function () { splash.remove(); }, 900);
  }

  /* Sinking (iceberg, every tick): an icon that misses the floe loses
     its splash speed, drifts slowly through the ocean fade, disappears,
     then re-enters from the real top of the page. Collision masking lets
     swimmers pass behind the floe instead of catching on its underside. */
  function sinkingPass() {
    var s = stageSize();
    for (var i = 0; i < icons.length; i++) {
      var it = icons[i], b = it.body, p = b.position;
      var half = (b.bounds.max.y - b.bounds.min.y) / 2;
      var touchesWater = p.y + half > waterYCurrent;

      if (!it.sinking && touchesWater) {
        var impact = Math.max(0.18, Math.min(1, Math.abs(b.velocity.y) / 11));
        it.inWater = true;
        it.sinking = true;
        it.body.collisionFilter.mask = 0;
        it.el.classList.add("is-sinking");
        splashAt(p.x, waterYCurrent, impact);
        sfx.plop(impact);
        // Water is a surface too: it squashes the icon before it gives way.
        giveKick(it, impact * 0.8, { x: 0, y: 1 }, b.velocity.x >= 0 ? 1 : -1);
        Matter.Sleeping.set(b, false);
      }
      if (!it.sinking) continue;

      // A dragged swimmer can still be rescued and placed back on ice.
      if (p.y + half < waterYCurrent - 4) {
        clearSinkState(it);
        continue;
      }

      var progress = Math.max(0, Math.min(1,
        (p.y - waterYCurrent) / Math.max(1, waterFadeEndCurrent - waterYCurrent)));
      var sinkSpeed = 0.34 + progress * 0.18;
      var nextY = b.velocity.y < -0.4
        ? b.velocity.y * 0.82
        : Math.min(sinkSpeed + 0.16, b.velocity.y * 0.72 + sinkSpeed * 0.28);
      Body.setVelocity(b, { x: b.velocity.x * 0.975, y: nextY });
      Body.setAngularVelocity(b, b.angularVelocity * 0.965);
      Matter.Sleeping.set(b, false);

      var opacity = 1;
      if (p.y > waterFadeStartCurrent) {
        opacity = 1 - (p.y - waterFadeStartCurrent) /
          Math.max(1, waterFadeEndCurrent - waterFadeStartCurrent);
      }
      it.el.style.opacity = Math.max(0, Math.min(1, opacity)).toFixed(3);

      if (p.y >= waterFadeEndCurrent) respawnFromSky(it, s);
    }
  }

  var maintTick = 0;
  Matter.Events.on(engine, "afterUpdate", function () {
    if (VARIANT === "iceberg") { sinkingPass(); stepBergSink(); }
    if (++maintTick % 100 !== 0) return;
    if (repourPending) maybeRepour(); // waiting on the colony to settle
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
    // Iceberg swimmers are intentionally unbounded horizontally. The
    // per-tick sinking pass still returns them after they fade underwater.
    if (VARIANT === "iceberg") {
      // Nothing rests where there is no ice. Whatever the geometry does —
      // a shoulder, a neighbour holding it up over open water — an icon
      // asleep beyond the floe's ends and above the waterline is a floater,
      // so shove it outward and down until the sea takes it.
      icons.forEach(function (it) {
        var b = it.body;
        if (it.sinking || (dragConstraint && dragConstraint.bodyB === b)) return;
        if (b.speed > 0.5 || b.position.y > waterYCurrent) return;
        if (Math.abs(b.position.x - s.w / 2) - bowlHalfCurrent < 8) return;
        Matter.Sleeping.set(b, false);
        Body.setVelocity(b, { x: (b.position.x < s.w / 2 ? -1.6 : 1.6), y: 1.4 });
        shoved++;
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
        clearSinkState(it);
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
      hideInvite();
      if (!sfx.isMuted()) sfx.pop(); // audible confirmation
      syncSound();
      maybeRepour(); // unmuting is the moment to hear the pour
    });
    syncSound();
  }

  buildWalls();
  setRunning(true);

  /* ── Sound without a tap, wherever the browser allows it ──────────────
     Autoplay rules are the browser's, not ours: most visits stay locked
     until a real gesture. But some are not — a site the visitor allowed,
     enough media engagement, a desktop Safari set to auto-play — and on
     those the pour should simply be audible with nothing asked of them.
     So probe at load and keep nudging on every ambient signal (moving
     the mouse, scrolling, the tab regaining focus); the instant the
     context reports "running", the invite goes away and the pour runs. */
  sfx.onLive(function () {
    hideInvite();
    beginPour();
    maybeRepour();
  });
  sfx.probe();
  ["mousemove", "wheel", "scroll", "touchstart", "touchend", "focus"].forEach(function (type) {
    (type === "scroll" || type === "focus" ? window : document)
      .addEventListener(type, function () { sfx.tryResume(); }, { capture: true, passive: true });
  });

  /* ── When the pour is allowed to start ────────────────────────────────
     Audio is locked until the visitor's first gesture, so a pour that
     starts at load is silent no matter what we do — the icons hit the ice
     before anyone can click. So hold it: the first gesture starts the
     pour, and the very first touchdown is heard. The wait is bounded —
     after POUR_GRACE the pour runs anyway (silently, and maybeRepour
     covers it later), so the berg is never left empty.
     Holding until the stage is on screen matters too: off screen the sim
     is paused, and icons queued into a paused world all drop together
     when it scrolls in — a dump, not a pour. */
  var POUR_GRACE = 5000;
  var pourStarted = false;
  var pourGraceTimer = null;

  /* ── Ask for the tap ──────────────────────────────────────────────────
     No amount of timing makes a load-time pour audible: the browser
     simply refuses audio until the visitor interacts. So say so. The
     pill explains why the shelf is empty for a beat ("tap and they
     pour"), and if the grace runs out and they pour silently anyway it
     switches to offering the replay. Any gesture anywhere dismisses it. */
  var SPEAKER = '<svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor"'
    + ' stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">'
    + '<path d="M11 5 6.5 9H3v6h3.5L11 19z" fill="currentColor" stroke="none"/>'
    + '<path d="M15.5 9.5a4 4 0 0 1 0 5"/><path d="M18 7a8 8 0 0 1 0 10"/></svg>';
  var invite = null;
  var inviteGone = false;

  function showInvite(text) {
    if (inviteGone || sfx.isMuted() || sfx.stats().armed) return;
    if (!invite) {
      invite = document.createElement("span");
      invite.className = "pit-call";
      invite.setAttribute("aria-hidden", "true");
      stage.appendChild(invite);
      pit.classList.add("calling"); // holds back the "grab one" hint
    }
    invite.innerHTML = SPEAKER + "<span>" + text + "</span>";
    requestAnimationFrame(function () { if (invite) invite.classList.add("in"); });
  }

  function hideInvite() {
    inviteGone = true;
    pit.classList.remove("calling");
    if (!invite) return;
    var el = invite;
    invite = null;
    el.classList.remove("in");
    setTimeout(function () { el.remove(); }, 500);
  }

  function beginPour(force) {
    if (pourStarted || (!force && !(stageOnScreen && bergOnScreen))) return;
    pourStarted = true;
    if (pourGraceTimer) { clearTimeout(pourGraceTimer); pourGraceTimer = null; }
    // Poured without audio: the landings are about to be swallowed, so the
    // invite stops asking for a pour and starts offering the replay. The
    // check waits a beat because a resume asked for in this same gesture
    // is still in flight — armed only turns true when the context reports
    // itself running, which is a tick or two later. (A gesture that DID
    // arrive has already called hideInvite, and that is permanent.)
    if (!force) setTimeout(function () {
      if (!sfx.stats().armed) showInvite("Tap for the sound");
    }, 700);
    spawnIcons();
  }

  function armPourGrace() {
    if (pourStarted || pourGraceTimer) return;
    if (sfx.stats().armed) { beginPour(); return; } // already unlocked → pour now
    showInvite("Tap anywhere and they pour in");
    pourGraceTimer = setTimeout(function () {
      pourGraceTimer = null;
      beginPour();
    }, POUR_GRACE);
  }

  // Screenshot tooling can't gesture; it wants the pour immediately.
  if (/[?&]settle\b/.test(location.search)) beginPour(true);
  // Button rects shift once the webfont lands — remeasure the terrain.
  if (document.fonts && document.fonts.ready) {
    document.fonts.ready.then(function () { buildWalls(); });
  }

  // Console/debug handle: lets tooling step the sim deterministically
  // (rAF never fires in hidden tabs, so screenshots freeze mid-pour).
  window.__nivolo = { engine: engine, icons: icons, sfx: sfx, give: GIVE, step: function (n) {
    for (var i = 0; i < n; i++) { Engine.update(engine, 16.7); governSpeeds(); }
    paintIcons();
    drawLines();
  }, repour: repour, stats: function () {
    return {
      sinking: icons.filter(function (it) { return it.sinking; }).length,
      respawns: icons.reduce(function (sum, it) { return sum + (it.respawns || 0); }, 0),
      landsHeard: landsHeard, shoved: shoved,
      repourDone: repourDone, repourPending: repourPending,
    };
  } };
  // ?settle fast-forwards past the pour once all icons have spawned —
  // for screenshot tooling that can't wait out the animation.
  if (/[?&]settle\b/.test(location.search)) {
    setTimeout(function () { window.__nivolo.step(2600); },
      260 + ROSTER.length * SPAWN_GAP + 600);
  }
})();
