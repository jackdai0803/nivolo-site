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
  ];

  function iconSrc(name) { return "assets/icons/" + name + ".png"; }

  /* Static fallback: icons resting in the bowl, no physics. */
  function staticFallback() {
    var w = stage.clientWidth, h = stage.clientHeight;
    var size = iconSize();
    var cx = w / 2;
    var bowlW = Math.min(760, w * 0.92);
    ICONS.forEach(function (icon, i) {
      var el = document.createElement("div");
      el.className = "pit-icon";
      el.style.width = el.style.height = size + "px";
      var row = i < 6 ? 0 : 1;
      var inRow = row === 0 ? 6 : 4;
      var idx = row === 0 ? i : i - 6;
      var spread = bowlW * (row === 0 ? 0.62 : 0.42);
      var x = cx - spread / 2 + (spread / (inRow - 1)) * idx - size / 2;
      var y = h - 12 - 60 - row * (size + 6) - size / 2;
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

  var Engine = Matter.Engine, Bodies = Matter.Bodies, Body = Matter.Body,
      Composite = Matter.Composite, Constraint = Matter.Constraint,
      Query = Matter.Query, Vector = Matter.Vector;

  var engine = Engine.create({ enableSleeping: true });
  engine.gravity.y = 1;

  var walls = [];
  var icons = []; // { body, el, key, label }
  var rimYCurrent = 0;   // top of the bowl, set by buildWalls
  var bowlHalfCurrent = 0; // bowl half-width, set by buildWalls
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
    // Scale with the bowl so the icons read big on desktop (~88px)
    // without overflowing the mobile bowl (~52px). Capped at 88: much
    // bigger and 8-9 icons span the bowl mouth, wedging into an arch.
    var bw = Math.min(760, stageSize().w * 0.92);
    return Math.round(Math.max(52, Math.min(88, bw * 0.115)));
  }

  /* Build the bowl from static segments tracing a U-shaped ellipse arc
     that matches .bowl-visual, plus outer guards so tossed icons return. */
  function buildWalls() {
    walls.forEach(function (wb) { Composite.remove(engine.world, wb); });
    walls = [];
    var s = stageSize();
    var bowlW = Math.min(760, s.w * 0.92);
    var bowlH = s.w < 640 ? 200 : 285;
    var rimY = s.h - 12 - bowlH;
    rimYCurrent = rimY;
    var cx = s.w / 2;
    var a = bowlW / 2, b = bowlH;
    bowlHalfCurrent = a;
    measureSky();

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
    var halfBowl = Math.min(760, s.w * 0.92) / 2;
    // Drop points stay well inside the bowl mouth (alternating sides) so
    // icons slide down the curve — spreading to the rim lets them wedge
    // into a stable arch across the mouth; stacking one column is worse.
    var offsets = [-0.42, 0.34, -0.22, 0.42, -0.08, 0.16, -0.34, 0, 0.26, -0.14];
    ICONS.forEach(function (icon, i) {
      var el = document.createElement("div");
      el.className = "pit-icon";
      el.style.width = el.style.height = size + "px";
      el.innerHTML = '<img src="' + iconSrc(icon[0]) + '" alt="' + icon[1] + ' app icon" draggable="false" />';
      stage.appendChild(el);

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
      }, 260 + i * 340);
    });
  }

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

  /* ── Render loop (DOM transforms; paused when off-screen) ────── */
  var running = false, rafId = null, lastT = 0;

  function frame(t) {
    if (!running) return;
    var dt = lastT ? Math.min(t - lastT, 33) : 16.7;
    lastT = t;
    Engine.update(engine, dt);
    for (var i = 0; i < icons.length; i++) {
      var it = icons[i], b = it.body, half = it.el.offsetWidth / 2;
      // Keep tosses fun but sub-orbital: cap linear and angular speed.
      var sp = Math.hypot(b.velocity.x, b.velocity.y);
      if (sp > 24) Body.setVelocity(b, { x: b.velocity.x * 24 / sp, y: b.velocity.y * 24 / sp });
      if (Math.abs(b.angularVelocity) > 0.45) Body.setAngularVelocity(b, 0.45 * Math.sign(b.angularVelocity));
      it.el.style.transform =
        "translate(" + (b.position.x - half).toFixed(1) + "px," +
        (b.position.y - half).toFixed(1) + "px) rotate(" + b.angle.toFixed(3) + "rad)";
    }
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

  buildWalls();
  spawnIcons();
  setRunning(true);
  // Button rects shift once the webfont lands — remeasure the terrain.
  if (document.fonts && document.fonts.ready) {
    document.fonts.ready.then(function () { buildWalls(); });
  }

  // Console/debug handle: lets tooling step the sim deterministically
  // (rAF never fires in hidden tabs, so screenshots freeze mid-pour).
  window.__nivolo = { engine: engine, icons: icons, step: function (n) {
    for (var i = 0; i < n; i++) Engine.update(engine, 16.7);
  } };
})();
