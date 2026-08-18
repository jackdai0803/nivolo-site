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
    var bowlW = iceberg ? Math.min(740, w * 0.82) : Math.min(760, w * 0.92);
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
      return Math.round(Math.max(36, Math.min(84, Math.sqrt(s.w * s.h * 0.28 / ICONS.length))));
    }
    var bw = Math.min(760, s.w * 0.92);
    var bh = s.w < 640 ? 200 : 285;
    var area = Math.PI * (bw / 2) * bh / 2;
    var size = Math.sqrt(area * 0.55 / ICONS.length);
    // The floe doesn't have to hold the whole roster — overflow swims —
    // so icons run big and the colony spills into the water.
    if (VARIANT === "iceberg") size *= 1.3;
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
      var bergW = Math.min(740, s.w * 0.82);
      var topEnd = waterY - (mobile ? 24 : 34);
      var waterLayerH = mobile ? 240 : 300;
      var dip = 13, half = bergW / 2, quarter = bergW / 4;
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
      // Underwater flanks lean outward so edge landings slide off, not perch.
      walls.push(Bodies.rectangle(cx - half - 35, topEnd + 79, 30, 150, { isStatic: true, angle: 0.5 }));
      walls.push(Bodies.rectangle(cx + half + 35, topEnd + 79, 30, 150, { isStatic: true, angle: -0.5 }));
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
      ? Math.min(740, s.w * 0.82) / 2 * 0.6
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
          restitution: VARIANT === "iceberg" ? 0.25 : 0.35,
          // Grippy on ice so the open mound piles steep instead of
          // shedding its edges into the water.
          friction: VARIANT === "iceberg" ? 0.45 : 0.08,
          frictionAir: 0.015,
          angle: Math.random() * 0.8 - 0.4,
        }
      );
      Body.setAngularVelocity(body, Math.random() * 0.08 - 0.04);
      icons.push({ body: body, el: el, key: icon[0], label: icon[1], lastGroundPopAt: -1e9 });
      // Stagger the automatic drop so the icons pour in rather than dump.
      setTimeout(function () {
        Composite.add(engine.world, body);
        if (i === ICONS.length - 1) { pit.classList.add("ready"); allSpawned = true; }
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
        if (ctx.state !== "running") return;
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
    var lastTry = -1e9;
    function tryResume() {
      if (armed || muted) return;
      var now = (window.performance && performance.now) ? performance.now() : +new Date();
      if (now - lastTry < 400) return; // mousemove fires by the hundred
      lastTry = now;
      var c = ensure();
      if (!c) return;
      if (c.state === "running") { armed = true; if (onLive) onLive(); return; }
      var r = c.resume();
      if (r && r.catch) r.catch(function () {});
    }
    function arm() {
      armed = true;
      var c = ensure();
      if (c && c.state === "suspended") c.resume();
    }
    /* Oscillator scheduled while the context is still resuming plays the
       moment it comes alive — no need to await resume(). */
    function tone(type, f0, f1, vol, dur, delay) {
      var t = ctx.currentTime + (delay || 0);
      var o = ctx.createOscillator(), g = ctx.createGain();
      o.type = type;
      o.frequency.setValueAtTime(f0, t);
      o.frequency.exponentialRampToValueAtTime(Math.max(1, f1), t + dur);
      g.gain.setValueAtTime(vol, t);
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
    function hit(strength) {
      if (!armed || muted || !ctx) return false;
      var t = ctx.currentTime;
      if (t - lastAt < 0.03) return false; // a pile settling is one pop, not ten
      lastAt = t;
      played++;
      // Same rising "bloop" family as the grab pop — pitch and volume
      // scale with impact so landings pop and nudges blip.
      var v = 0.06 + 0.22 * strength;
      var f = 420 + Math.random() * 140 + 260 * strength;
      tone("sine", f * 0.52, f, v, 0.07);
      return true;
    }
    function land(strength) {
      if (!armed || muted || !ctx) return false;
      var t = ctx.currentTime;
      if (t - lastLandAt < 0.025) return false;
      lastLandAt = t;
      strength = Math.max(0.28, Math.min(1, strength || 0.45));
      played++;
      // A distinct, round pop reserved for the icon's first contact with
      // the white ice. It has its own throttle, so an icon collision just
      // before touchdown cannot swallow the landing sound.
      var f = 520 + 230 * strength;
      tone("sine", f * 0.48, f, 0.11 + 0.13 * strength, 0.085);
      return true;
    }
    function pop() {
      if (muted || !ensure()) return;
      played++;
      tone("sine", 330, 640, 0.14, 0.07);
    }
    function plop(strength) {
      if (!armed || muted || !ctx) return;
      var t = ctx.currentTime;
      if (t - lastSplashAt < 0.08) return;
      lastSplashAt = t;
      strength = Math.max(0.18, Math.min(1, strength || 0.45));
      played++;
      // Water rings UP as the cavity closes — the old falling bloop had it
      // backwards. Two rising notes: the drop, then a second a fifth above,
      // shorter and quieter, like the droplet that follows it in.
      var f = 560 + 220 * strength;
      var v = 0.10 + 0.12 * strength;
      tone("sine", f * 0.55, f * 1.75, v, 0.075);
      tone("sine", f * 0.82, f * 2.62, v * 0.62, 0.055, 0.085);
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
             setMuted: setMuted, onLive: function (fn) { onLive = fn; },
             isMuted: function () { return muted; },
             stats: function () { return { armed: armed, state: ctx ? ctx.state : null, played: played }; } };
  })();

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
        if (simNow - (landedIcon.lastGroundPopAt || -1e9) > 260 &&
            sfx.land(Math.max(0.34, Math.min(1, rel / 11)))) {
          landedIcon.lastGroundPopAt = simNow;
          landsHeard++; // enough of these and the replay is unnecessary
        }
      }
    }
  });

  /* Keep audio resumable after any real gesture. The pour starts at load,
     long before a visitor can click, so the browser's autoplay policy
     silences every landing — the pops Jack expects are simply never heard.
     Arming therefore also schedules a replay of the pour (see maybeRepour):
     the colony lifts back into the sky and falls again, this time out loud. */
  ["pointerdown", "pointerup", "keydown"].forEach(function (type) {
    document.addEventListener(type, function () {
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

  var stageOnScreen = false;
  new IntersectionObserver(function (entries) {
    stageOnScreen = entries[0].isIntersecting;
    setRunning(stageOnScreen && !document.hidden);
    if (stageOnScreen) { armPourGrace(); maybeRepour(); }
  }, { threshold: 0.02 }).observe(stage);
  document.addEventListener("visibilitychange", function () {
    if (document.hidden) setRunning(false);
    else if (stage.getBoundingClientRect().bottom > 0) { setRunning(true); maybeRepour(); }
  });

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
    if (VARIANT === "iceberg") sinkingPass();
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
    if (VARIANT === "iceberg") return;
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
    if (pourStarted || (!force && !stageOnScreen)) return;
    pourStarted = true;
    if (pourGraceTimer) { clearTimeout(pourGraceTimer); pourGraceTimer = null; }
    // Poured without a gesture: the landings are about to be swallowed,
    // so the invite stops asking for a pour and starts offering the replay.
    if (!sfx.stats().armed && !force) showInvite("Tap for the sound");
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
  window.__nivolo = { engine: engine, icons: icons, sfx: sfx, step: function (n) {
    for (var i = 0; i < n; i++) Engine.update(engine, 16.7);
    drawLines();
  }, repour: repour, stats: function () {
    return {
      sinking: icons.filter(function (it) { return it.sinking; }).length,
      respawns: icons.reduce(function (sum, it) { return sum + (it.respawns || 0); }, 0),
      landsHeard: landsHeard, repourDone: repourDone, repourPending: repourPending,
    };
  } };
  // ?settle fast-forwards past the pour once all icons have spawned —
  // for screenshot tooling that can't wait out the animation.
  if (/[?&]settle\b/.test(location.search)) {
    setTimeout(function () { window.__nivolo.step(2600); },
      260 + ICONS.length * SPAWN_GAP + 600);
  }
})();
