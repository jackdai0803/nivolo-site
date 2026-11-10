// Build the site for deploy: a copy in dist/ with the CSS and JS minified.
//
//   node tools/build.mjs            from the latest commit (what is safe to publish)
//   node tools/build.mjs --working  from the files as they are on disk right now
//   node tools/build.mjs <rev>      from a specific commit
//
// The files you edit — styles.css, assets/*.js — stay exactly as written.
// Only the copies in dist/ are minified, and they keep the same names, so
// the pages in dist/ already point at them: nothing in the HTML changes.
// dist/ is not committed.
//
// Needs Node 18+. esbuild does the minifying and is fetched by npx on
// first use.
import { execFileSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";

const root = execFileSync("git", ["rev-parse", "--show-toplevel"], { encoding: "utf8" }).trim();
process.chdir(root);

// Everything the public site is made of, and nothing else: notes, tools
// and config never reach dist/.
const PUBLISH = [
  "index.html", "launch.html", "privacy.html", "support.html", "404.html",
  "styles.css", "assets",
  "robots.txt", "sitemap.xml", "favicon.ico", "site.webmanifest", "CNAME",
];
// Already minified by its author; minifying it again only risks it.
const LEAVE = new Set(["assets/vendor/matter.min.js"]);

const arg = process.argv[2];
const dist = path.join(root, "dist");
fs.rmSync(dist, { recursive: true, force: true });
fs.mkdirSync(dist);

if (arg === "--working") {
  for (const p of PUBLISH) if (fs.existsSync(p)) fs.cpSync(p, path.join(dist, p), { recursive: true });
} else {
  const rev = arg || "HEAD";
  const have = PUBLISH.filter((p) => {
    try { execFileSync("git", ["cat-file", "-e", `${rev}:${p}`], { stdio: "ignore" }); return true; } catch { return false; }
  });
  const tar = execFileSync("git", ["archive", rev, ...have], { maxBuffer: 1 << 28 });
  execFileSync("tar", ["-x", "-C", dist], { input: tar });
}

const files = [];
(function walk(dir) {
  for (const name of fs.readdirSync(dir)) {
    const full = path.join(dir, name);
    if (fs.statSync(full).isDirectory()) walk(full);
    else if (/\.(css|js)$/.test(name) && !LEAVE.has(path.relative(dist, full))) files.push(full);
  }
})(dist);

let before = 0, after = 0;
for (const file of files) {
  const was = fs.statSync(file).size;
  // No bundling and no renaming of top-level names: these are plain
  // scripts that share globals (Matter, APP_STORE_URL, __nivolo).
  execFileSync("npx", ["--yes", "esbuild@0.25", file, "--minify", "--allow-overwrite", `--outfile=${file}`, "--log-level=warning"], { stdio: "inherit" });
  const now = fs.statSync(file).size;
  before += was; after += now;
  console.log(`${path.relative(dist, file).padEnd(26)} ${(was / 1024).toFixed(1).padStart(6)} KB → ${(now / 1024).toFixed(1).padStart(6)} KB`);
}
console.log(`${"total".padEnd(26)} ${(before / 1024).toFixed(1).padStart(6)} KB → ${(after / 1024).toFixed(1).padStart(6)} KB  (${Math.round((1 - after / before) * 100)}% smaller before compression)`);
console.log(`dist/ is ready (${arg === "--working" ? "from the working files" : "from " + (arg || "HEAD")}).`);
