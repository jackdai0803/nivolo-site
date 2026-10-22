# nivolo.app site

Static site for nivolo.app, served by Cloudflare (wrangler.jsonc).

## Workflow

- **Always take changes live** (Jack's standing instruction): commit
  straight to `main`, push, then run `tools/deploy.sh` — it publishes
  what is COMMITTED, builds `dist/` with `tools/build.mjs`, and runs
  `wrangler deploy`. In an environment without `CLOUDFLARE_API_TOKEN`,
  wrangler cannot authenticate: still push `main`, then say the deploy
  itself is pending.
- Bump the `?v=` query on a stylesheet's `<link>` tags in every HTML
  page whenever that stylesheet changes, or visitors keep the cached
  one.
- The phone frames: `assets/iphone16-frame.svg` is the chassis (Xcode
  iPhone 16 Pro Max proportions, screen punched out) and
  `assets/device-iphone16-screen-mask.svg` is the real framebuffer
  contour that clips the screenshot. `.phone` in styles.css ties them
  together; wrap a screenshot in `<span class="phone">` to frame it.
- Corners follow the app: squircle (`corner-shape`) everywhere, with
  `corner-shape: round` written next to any pill/circle/organic
  `border-radius`.
