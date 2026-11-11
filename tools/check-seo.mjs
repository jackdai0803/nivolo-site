// node tools/check-seo.mjs [--live]
// Checks source metadata and routing without sending signups. --live also
// checks public responses using curl and the Mac's trusted certificates.
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { runInNewContext } from 'node:vm';
import test from 'node:test';

const read = (path) => readFileSync(new URL('../' + path, import.meta.url), 'utf8');
const pages = [['index.html', '/'], ['launch.html', '/launch'], ['support.html', '/support'], ['privacy.html', '/privacy']];
const meta = (html, name) => html.match(new RegExp(`<meta (?:name|property)="${name}" content="([^"]+)"`))?.[1];

function checkPage(html, path) {
  const canonical = 'https://nivolo.app' + path;
  assert.ok(html.includes(`<link rel="canonical" href="${canonical}"`), path + ': canonical');
  assert.equal(meta(html, 'og:url'), canonical);
  assert.equal(meta(html, 'og:title'), html.match(/<title>(.*?)<\/title>/)?.[1]);
  assert.equal(meta(html, 'twitter:title'), meta(html, 'og:title'));
  assert.equal(meta(html, 'description'), meta(html, 'og:description'));
  assert.equal(meta(html, 'description'), meta(html, 'twitter:description'));
  assert.ok(meta(html, 'description')?.length > 50);
  assert.equal(meta(html, 'og:image'), 'https://nivolo.app/assets/og-image-nivo.png');
  assert.equal(meta(html, 'twitter:image'), meta(html, 'og:image'));
  assert.equal(meta(html, 'robots'), 'index, follow, max-image-preview:large');
  assert.equal((html.match(/<h1\b/g) || []).length, 1, 'one main page heading');
  assert.doesNotMatch(html, /href="\/?(?:index|launch|support|privacy)\.html(?:["?#])/);
  for (const block of html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)) JSON.parse(block[1]);
}

test('every public page has consistent, distinct search metadata and direct links', () => {
  const titles = new Set();
  const descriptions = new Set();
  for (const [file, path] of pages) {
    const html = read(file);
    checkPage(html, path);
    titles.add(meta(html, 'og:title'));
    descriptions.add(meta(html, 'description'));
  }
  assert.equal(titles.size, pages.length);
  assert.equal(descriptions.size, pages.length);
});

test('sitemap lists exactly the preferred public pages; crawlers can reach it', () => {
  const urls = [...read('sitemap.xml').matchAll(/<loc>(.*?)<\/loc>/g)].map((match) => match[1]);
  assert.deepEqual(urls.sort(), pages.map(([, path]) => 'https://nivolo.app' + path).sort());
  assert.match(read('robots.txt'), /Allow: \/\s/);
  assert.match(read('robots.txt'), /Sitemap: https:\/\/nivolo.app\/sitemap.xml/);
  assert.equal(meta(read('404.html'), 'robots'), 'noindex');
});

test('site and app identities are linked without invented ratings or a download URL', () => {
  const html = read('index.html');
  const { '@graph': graph } = JSON.parse(html.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/)[1]);
  const site = graph.find((item) => item['@type'] === 'WebSite');
  const app = graph.find((item) => item['@type'] === 'SoftwareApplication');
  const organization = graph.find((item) => item['@type'] === 'Organization');
  assert.equal(site.name, 'Nivolo');
  assert.equal(site.url, 'https://nivolo.app/');
  assert.equal(app.publisher['@id'], organization['@id']);
  assert.equal(app.description, meta(html, 'description'));
  assert.equal(app.operatingSystem, 'iOS');
  assert.equal(app.inLanguage.length, 14);
  assert.equal(app.aggregateRating, undefined);
  assert.equal(app.review, undefined);
  assert.equal(app.downloadUrl, undefined);
});

const worker = runInNewContext(read('worker/index.js').replace('export default {', 'globalThis.worker = {'), { Request, Response, URL });
const env = { ASSETS: { fetch: async () => new Response('asset') } };

