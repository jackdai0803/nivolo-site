// Regenerates assets/screens/*.png from the real app, so the marketing
// screenshots can be refreshed whenever the app UI changes.
//
//   cd ~/pebble-app && npm run dev -- --port 5273     # in one terminal
//   npm i puppeteer-core && node tools/capture-screens.mjs
//
// It seeds a demo user ("Alex", 12-day streak, 4 finished goals) straight
// into localStorage, then taps through to each screen. Afterwards, run the
// resize/WebP step — see the note at the bottom of this file.
import puppeteer from "puppeteer-core";
import fs from "node:fs";
import path from "node:path";

const CHROME = "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";
const URL = "http://localhost:5273";
const OUT = new URL("../assets/screens/", import.meta.url).pathname;
fs.mkdirSync(OUT, { recursive: true });

// Same demo state used in the browser pane, kept in one place so every
// screenshot shows a consistent "Alex" with a 12-day streak.
const buildSnapshot = (screen) => {
  const day = (n) => { const d = new Date(); d.setDate(d.getDate() + n); return d.toISOString().split("T")[0]; };
  const iso = (n, h = 9) => { const d = new Date(); d.setDate(d.getDate() + n); d.setHours(h, 12, 0, 0); return d.toISOString(); };
  const mkSteps = (pre, titles, activeIdx) => titles.map((t, i) => ({
    id: pre + "s" + i, title: t,
    status: i < activeIdx ? "complete" : i === activeIdx ? "active" : "pending",
    targetActions: 3,
    ...(i <= activeIdx ? { startedAt: iso(-20 + i * 4) } : {}),
    ...(i < activeIdx ? { completedAt: iso(-16 + i * 4) } : {}),
  }));
  // Finished goals so the Trophy Shelf and the "goals completed" stat
  // line up with the four gems below.
  const doneGoal = (id, title, face, n) => ({
    id, title, why: "", refined: title, iconFace: face, improvements: [],
    steps: [{ id: id + "s0", title: "Finished", status: "complete", targetActions: 1, startedAt: iso(n - 30), completedAt: iso(n) }],
    milestones: [{ id: id + "m0", title: "Done", reached: true, reachedAt: iso(n) }],
    status: "completed", createdAt: iso(n - 30), completedAt: iso(n),
  });
  const goals = [
    doneGoal("gx1", "Read 12 books", "happy", -120),
    doneGoal("gx2", "Morning pages", "celebrate", -84),
    doneGoal("gx3", "Learn to swim", "determined", -52),
    doneGoal("gx4", "Cook 20 meals", "love", -21),
    { id: "g1", title: "Learn guitar", why: "Music calms me down after work.", refined: "Learn 5 calming songs in 3 months",
      iconFace: "excited", improvements: ["Play for friends", "Feel less stressed"],
      steps: mkSteps("g1", ["Borrow a starter guitar", "Learn 4 open chords", "Play a full song slowly", "Record yourself once"], 2),
      milestones: [{ id: "g1m0", title: "First full song", reached: true, reachedAt: iso(-9) }, { id: "g1m1", title: "Play for someone", reached: false }],
      status: "active", createdAt: iso(-24) },
    { id: "g2", title: "Run a 5K", why: "I want my energy back.", refined: "Run 5K without stopping by October",
      iconFace: "determined", improvements: ["Sleep better"],
      steps: mkSteps("g2", ["Walk 20 min daily", "Jog 1K without stopping", "Build to 3K", "Run the full 5K"], 1),
      milestones: [{ id: "g2m0", title: "First 1K", reached: true, reachedAt: iso(-5) }, { id: "g2m1", title: "Race day", reached: false }],
      status: "active", createdAt: iso(-18) },
  ];
  const gTexts = ["Practiced 15 minutes", "Chord changes drill", "Played through the chorus"];
  const rTexts = ["Ran the neighbourhood loop", "Easy 20 min jog", "Stretched and walked"];
  const stepFor = (goalId, n) => goalId === "g1"
    ? (n >= -1 ? "g1s2" : n >= -6 ? "g1s1" : "g1s0")
    : (n >= 0 ? "g2s1" : "g2s0");
  const actions = [];
  for (let i = 0; i < 12; i++) {
    const n = -i;
    const gid = i % 2 === 0 ? "g1" : "g2";
    actions.push({ id: "a" + i, goalId: gid, stepId: stepFor(gid, n), text: (gid === "g1" ? gTexts : rTexts)[i % 3], createdAt: iso(n, 9), pebbles: 5 });
  }
  actions.push({ id: "aExtra", goalId: "g1", stepId: "g1s2", text: "Chord changes drill", createdAt: iso(0, 14), pebbles: 5 });
  const gems = [
    { id: "gemA", goalId: "gx1", goalTitle: "Read 12 books", iconFace: "happy", type: "goal", earnedAt: iso(-120), reflection: "", pebbles: 50 },
    { id: "gemB", goalId: "gx2", goalTitle: "Morning pages", iconFace: "celebrate", type: "goal", earnedAt: iso(-84), reflection: "", pebbles: 50 },
    { id: "gemC", goalId: "gx3", goalTitle: "Learn to swim", iconFace: "determined", type: "goal", earnedAt: iso(-52), reflection: "", pebbles: 50 },
    { id: "gemD", goalId: "gx4", goalTitle: "Cook 20 meals", iconFace: "love", type: "goal", earnedAt: iso(-21), reflection: "", pebbles: 50 },
  ];
  const data = {
    goals, actions, gems,
    // "Goals done" on Profile counts goal_completed timeline events
    // (App.jsx:6721), not goal.status — so each finished goal needs one.
    timelineEvents: [
      { id: "t1", type: "goal_started", goalId: "g1", title: "Goal started: Learn guitar", date: iso(-24) },
      { id: "t2", type: "milestone", goalId: "g1", title: "Milestone reached: First full song", date: iso(-9) },
      { id: "t3", type: "milestone", goalId: "g2", title: "Milestone reached: First 1K", date: iso(-5) },
      { id: "t4", type: "goal_completed", goalId: "gx1", title: "Goal completed: Read 12 books", date: iso(-120) },
      { id: "t5", type: "goal_completed", goalId: "gx2", title: "Goal completed: Morning pages", date: iso(-84) },
      { id: "t6", type: "goal_completed", goalId: "gx3", title: "Goal completed: Learn to swim", date: iso(-52) },
      { id: "t7", type: "goal_completed", goalId: "gx4", title: "Goal completed: Cook 20 meals", date: iso(-21) },
    ],
    flames: 24, pebbles: 240, totalPebblesEarned: 615,
    ownedItems: ["none", "scarf_red", "hat_top", "earmuffs"],
    equipped: { outfit: null, headwear: null, accessory: null },
    activeFlame: null, pebbleGrowth: { totalDeposited: 0 },
    userName: "Alex", userBirthday: "2001-04-11", userHandle: "alex",
    claimedEvents: [], goalDrafts: [], ownedWorlds: ["empty_snowfield"], activeWorld: "empty_snowfield",
    isPro: false, proPlan: null, proRenewsAt: null, proSource: null,
    streakChallenge: { actionsPerDay: 3, daysRequired: 7, reward: 18, progress: [{ date: day(-4), count: 3 }, { date: day(-3), count: 3 }, { date: day(-2), count: 4 }, { date: day(-1), count: 3 }, { date: day(0), count: 2 }], active: true },
    lastLoginDate: day(0), loginDates: Array.from({ length: 12 }, (_, i) => day(-i)).reverse(),
    streakFreezes: 1, frozenDays: [day(-6)], restDays: [], lastFreeGrant: day(-6),
    notifPrefs: { daily: true, streakReminders: true, achievements: true, milestones: true },
    notifTime: "19:00", savedSeasons: [],
    accountPromptDone: true, reviewAsked: true, widgetPromptDone: true, language: "en",
  };
  return { onboarded: true, walkthroughDone: true, levelWalkthroughDone: true, screen, data };
};

