# nivolo.app site

Static site for nivolo.app, served by Cloudflare (wrangler.jsonc).

## Workflow

- **Commit straight to `main` and push** (Jack's standing instruction) —
  no feature branches, no PRs. Jack then deploys from his Mac with
  `tools/deploy.sh` (it publishes what is COMMITTED, builds `dist/`
  with `tools/build.mjs`, and runs `wrangler deploy`). Cloud sessions
  deliberately have no Cloudflare token, so don't try to deploy from
  one: push `main` and remind Jack to run the deploy.
- Bump the `?v=` query on a stylesheet's `<link>` tags in every HTML
  page whenever that stylesheet changes, or visitors keep the cached
  one.
- The phone frames: `assets/iphone16-frame.svg` is the chassis (Xcode
  iPhone 16 Pro Max proportions, screen punched out) and
  `assets/device-iphone16-screen-mask.svg` is the real framebuffer
  contour that clips the screenshot. `.phone` in styles.css ties them
  together; wrap a screenshot in `<span class="phone">` to frame it.
- Corners use `corner-shape: superellipse(2)` on all UI, including
  navigation, buttons, pills and badges. Only true circles, illustration
  shapes and particles opt into `corner-shape: round`. The frost canvas
  uses the same fourth-power formula; regenerate the phone chassis with
  `node tools/generate-phone-frame.mjs` after changing its geometry.