test('www and HTTP converge on HTTPS and preserve queries and POST bodies via 308', async () => {
  for (const [url, target, method] of [
    ['https://www.nivolo.app/', 'https://nivolo.app/', 'GET'],
    ['http://nivolo.app/support?lang=zh', 'https://nivolo.app/support?lang=zh', 'HEAD'],
    ['http://www.nivolo.app/privacy', 'https://nivolo.app/privacy', 'GET'],
    ['https://www.nivolo.app/api/launch-alert', 'https://nivolo.app/api/launch-alert', 'POST'],
  ]) {
    const response = await worker.fetch(new Request(url, { method, ...(method === 'POST' ? { body: 'test-only' } : {}) }), env, {});
    assert.equal(response.status, 308);
    assert.equal(response.headers.get('Location'), target);
  }
});

test('canonical, local and private preview origins do not redirect', async () => {
  for (const origin of ['https://nivolo.app', 'http://localhost:5173', 'https://preview.example.test']) {
    const response = await worker.fetch(new Request(origin + '/support'), env, {});
    assert.equal(response.status, 200);
    assert.equal(await response.text(), 'asset');
  }
});

test('page aliases use permanent single-hop redirects, including www and query strings', async () => {
  for (const [alias, target] of [
    ['/index.html', '/'], ['/index', '/'], ['/index/', '/'],
    ['/launch.html', '/launch'], ['/launch/', '/launch'],
    ['/support.html', '/support'], ['/support/', '/support'],
    ['/privacy.html', '/privacy'], ['/privacy/', '/privacy'],
  ]) {
    const response = await worker.fetch(new Request('http://www.nivolo.app' + alias + '?lang=zh'), env, {});
    assert.equal(response.status, 308);
    assert.equal(response.headers.get('Location'), 'https://nivolo.app' + target + '?lang=zh');
  }
});

test('maintenance keeps a retryable 503 and retired founders links keep their target', async () => {
  const offline = await worker.fetch(new Request('https://nivolo.app/'), { ...env, SITE_OFFLINE: 'true' }, {});
  assert.equal(offline.status, 503);
  assert.equal(offline.headers.get('Retry-After'), '3600');
  const founders = await worker.fetch(new Request('https://nivolo.app/founders.html?lang=zh'), env, {});
  assert.equal(founders.status, 301);
  assert.equal(founders.headers.get('Location'), 'https://nivolo.app/?lang=zh#founders');
});

if (process.argv.includes('--live')) {
  const fetchPublic = (path) => {
    const result = execFileSync('curl', ['--silent', '--show-error', '--max-time', '30', '--include', path], { encoding: 'utf8', maxBuffer: 2 ** 22 });
    // Some environments add a proxy's CONNECT header before the actual response.
    const split = result.split(/\r?\n\r?\n/);
    while (/^HTTP\/[^\n]+200 Connection established/i.test(split[0])) split.shift();
    return { headers: split.shift(), body: split.join('\n\n') };
  };
  test('live pages, sitemap, redirects, preview image and 404 match the release', () => {
    for (const [file, path] of pages) {
      const { headers, body } = fetchPublic('https://nivolo.app' + path);
      assert.match(headers, /^HTTP\/\S+ 200/);
      assert.doesNotMatch(headers, /x-robots-tag:[^\n]*noindex/i);
      checkPage(body, path);
      assert.equal(meta(body, 'description'), meta(read(file), 'description'));
      if (path === '/') assert.ok(body.includes(read(file).match(/<!-- Nivolo release: .*? -->/)[0]));
    }
    for (const path of ['/robots.txt', '/sitemap.xml']) {
      const { headers, body } = fetchPublic('https://nivolo.app' + path);
      assert.match(headers, /^HTTP\/\S+ 200/);
      assert.equal(body.trim(), read(path.slice(1)).trim());
    }
    for (const [url, target] of [
      ['https://www.nivolo.app/?lang=zh', 'https://nivolo.app/?lang=zh'],
      ...pages.map(([file, path]) => ['https://nivolo.app/' + file, 'https://nivolo.app' + path]),
    ]) {
      const { headers } = fetchPublic(url);
      assert.match(headers, /^HTTP\/\S+ 30[18]/);
      const location = headers.match(/\nlocation: ([^\r\n]+)/i)?.[1];
      assert.equal(new URL(location, url).href, target);
    }
    assert.match(fetchPublic('https://nivolo.app/assets/og-image-nivo.png').headers, /^HTTP\/\S+ 200/);
    assert.match(fetchPublic('https://nivolo.app/seo-check-nonexistent').headers, /^HTTP\/\S+ 404/);
  });
}
