# Google Search maintenance

Public pages use `https://nivolo.app/`, `/launch`, `/support`, and `/privacy`.
Cloudflare redirects their `.html` aliases; the Worker permanently redirects
the public `www` and HTTP variants while preserving query strings and form methods.
Keep canonical tags, social URLs, internal links and `sitemap.xml` aligned.

After a significant page content, link or structured-data change, update that
page's sitemap `lastmod` to the actual change date. Do not advance every date
on an unrelated deployment. Add new public pages to the sitemap and link them
from a relevant existing page. Keep private previews and error pages out.

Run `node tools/check-seo.mjs` and `node tools/check-launch.mjs` before release;
run `node tools/check-seo.mjs --live` from the release checkout after deployment.
Follow `CLAUDE.md` for preview, commit, push and production deployment.

The homepage describes the site, publisher and iPhone app using JSON-LD. Keep
features, languages and prices consistent with the visible page. No ratings,
reviews or App Store download URL are asserted. Add these only when genuine,
visible and verified. Software-app rich results require Google's additional
eligibility fields; the existing markup does not guarantee stars or a rich result.

The public pages are English. Some interactive components also have Chinese
copy, but this is not a complete translated website. Do not advertise a Chinese
`hreflang` alternate until its page is fully translated and independently crawlable.

In the owner's Google Search Console property for `https://nivolo.app/`, submit
`https://nivolo.app/sitemap.xml` and inspect the homepage to request indexing.
Review indexing and search queries there after Google recrawls; a public search
or a successful HTTP response alone cannot confirm Google's indexing status.

References: [Google's SEO guide](https://developers.google.com/search/docs/fundamentals/seo-starter-guide),
[canonical URLs](https://developers.google.com/search/docs/crawling-indexing/consolidate-duplicate-urls),
[sitemaps](https://developers.google.com/search/docs/crawling-indexing/sitemaps/build-sitemap),
[site names](https://developers.google.com/search/docs/appearance/site-names),
[software apps](https://developers.google.com/search/docs/appearance/structured-data/software-app).
