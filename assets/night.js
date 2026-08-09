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
    var size = w < 640 ? 52 : 68;
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

  function stageSize() {
    return { w: stage.clientWidth, h: stage.clientHeight };
  }

  function iconSize() {
    return stageSize().w < 640 ? 50 : 64;
  }

  /* Build the bowl from static segments tracing a U-shaped ellipse arc
     that matches .bowl-visual, plus outer guards so tossed icons return. */
  function buildWalls() {
    walls.forEach(function (wb) { Composite.remove(engine.world, wb); });
    walls = [];
    var s = stageSize();
    var bowlW = Math.min(760, s.w * 0.92);
    var bowlH = s.w < 640 ? 200 : 250;
    var rimY = s.h - 12 - bowlH;
    var cx = s.w / 2;
    var a = bowlW / 2, b = bowlH;

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
    // Rim guards angled slightly outward, and hard stage bounds.
    walls.push(Bodies.rectangle(cx - a - 16, rimY - 210, 28, 520, { isStatic: true, angle: -0.08 }));
    walls.push(Bodies.rectangle(cx + a + 16, rimY - 210, 28, 520, { isStatic: true, angle: 0.08 }));
    walls.push(Bodies.rectangle(-40, s.h / 2 - 300, 80, s.h + 1200, { isStatic: true }));
    walls.push(Bodies.rectangle(s.w + 40, s.h / 2 - 300, 80, s.h + 1200, { isStatic: true }));
    walls.push(Bodies.rectangle(cx, -640, s.w + 400, 80, { isStatic: true }));
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
    var offsets = [-0.5, 0.4, -0.3, 0.5, -0.1, 0.2, -0.4, 0, 0.3, -0.2];
    ICONS.forEach(function (icon, i) {
      var el = document.createElement("div");
      el.className = "pit-icon";
      el.style.width = el.style.height = size + "px";
      el.innerHTML = '<img src="' + iconSrc(icon[0]) + '" alt="' + icon[1] + ' app icon" draggable="false" />';
      stage.appendChild(el);

      var body = Bodies.rectangle(
        cx + halfBowl * (offsets[i % offsets.length] || 0),
        -70 - (i % 3) * 60,
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
      }, 260 + i * 220);
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

  /* Escape hatch: anything that clips through geometry gets re-dropped. */
  setInterval(function () {
    var s = stageSize();
    icons.forEach(function (it) {
      var p = it.body.position;
      if (p.y > s.h + 160 || p.x < -160 || p.x > s.w + 160) {
        Body.setPosition(it.body, { x: s.w / 2 + (Math.random() * 120 - 60), y: -80 });
        Body.setVelocity(it.body, { x: 0, y: 0 });
        Matter.Sleeping.set(it.body, false);
      }
    });
  }, 2500);

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
})();
