#!/bin/sh
# Publish the site to Cloudflare (nivolo.app).
#
# It publishes what is COMMITTED, not what is sitting in the folder, so
# half-finished edits never go live. Only the paths listed in
# tools/build.mjs are sent; notes, tools and config stay out of the site.
#
#   tools/deploy.sh          publish the latest commit
#   tools/deploy.sh <rev>    publish a specific commit
set -e
cd "$(git rev-parse --show-toplevel)"

REV="${1:-HEAD}"

# tools/build.mjs owns the list of public files and minifies the CSS and JS
# in dist/ (the sources stay as written).
node tools/build.mjs "$REV"

# Reuse the wrangler the app's AI backend already has installed; fall back
# to fetching it if that folder ever moves.
WRANGLER="/Users/jackdai/pebble-app/worker/node_modules/.bin/wrangler"
[ -x "$WRANGLER" ] || WRANGLER="npx --yes wrangler@4"

$WRANGLER deploy
echo "Published $(git rev-parse --short "$REV") to nivolo.app"