// `screen` always initialises to "home" (App.jsx:12173), so the persisted
// value can't drive navigation — each shot clicks its way there instead.
const SHOTS = [
  { name: "home", taps: [] },
  { name: "store", taps: ["Store"] },
  { name: "profile", taps: ["Profile"] },
  // Profile has two "See all" buttons (goals → home, achievements →
  // trophy shelf), so reach the shelf via a completed-goal wallet card.
  // The wallet strip shows only the 3 most recent cards, newest first.
  { name: "achievements", taps: ["Profile", { label: "Cook 20 meals", exact: false }] },
];

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

// Click the smallest visible element whose text matches `label`.
// `exact` guards against picking a parent that merely contains the string.
const tap = async (page, label, exact = true) => {
  const ok = await page.evaluate(({ text, exact }) => {
    const els = [...document.querySelectorAll("button, [role=button], a, div, span")];
    const hits = els.filter((el) => {
      const t = (el.innerText || "").trim();
      const match = exact
        ? t.toLowerCase() === text.toLowerCase()
        : t.toLowerCase().includes(text.toLowerCase());
      if (!match) return false;
      const r = el.getBoundingClientRect();
      return r.width > 0 && r.height > 0;
    });
    if (!hits.length) return false;
    hits.sort((a, b) => {
      const ra = a.getBoundingClientRect(), rb = b.getBoundingClientRect();
      return ra.width * ra.height - rb.width * rb.height;
    });
    hits[0].click();
    return true;
  }, { text: label, exact });
  if (!ok) console.warn(`  ! could not find "${label}"`);
  await sleep(1400);
  return ok;
};

