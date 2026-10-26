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
    return { wide: "assets/scenes/" + id + ".webp?v=2", effect: effect };
  }
  function keepsakeScene(id, effect) {
    return { wide: "assets/scenes/" + id + ".jpg?v=2", effect: effect };
  }
  var SCENES = {
    "early-supporter": keepsakeScene("early-supporter", "halo"),
    porcelain: keepsakeScene("porcelain", "porcelain"),
    jade: keepsakeScene("jade", "jade"),
    kintsugi: keepsakeScene("kintsugi", "kintsugi"),
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
  var NEW_ICONS = { "early-supporter": true, porcelain: true, jade: true, kintsugi: true };
  function iconSrc(id, large) {
    if (id === "jade" || id === "porcelain") return "assets/charms/" + id + (large ? "-lg" : "") + ".jpg";
    return "assets/icons-3d/" + id + (large ? "-lg" : "") + (NEW_ICONS[id] ? ".jpg" : ".webp");
  }

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
    img.src = iconSrc(id, false);
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
    '  <div class="ipop-stage"><div class="ipop-suspension"><div class="ipop-tile">' +
    '    <div class="ipop-face ipop-front"><img alt="" /></div>' +
    '    <div class="ipop-face ipop-plate" hidden><img alt="" /></div>' +
    '    <div class="ipop-face ipop-back"><div><h3></h3><p></p></div></div>' +
    '    <span class="ipop-eyelet" aria-hidden="true"></span>' +
    '    <img class="ipop-cord" src="assets/charms/jade-cord.svg" alt="" aria-hidden="true" />' +
    '  </div></div></div>' +
    '  <div class="ipop-shadow"></div>' +
    '  <p class="ipop-hint">Drag to turn it over in your hands &middot; tap to flip</p>' +
    "</div>";
  document.body.appendChild(overlay);

  var tile = overlay.querySelector(".ipop-tile");
  var suspension = overlay.querySelector(".ipop-suspension");
  var pendant = false, ceramic = false, collectible = false;
  var swing = 0, swingVelocity = 0, swingTarget = 0;
  var front = overlay.querySelector(".ipop-front");
  var sceneEl = overlay.querySelector(".ipop-scene");
  var sceneImg = sceneEl.querySelector("img");
  var sceneActive = false;
  var sceneId = null;
  var effectsEl = overlay.querySelector(".ipop-effects");
  var sceneRevealToken = 0;
  var closeCleanupTimer = null;

  /* ── scene pre-warming ──
     A scene that is still downloading when the popup opens arrives half a
     second after the icon, which reads as a bug. So every environment is
     fetched *and decoded* ahead of the click — eagerly on hover/focus, and
     lazily for the whole set once the collection nears the viewport. Once a
     scene is warm the popup can paint it in the same frame as the tile. */
  var warm = {};
  function warmScene(id) {
    var src = sceneSrc(id);
    if (!src || warm[src]) return warm[src];
    var entry = warm[src] = { ready: false, img: new Image() };
    entry.img.decoding = "async";
    function done() { entry.ready = true; }
    entry.img.onload = function () {
      done();
      // decode() moves the CPU cost off the click too, but it is only an
      // extra: in a background tab it never settles, and gating readiness
      // on it would leave every scene cold for a restored tab.
      if (entry.img.decode) entry.img.decode().catch(function () {});
    };
    entry.img.onerror = done;   // a missing scene must not block the reveal
    entry.img.src = src;
    return entry;
  }
  /* The tile art is warmed the same way. `hires` mirrors the srcset and
     sizes the popup itself will use, so the browser resolves to the very
     same candidate it is about to request — a 2x screen warms the 1024px
     master, a 1x screen the 512. Without hires only the 512 base is taken:
     it is a third of the bytes and it is what the slab tint samples. */
  function iconArt(id) {
    var layered = LAYERED[id];
    return layered ? [layered.bg, layered.face] : [id];
  }
  function warmIcon(id, hires) {
    var bases = iconArt(id);
    if (LAYERED[id]) bases = bases.concat(id);   // the tint still reads the composite
    bases.forEach(function (b) {
      var key = (hires ? "hi:" : "lo:") + b;
      if (warm[key]) return;
      var entry = warm[key] = { ready: false, img: new Image() };
      entry.img.decoding = "async";
      entry.img.onload = entry.img.onerror = function () { entry.ready = true; };
      if (hires) {
        entry.img.sizes = Math.round(tilePx()) + "px";
        entry.img.srcset = iconSrc(b, false) + " 512w, " + iconSrc(b, true) + " 1024w";
      }
      entry.img.src = iconSrc(b, false);
    });
  }

  function sceneIsWarm(id) {
    var src = sceneSrc(id);
    var entry = src && warm[src];
    return !!(entry && entry.ready) || !!(sceneImg.src && sceneImg.complete &&
      sceneImg.naturalWidth && sceneImg.src === new URL(src, location.href).href);
  }

  /* Cold path only: the art was not ready in time, so fade it in as soon as
     it lands rather than holding the whole popup back. */
  function queueSceneReveal(nextSrc) {
    var token = ++sceneRevealToken;
    function reveal() {
      if (token !== sceneRevealToken || !overlay.classList.contains("open")) return;
      overlay.classList.remove("scene-instant");
      // flush the opacity:0 start state synchronously — a rAF would never run
      // here in a backgrounded tab, leaving the scene invisible
      void sceneEl.offsetWidth;
      overlay.classList.add("scene-ready");
    }
    sceneImg.onload = reveal;
    if (sceneImg.src !== new URL(nextSrc, location.href).href) sceneImg.src = nextSrc;
    if (sceneImg.complete && sceneImg.naturalWidth) reveal();
  }

  /* Deterministic particles avoid layout shifts between openings while still
     giving every scene its own motion language. */
  var EFFECT_COUNTS = {
    snow: 20, rain: 22, embers: 14, confetti: 18, coins: 9,
    halo: 12, porcelain: 14, jade: 9, kintsugi: 12,
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
    s.style.transform = "translateZ(calc(var(--ipop-depth-size, var(--ipop-tile)) * " + z.toFixed(6) + "))";
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
  var rafId = null, lastFrame = 0;
  function frame(now) {
    // EASE is "13% of the way there per 1/60s". Scaled by the real time
    // since the last frame, so the tile turns at the same speed on a 120Hz
    // screen as on a 60Hz one instead of twice as fast.
    var dt = lastFrame && now ? Math.min(100, now - lastFrame) : 1000 / 60;
    lastFrame = now || 0;
    if (down) {
      cur.x = base.x; cur.y = base.y;          // drags track the hand exactly
    } else {
      var tx = base.x + follow.x, ty = base.y + follow.y;
      var k = 1 - Math.pow(1 - EASE, dt / (1000 / 60));
      cur.x += (tx - cur.x) * (reduceMotion ? 1 : k);
      cur.y += (ty - cur.y) * (reduceMotion ? 1 : k);
    }
    if (collectible && !reduceMotion) {
      if (down) {
        swingVelocity = (swingTarget - swing) * 0.2;
        swing = swingTarget;
      } else {
        // Small fixed steps keep the damped swing stable after a slow frame.
        var steps = Math.ceil(dt / 8), step = dt / steps / (1000 / 60);
        for (var n = 0; n < steps; n++) {
          swingVelocity += -swing * 0.018 * step;
          swingVelocity *= Math.pow(ceramic ? 0.95 : 0.975, step);
          swing += swingVelocity * step;
        }
      }
      suspension.style.transform = "rotateZ(" + swing.toFixed(3) + "deg)";
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
    if (e.button != null && e.button !== 0) return;
    down = true; moved = false; dragJustEnded = false;
    swingTarget = swing;
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
    if (collectible) swingTarget = Math.max(-12, Math.min(12, dx * (ceramic ? 0.04 : 0.06)));
    if (e.cancelable) e.preventDefault();
  }
  function end(cancelled) {
    if (!down) return;
    down = false;
    tile.classList.remove("dragging");
    if (moved) dragJustEnded = true;
    var nearest = Math.round(base.y / 180) * 180;
    var offBy = Math.abs(base.y - nearest);
    if (!moved && cancelled !== true) {
      // tap: land on a face, never the edge — square-on flips over,
      // side-on goes to whichever face is closest
      base.y = offBy < 45 ? nearest + 180 : nearest;
      base.x = 0;
    } else if (offBy > 68) {
      // never rest edge-on: the slab degenerates to hairlines there
      base.y = nearest;
    }
    if (collectible) {
      base.y = Math.round(base.y / 180) * 180;
      base.x = 0;
      follow.x = follow.y = 0;
      if (!moved && cancelled !== true && !reduceMotion) swingVelocity += 0.45;
    }
  }
  tile.addEventListener("mousedown", start);
  window.addEventListener("mousemove", move);
  window.addEventListener("mouseup", end);
  tile.addEventListener("touchstart", start, { passive: true });
  tile.addEventListener("touchmove", move, { passive: false });
  tile.addEventListener("touchend", end);
  tile.addEventListener("touchcancel", function () { end(true); });
  window.addEventListener("blur", function () { end(true); });
  tile.addEventListener("keydown", function (e) {
    if (!collectible || (e.key !== "Enter" && e.key !== " ")) return;
    e.preventDefault();
    base.y = Math.round(base.y / 180) * 180 + 180;
    base.x = follow.x = follow.y = 0;
    if (!reduceMotion) swingVelocity += 0.45;
  });
  tile.addEventListener("dragstart", function (e) { e.preventDefault(); });

  /* ── open / close ── */
  var lastFocus = null;
  function openFor(id, name, story) {
    pendant = id === "jade";
    ceramic = id === "porcelain";
    collectible = pendant || ceramic;
    overlay.classList.toggle("is-pendant", pendant);
    overlay.classList.toggle("is-porcelain", ceramic);
    swing = collectible && !reduceMotion ? (ceramic ? -2 : -3) : 0;
    swingVelocity = swingTarget = 0;
    suspension.style.transform = "rotateZ(" + swing + "deg)";
    if (collectible) {
      tile.tabIndex = 0;
      tile.setAttribute("role", "button");
      tile.setAttribute("aria-label", ceramic ? "Flip Porcelain medallion to read its story" : "Flip Jade pendant to read its story");
    } else {
      tile.removeAttribute("tabindex");
      tile.removeAttribute("role");
      tile.removeAttribute("aria-label");
    }
    overlay.querySelector(".ipop-hint").textContent = pendant
      ? "Drag to turn · release to sway · tap to flip"
      : ceramic ? "Drag to turn · release to settle · tap to flip"
      : "Drag to turn it over in your hands · tap to flip";
    if (closeCleanupTimer !== null) {
      clearTimeout(closeCleanupTimer);
      closeCleanupTimer = null;
    }
    overlay.classList.remove("scene-ready");
    overlay.classList.remove("scene-instant");
    var img = front.querySelector("img");
    var layered = LAYERED[id];
    function setSrc(el, base) {
      el.src = iconSrc(base, false);
      el.srcset = iconSrc(base, false) + " 512w, " + iconSrc(base, true) + " 1024w";
      el.sizes = Math.round(tilePx()) + "px";
    }
    /* The collection thumbnail is the same artwork at 160px and is already
       decoded on the page behind the popup, so it fills the face on the very
       first frame. The full-size art then sharpens in on top of it, instead
       of the tile sitting empty while it downloads. */
    tile.classList.remove("icon-ready");
    tile.classList.remove("icon-instant");
    front.style.backgroundImage = 'url("' + (collectible ? iconSrc(id, false) : 'assets/icons/' + id + '.png') + '")';
    img.onload = function () { tile.classList.add("icon-ready"); };
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
    // already in cache: no crossfade at all, the art is simply there
    if (img.complete && img.naturalWidth) {
      tile.classList.add("icon-instant");
      tile.classList.add("icon-ready");
    }
    warmIcon(id, true);   // keeps the master warm for the next open
    if (SCENES[id]) {
      sceneId = id;
      sceneImg.style.transform = "translate3d(0,0,0) scale(" + sceneZoom() + ")";
      sceneActive = true;
      overlay.setAttribute("data-scene", id);
      buildEffects(SCENES[id].effect);
      overlay.classList.add("has-scene");
      if (sceneIsWarm(id)) {
        /* Ready before the click: skip the fade of its own and let the
           overlay's single fade carry background and icon in together. */
        sceneRevealToken++;
        sceneImg.onload = null;
        var src = sceneSrc(id);
        if (sceneImg.src !== new URL(src, location.href).href) sceneImg.src = src;
        overlay.classList.add("scene-instant");
        overlay.classList.add("scene-ready");
      } else {
        overlay.classList.remove("scene-instant");
        queueSceneReveal(sceneSrc(id));
        warmScene(id);
      }
    } else {
      sceneRevealToken++;
      sceneId = null;
      sceneActive = false;
      sceneImg.removeAttribute("src");
      overlay.removeAttribute("data-scene");
      buildEffects("");
      overlay.classList.remove("has-scene");
      overlay.classList.remove("scene-instant");
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
    if (rafId === null) { lastFrame = 0; rafId = requestAnimationFrame(frame); }
    lastFocus = document.activeElement;
    overlay.classList.add("open");
    document.body.classList.add("ipop-lock");
    overlay.querySelector(".ipop-close").focus();
  }
  function close() {
    down = false;
    tile.classList.remove("dragging");
    // scene-ready stays on through the fade-out: dropping it here would snap
    // an instant-revealed background away while the icon was still leaving
    overlay.classList.remove("open");
    document.body.classList.remove("ipop-lock");
    if (rafId !== null) { cancelAnimationFrame(rafId); rafId = null; }
    sceneRevealToken++;
    sceneActive = false;
    sceneId = null;
    closeCleanupTimer = setTimeout(function () {
      if (overlay.classList.contains("open")) return;
      overlay.classList.remove("scene-ready");
      overlay.classList.remove("scene-instant");
      overlay.classList.remove("has-scene");
      overlay.removeAttribute("data-scene");
      sceneImg.removeAttribute("src");
      buildEffects("");
      closeCleanupTimer = null;
    }, 620);
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
    if (!overlay.classList.contains("open")) return;
    if (e.key === "Escape") { close(); return; }
    /* The dialog says aria-modal, so Tab has to stay inside it: without
       this the focus walked off into the page behind the dark overlay. */
    if (e.key !== "Tab") return;
    var stops = Array.prototype.filter.call(
      overlay.querySelectorAll("button, [href], [tabindex]:not([tabindex='-1'])"),
      function (n) { return !n.disabled && n.offsetParent !== null; }
    );
    if (!stops.length) { e.preventDefault(); return; }
    var first = stops[0], last = stops[stops.length - 1];
    var inside = overlay.contains(document.activeElement);
    if (e.shiftKey && (!inside || document.activeElement === first)) { e.preventDefault(); last.focus(); }
    else if (!e.shiftKey && (!inside || document.activeElement === last)) { e.preventDefault(); first.focus(); }
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
  var warmQueue = [];
  function attachPreview(el, buttonHost, img, head, para) {
    if (!img || !head || !para) return;
    var m = (img.getAttribute("src") || "").match(/([a-z_-]+)\.png$/);
    if (!m) return;
    var id = m[1];
    buttonHost.classList.add("ipop-source");
    /* A real button, laid over the whole card: the card stays an article
       (or a list item) with its heading and its story, and the thing that
       opens it is something a keyboard and a screen reader already know
       how to press. role="button" on the card itself hid all of that. */
    var opener = document.createElement("button");
    opener.type = "button";
    opener.className = "ipop-open";
    opener.setAttribute("aria-label", "View " + head.textContent + " up close");
    buttonHost.appendChild(opener);
    function go() { openFor(id, head.textContent, para.textContent); }
    /* fetch this one's art and environment the moment there is any hint of
       intent, so by the time the click lands the pixels are already there */
    function prime() { warmScene(id); warmIcon(id, true); }
    el.addEventListener("pointerenter", prime);
    el.addEventListener("pointerdown", prime);
    opener.addEventListener("focus", prime);
    el.addEventListener("touchstart", prime, { passive: true });
    opener.addEventListener("click", go);
    warmQueue.push(id);
  }
  var supporter = document.querySelector("#collection .early-supporter");
  if (supporter) attachPreview(supporter, supporter.querySelector(".early-supporter-art"), supporter.querySelector(".early-supporter-art img"), supporter.querySelector("h3"), supporter.querySelector(".early-supporter-copy > p:not(.early-supporter-kicker)"));
  Array.prototype.forEach.call(document.querySelectorAll("#collection .keepsake-card"), function (el) {
    attachPreview(el, el, el.querySelector("img"), el.querySelector("h4"), el.querySelector("p"));
  });
  Array.prototype.forEach.call(document.querySelectorAll("#collection .lore-card, #collection .lore-mini li"), function (el) {
    attachPreview(el, el, el.querySelector("img"), el.querySelector("h3"), el.querySelector("p"));
  });

  /* Once the collection is in reach, scenes and tile art are warmed quietly
     in the background, a few
     at a time, well behind anything the page still needs. Taps get the same
     instant open as hovers this way, since a finger never announces itself
     early. The 1024px masters stay out of the bulk pass — they are three
     times the bytes, and the thumbnail placeholder covers the wait. */
  function drainWarmQueue() {
    if (!warmQueue.length) return;
    warmQueue.splice(0, 4).forEach(function (id) {
      warmScene(id);
      warmIcon(id, false);
    });
    // idle time when the browser offers it, a plain timer when it does not —
    // a throttled idle callback must not be able to stall the queue
    var went = false;
    function next() { if (went) return; went = true; drainWarmQueue(); }
    if (window.requestIdleCallback) requestIdleCallback(next, { timeout: 400 });
    setTimeout(next, 400);
  }
  /* A plain proximity check rather than an IntersectionObserver: observers
     are only delivered on a rendering update, which a backgrounded tab does
     not get — the warm-up would then be waiting at the moment the tab comes
     back and the first icon is tapped. */
  var collection = document.getElementById("collection");
  function nearCollection() {
    if (!collection) return false;
    var r = collection.getBoundingClientRect();
    return r.top < window.innerHeight + 900 && r.bottom > -900;
  }
  function maybeWarm() {
    if (!warmQueue.length || nearCollection()) {
      window.removeEventListener("scroll", maybeWarm);
      window.removeEventListener("resize", maybeWarm);
      drainWarmQueue();
    }
  }
  window.addEventListener("scroll", maybeWarm, { passive: true });
  window.addEventListener("resize", maybeWarm, { passive: true });
  window.addEventListener("load", maybeWarm);
  maybeWarm();

  /* Scroll events are not delivered while a tab is backgrounded, and a
     restored tab can be scrolled to the collection already. A slow poll of
     the same proximity test covers that — timers keep running when the
     rendering loop does not — and it stops itself once warming starts. */
  var poll = setInterval(function () {
    if (!warmQueue.length) return clearInterval(poll);
    if (nearCollection()) { clearInterval(poll); drainWarmQueue(); }
  }, 500);
})();
