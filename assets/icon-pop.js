/* Icon popup — click any icon in The Collection to inspect it as a solid
   3D tile. Drag to turn it (it stays where you leave it), tap to flip to
   the story on the back. Art loads on demand from assets/icons-3d/:
   512px WebP for 2x screens, the full 1024px master for 3x. */
(function () {
  "use strict";

  /* The tile's pixel size is owned by CSS (--ipop-tile) so it can adapt to the
     viewport; these are its proportions, expressed as fractions of that size. */
  var BASE = 220, DEPTH = 24 / BASE, STEP = 0.4 / BASE;

  /* Icons with separated background/character art render the front as two
     plates: the background on the tile itself and Nivo floating `depth`
     px above it. Any turn of the tile — cursor sway, drag, tap-flip —
     then produces real parallax: the face shifts subtly against its
     background while staying attached to the tile. depth stays ~10–18. */
  var LAYERED = {
    ghost: { bg: "ghost-bg", face: "ghost-face", depth: 14 },
  };

  /* Full-screen environments shown behind every collection icon. The image
     stays independent from the 3D tile, while `effect` selects a lightweight
     CSS animation that reinforces the icon's story. */
  function scene(id, effect) {
    return { wide: "assets/scenes/" + id + ".webp", effect: effect };
  }
  var SCENES = {
    classic: scene("classic", "aurora"),
    grumpy: scene("grumpy", "pressure"),
    snowy: scene("snowy", "snow"),
    blaze: scene("blaze", "embers"),
    gold: scene("gold", "coins"),
    melting: scene("melting", "drips"),
    sick: scene("sick", "haze"),
    party: scene("party", "confetti"),
    ghost: scene("ghost", "wisps"),
    sleepy: scene("sleepy", "twinkles"),
    waiting: scene("waiting", "bubbles"),
    bored: scene("bored", "dust"),
    focused: scene("focused", "focus"),
    relieved: scene("relieved", "breeze"),
    starstruck: scene("starstruck", "stars"),
    champion: scene("champion", "ribbons"),
    repair: scene("repair", "stitches"),
    revived: scene("revived", "sparkles"),
    peekaboo: scene("peekaboo", "peek"),
    squished: scene("squished", "pressure"),
    love: scene("love", "hearts"),
    detective: scene("detective", "search"),
    turbo: scene("turbo", "speed"),
    rainy: scene("rainy", "rain"),
    upside_down: scene("upside_down", "float"),
    glitch: scene("glitch", "glitch"),
    coming_soon: scene("coming_soon", "fog"),
  };

  /* The artwork is a wide vista; on a portrait phone a cover-crop would show
     only its empty middle, so a taller cut of the same scene is used there. */
  var portraitQ = window.matchMedia("(max-aspect-ratio: 4/5)");
  function sceneSrc(id) {
    var s = SCENES[id];
    return s && (portraitQ.matches && s.tall ? s.tall : s.wide);
  }
  /* the 6% overscan only exists to give the cursor parallax room to travel;
     portrait has no cursor, so it just eats into the vista */
  function sceneZoom() { return portraitQ.matches ? 1 : 1.06; }

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
    '<div class="ipop-scene" aria-hidden="true"><img alt="" /></div>' +
    '<div class="ipop-effects" aria-hidden="true"></div>' +
    '<div class="ipop-ambient" aria-hidden="true">' +
    '  <i class="ipop-aurora ipop-aurora-one"></i>' +
    '  <i class="ipop-aurora ipop-aurora-two"></i>' +
    '  <i class="ipop-star ipop-star-one"></i>' +
    '  <i class="ipop-star ipop-star-two"></i>' +
    '  <i class="ipop-star ipop-star-three"></i>' +
    '  <i class="ipop-star ipop-star-four"></i>' +
    '  <i class="ipop-star ipop-star-five"></i>' +
    '  <i class="ipop-water-glint ipop-glint-one"></i>' +
    '  <i class="ipop-water-glint ipop-glint-two"></i>' +
    '</div>' +
    '<div class="ipop-dialog" role="dialog" aria-modal="true" aria-label="Icon detail">' +
    '  <button class="ipop-close" type="button" aria-label="Close">&times;</button>' +
    '  <div class="ipop-stage"><div class="ipop-tile">' +
    '    <div class="ipop-face ipop-front"><img alt="" /></div>' +
    '    <div class="ipop-face ipop-plate" hidden><img alt="" /></div>' +
    '    <div class="ipop-face ipop-back"><div><h3></h3><p></p></div></div>' +
    '  </div></div>' +
    '  <div class="ipop-shadow"></div>' +
    '  <p class="ipop-hint">Drag to turn it over in your hands &middot; tap to flip</p>' +
    "</div>";
  document.body.appendChild(overlay);

  var tile = overlay.querySelector(".ipop-tile");
  var front = overlay.querySelector(".ipop-front");
  var sceneEl = overlay.querySelector(".ipop-scene");
  var sceneImg = sceneEl.querySelector("img");
  var sceneActive = false;
  var sceneId = null;
  var effectsEl = overlay.querySelector(".ipop-effects");

  /* Deterministic particles avoid layout shifts between openings while still
     giving every scene its own motion language. */
  var EFFECT_COUNTS = {
    snow: 20, rain: 22, embers: 14, confetti: 18, coins: 9,
    twinkles: 12, stars: 12, sparkles: 14, hearts: 10,
    bubbles: 10, dust: 9, drips: 10, stitches: 8,
    glitch: 8, search: 3, speed: 9, ribbons: 4,
    wisps: 6, haze: 5, fog: 6, breeze: 7,
    pressure: 6, peek: 8, float: 7, focus: 5, aurora: 7,
  };
  function buildEffects(type) {
    effectsEl.textContent = "";
    effectsEl.setAttribute("data-effect", type || "");
    var count = EFFECT_COUNTS[type] || 0;
    for (var i = 0; i < count; i++) {
      var bit = document.createElement("i");
      bit.style.setProperty("--i", i);
      bit.style.setProperty("--x", (5 + (i * 37) % 91) + "%");
      bit.style.setProperty("--y", (6 + (i * 29) % 87) + "%");
      bit.style.setProperty("--delay", (-0.43 * i).toFixed(2) + "s");
      bit.style.setProperty("--dur", (4.4 + (i % 6) * 0.73).toFixed(2) + "s");
      bit.style.setProperty("--scale", (0.65 + (i % 5) * 0.16).toFixed(2));
      effectsEl.appendChild(bit);
    }
  }

  // depth as a stack of rounded slices — flat side panels square off the corners
  for (var z = -DEPTH / 2; z <= DEPTH / 2 + 0.000001; z += STEP) {
    var s = document.createElement("div");
    s.className = "ipop-slice";
    // keyed off the CSS knob, so the slab thickens with the tile
    s.style.transform = "translateZ(calc(var(--ipop-tile) * " + z.toFixed(6) + "))";
    tile.insertBefore(s, front);
  }
  // current tile size in px, for the few places that need a real number
  function tilePx() { return tile.offsetWidth || BASE; }

  /* ── rotation state ──
     base = where the tile rests (set by drags and tap-flips).
     follow = a gentle sway toward the cursor, so Nivo watches you move.
     Both feed one rAF loop that eases the displayed angle toward
     base + follow — which also animates the flip, so the CSS transition
     is switched off and every motion runs through the same spring. */
  var base = { x: 0, y: 0 }, cur = { x: 0, y: 0 }, follow = { x: 0, y: 0 };
  var FOLLOW_Y = 30, FOLLOW_X = 16, EASE = 0.13;
  // Full deflection well before the cursor reaches the screen edge —
  // normalising by the whole half-viewport made the sway near-invisible.
  var FOLLOW_REACH = 0.45;
  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  tile.style.transition = "none";

  var plateEl = overlay.querySelector(".ipop-plate");
  var plateDepth = 0;

  var down = false, moved = false, sx = 0, sy = 0, baseX = 0, baseY = 0;
  var rafId = null;
  function frame() {
    if (down) {
      cur.x = base.x; cur.y = base.y;          // drags track the hand exactly
    } else {
      var tx = base.x + follow.x, ty = base.y + follow.y;
      cur.x += (tx - cur.x) * EASE;
      cur.y += (ty - cur.y) * EASE;
    }
    tile.style.transform = "rotateX(" + cur.x + "deg) rotateY(" + cur.y + "deg)";
    if (sceneActive) {
      // The environment drifts opposite the tile at a much lower rate,
      // creating depth without making the backdrop feel attached to the cursor.
      var sceneX = Math.max(-14, Math.min(14, cur.y * -0.28));
      var sceneY = Math.max(-9, Math.min(9, cur.x * 0.20));
      sceneImg.style.transform =
        "translate3d(" + sceneX.toFixed(2) + "px," + sceneY.toFixed(2) + "px,0) scale(" + sceneZoom() + ")";
    }
    if (plateDepth && !plateEl.hidden) {
      // The face's lift collapses as the tile turns away, so from the side
      // Nivo sits flush on the slab instead of visibly hovering off it.
      var offY = Math.abs(cur.y % 180); if (offY > 90) offY = 180 - offY;
      var tilt = Math.min(89, Math.max(offY, Math.abs(cur.x)));
      var f = Math.pow(Math.cos(tilt * Math.PI / 180), 2.5);
      var u = tilePx() / BASE;
      plateEl.style.transform =
        "translateZ(" + ((12 + Math.max(plateDepth * f, 1.2)) * u).toFixed(2) + "px)";
    }
    rafId = requestAnimationFrame(frame);
  }

  var stage = overlay.querySelector(".ipop-stage");
  window.addEventListener("mousemove", function (e) {
    if (!overlay.classList.contains("open") || down || reduceMotion) return;
    var r = stage.getBoundingClientRect();
    var nx = (e.clientX - (r.left + r.width / 2)) / (window.innerWidth / 2 * FOLLOW_REACH);
    var ny = (e.clientY - (r.top + r.height / 2)) / (window.innerHeight / 2 * FOLLOW_REACH);
    nx = Math.max(-1, Math.min(1, nx));
    ny = Math.max(-1, Math.min(1, ny));
    // when the story side faces you, mirror the yaw so the sway still
    // tracks the cursor instead of running away from it
    var facingBack = Math.round(base.y / 180) % 2 !== 0;
    follow.y = nx * FOLLOW_Y * (facingBack ? -1 : 1);
    follow.x = -ny * FOLLOW_X;
  });

  function pt(e) { return e.touches ? e.touches[0] : e; }
  var dragJustEnded = false;
  function start(e) {
    down = true; moved = false; dragJustEnded = false;
    var p = pt(e);
    sx = p.clientX; sy = p.clientY; baseX = base.x; baseY = base.y;
    tile.classList.add("dragging");
    if (!e.touches) e.preventDefault();
  }
  function move(e) {
    if (!down) return;
    var p = pt(e);
    var dx = p.clientX - sx, dy = p.clientY - sy;
    if (Math.abs(dx) > 4 || Math.abs(dy) > 4) moved = true;
    base.y = baseY + dx * 0.6;
    base.x = Math.max(-70, Math.min(70, baseX - dy * 0.6));
    if (e.cancelable) e.preventDefault();
  }
  function end() {
    if (!down) return;
    down = false;
    tile.classList.remove("dragging");
    if (moved) dragJustEnded = true;
    var nearest = Math.round(base.y / 180) * 180;
    var offBy = Math.abs(base.y - nearest);
    if (!moved) {
      // tap: land on a face, never the edge — square-on flips over,
      // side-on goes to whichever face is closest
      base.y = offBy < 45 ? nearest + 180 : nearest;
      base.x = 0;
    } else if (offBy > 68) {
      // never rest edge-on: the slab degenerates to hairlines there
      base.y = nearest;
    }
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
    var layered = LAYERED[id];
    function setSrc(el, base) {
      el.src = "assets/icons-3d/" + base + ".webp";
      el.srcset = "assets/icons-3d/" + base + ".webp 512w, assets/icons-3d/" + base + "-lg.webp 1024w";
      el.sizes = Math.round(tilePx()) + "px";
    }
    if (layered) {
      setSrc(img, layered.bg);
      setSrc(plateEl.querySelector("img"), layered.face);
      plateDepth = layered.depth;
      plateEl.style.transform = "translateZ(" + (12 + layered.depth) + "px)";
      plateEl.hidden = false;
    } else {
      setSrc(img, id);
      plateDepth = 0;
      plateEl.hidden = true;
    }
    if (SCENES[id]) {
      sceneId = id;
      sceneImg.src = sceneSrc(id);
      sceneImg.style.transform = "translate3d(0,0,0) scale(" + sceneZoom() + ")";
      sceneActive = true;
      overlay.setAttribute("data-scene", id);
      buildEffects(SCENES[id].effect);
      overlay.classList.add("has-scene");
    } else {
      sceneId = null;
      sceneActive = false;
      sceneImg.removeAttribute("src");
      overlay.removeAttribute("data-scene");
      buildEffects("");
      overlay.classList.remove("has-scene");
    }
    overlay.querySelector(".ipop-back h3").textContent = name;
    overlay.querySelector(".ipop-back p").textContent = story;
    tintFor(id, function (c) {
      tile.style.setProperty("--tint-dark", mix(c, 0.62));
      tile.style.setProperty("--tint-deep", mix(c, 0.30));
      tile.style.setProperty("--tint-edge", "rgba(" + c.join(",") + ",.55)");
      tile.style.setProperty("--tint-lite", lift(c, 0.62));
    });
    base.x = 0; base.y = 0; cur.x = 0; cur.y = 0; follow.x = 0; follow.y = 0;
    tile.style.transform = "rotateX(0deg) rotateY(0deg)";
    if (rafId === null) rafId = requestAnimationFrame(frame);
    lastFocus = document.activeElement;
    overlay.classList.add("open");
    document.body.classList.add("ipop-lock");
    overlay.querySelector(".ipop-close").focus();
  }
  function close() {
    overlay.classList.remove("open");
    document.body.classList.remove("ipop-lock");
    if (rafId !== null) { cancelAnimationFrame(rafId); rafId = null; }
    sceneActive = false;
    sceneId = null;
    overlay.removeAttribute("data-scene");
    buildEffects("");
    if (lastFocus && lastFocus.focus) lastFocus.focus();
  }
  overlay.addEventListener("click", function (e) {
    if (e.target !== overlay) return;
    // A drag that swings the tile carries the cursor off it, so the release
    // lands on the backdrop and the browser calls that a "click" — which
    // was closing the popup the instant you finished turning the icon.
    if (dragJustEnded) { dragJustEnded = false; return; }
    close();
  });
  overlay.querySelector(".ipop-close").addEventListener("click", close);
  window.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && overlay.classList.contains("open")) close();
  });

  function repickScene() {
    if (!sceneActive || !sceneId) return;
    var next = sceneSrc(sceneId);
    // compare resolved URLs so re-setting the same cut never re-triggers a load
    if (sceneImg.src !== new URL(next, location.href).href) sceneImg.src = next;
  }
  if (portraitQ.addEventListener) portraitQ.addEventListener("change", repickScene);
  else if (portraitQ.addListener) portraitQ.addListener(repickScene);
  window.addEventListener("resize", repickScene);
  window.addEventListener("orientationchange", repickScene);

  /* ── wire up the collection ── */
  var items = document.querySelectorAll(
    "#collection .lore-card, #collection .lore-mini li"
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