const browser = await puppeteer.launch({
  executablePath: CHROME,
  headless: "new",
  defaultViewport: { width: 393, height: 852, deviceScaleFactor: 3, isMobile: true, hasTouch: true },
  args: ["--hide-scrollbars", "--force-color-profile=srgb", "--font-render-hinting=none"],
});

const page = await browser.newPage();
// Seed before any app code runs on the target origin.
await page.goto(URL, { waitUntil: "domcontentloaded" });

for (const shot of SHOTS) {
  const snap = buildSnapshot("home");
  await page.evaluate((s) => {
    localStorage.setItem("pebble.app.v1", JSON.stringify(s));
    localStorage.setItem("pebble.resetToken", "2026-07-22-replay");
    // Stop the dying page's debounced persist from clobbering the seed.
    const orig = Storage.prototype.setItem;
    Storage.prototype.setItem = function (k) { if (k === "pebble.app.v1") return; return orig.apply(this, arguments); };
  }, snap);
  await page.reload({ waitUntil: "networkidle2" });
  // Splash + greeting typewriter + reveal animations need to settle.
  await sleep(6000);
  for (const step of shot.taps) {
    const { label, exact } = typeof step === "string" ? { label: step, exact: true } : step;
    await tap(page, label, exact);
  }
  // The DEV-only "Switch to Pro" toggle isn't part of the shipped app —
  // keep it out of marketing shots.
  await page.evaluate(() => {
    // Smallest match only — every ancestor "contains" the string too, and
    // hiding one of those blanks the whole screen.
    const hits = [...document.querySelectorAll("button, div")]
      .filter((el) => (el.innerText || "").includes("DEV ·"));
    if (!hits.length) return;
    hits.sort((a, b) => (a.innerText || "").length - (b.innerText || "").length);
    hits[0].style.visibility = "hidden";
  });
  await sleep(1200);
  const file = path.join(OUT, `${shot.name}.png`);
  await page.screenshot({ path: file });
  console.log("saved", file);
}

await browser.close();
console.log("done");

// Then shrink to the 640px-wide WebP + PNG pair the site actually loads:
//
//   python3 - <<'PY'
//   from PIL import Image
//   for n in ["home", "store", "achievements", "profile"]:
//       im = Image.open(f"assets/screens/{n}.png").convert("RGB")
//       im = im.resize((640, round(im.height * 640 / im.width)), Image.LANCZOS)
//       im.save(f"assets/screens/{n}.webp", "WEBP", quality=82, method=6)
//       im.convert("P", palette=Image.ADAPTIVE, colors=256).save(
//           f"assets/screens/{n}.png", optimize=True)
//   PY
