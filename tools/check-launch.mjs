// Run with node tools/check-launch.mjs. No requests leave this test process.
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { runInNewContext } from 'node:vm';
import test from 'node:test';

const read = (path) => readFileSync(new URL('../' + path, import.meta.url), 'utf8');
const source = read('assets/launch.js');
const ok = () => ({ ok: true, status: 200, json: async () => ({ ok: true }) });

// Only the DOM surfaces used by the form. This lets failures, delayed
// replies and clipboard denial run without touching real signup records.
function formFixture({ online = true, fetch = async () => ok(), search = '', lang = 'en', clipboard } = {}) {
  let focused;
  let copied;
  const timers = new Map();
  const elements = Object.fromEntries([
    'launchForm', 'launchEmail', 'launchCompany', 'launchSubmit', 'launchStatus',
    'launchSuccess', 'launchHelp', 'launchSavedEmail', 'launchEdit', 'launchRemoval',
    'launchCopy', 'launchCopyStatus',
  ].map((id) => [id, {
    hidden: ['launchSuccess', 'launchHelp', 'launchSavedEmail', 'launchEdit', 'launchRemoval'].includes(id),
    textContent: '', value: '', disabled: false, attributes: {}, listeners: {},
    addEventListener(event, callback) { this.listeners[event] = callback; },
    setAttribute(name, value) { this.attributes[name] = value; },
    removeAttribute(name) { delete this.attributes[name]; },
    focus() { focused = id; }, select() { this.selected = true; },
    reportValidity() { return true; },
    querySelector() { return this.label ||= { textContent: '' }; },
  }]));
  elements.launchForm.action = 'https://example.test/api/launch-alert';
  elements.launchEmail.value = 'Alex@example.com';
  const labels = ['join', 'help', 'copy', 'back', 'another', 'remove'].map((key) => ({ dataset: { launchCopy: key } }));
  runInNewContext(source, {
    document: { getElementById: (id) => elements[id], documentElement: { lang }, querySelectorAll: () => labels },
    navigator: { onLine: online, clipboard: { writeText: clipboard || (async (value) => { copied = value; }) } },
    window: { location: { search, pathname: '/launch.html' } },
    history: { replaceState() {} }, fetch, AbortController, URLSearchParams, TypeError,
    setTimeout(callback, ms) { timers.set(callback, ms); return callback; },
    clearTimeout(id) { timers.delete(id); },
  });
  return {
    elements, labels, timers, focused: () => focused, copied: () => copied,
    submit: () => elements.launchForm.listeners.submit({ preventDefault() {} }),
    click: (id) => elements[id].listeners.click(),
  };
}

test('offline skips requests and preserves the typed address', async () => {
  let calls = 0;
  const f = formFixture({ online: false, fetch: () => { calls++; } });
  await f.submit();
  assert.equal(calls, 0);
  assert.equal(f.elements.launchEmail.value, 'Alex@example.com');
  assert.match(f.elements.launchStatus.textContent, /offline/);
  assert.equal(f.elements.launchHelp.hidden, false);
  assert.equal(f.elements.launchSubmit.disabled, false);
});

for (const [name, response, message] of [
  ['network failure', async () => { throw new TypeError('Failed to fetch'); }, /couldn’t connect/],
  ['HTML instead of JSON', async () => ({ ok: false, status: 503, json: async () => { throw new SyntaxError(); } }), /couldn’t confirm/],
  ['rate limit without JSON', async () => ({ ok: false, status: 429 }), /in a minute/],
  ['invalid address', async () => ({ ok: false, status: 400, json: async () => ({ error: 'invalid_email' }) }), /check your email/],
  ['server error', async () => ({ ok: false, status: 500, json: async () => ({ error: 'failed' }) }), /couldn’t confirm/],
  ['malformed success', async () => ({ ok: true, status: 200, json: async () => null }), /couldn’t confirm/],
]) {
  test(name + ' restores a usable form', async () => {
    const f = formFixture({ fetch: response });
    await f.submit();
    assert.match(f.elements.launchStatus.textContent, message);
    assert.equal(f.elements.launchEmail.value, 'Alex@example.com');
    assert.equal(f.elements.launchSuccess.hidden, true);
    assert.equal(f.elements.launchHelp.hidden, false);
    assert.equal(f.elements.launchSubmit.disabled, false);
    assert.equal(f.elements.launchSubmit.label.textContent, 'Join the launch list');
    assert.equal(f.focused(), 'launchEmail');
    assert.equal(f.timers.size, 0);
  });
}

test('a stalled request times out and allows another attempt', async () => {
  const f = formFixture({ fetch: (_url, options) => new Promise((_resolve, reject) => {
    options.signal.addEventListener('abort', () => reject(new DOMException('Timed out', 'AbortError')));
  }) });
  const pending = f.submit();
  const timeout = [...f.timers].find(([, ms]) => ms === 12000);
  assert.ok(timeout);
  timeout[0]();
  await pending;
  assert.equal(f.elements.launchSubmit.disabled, false);
  assert.equal(f.elements.launchForm.attributes['aria-busy'], undefined);
  assert.match(f.elements.launchStatus.textContent, /couldn’t confirm/);
});

test('success confirms the submitted address, blocks duplicates and permits another signup', async () => {
  let resolve;
  let calls = 0;
  let payload;
  const f = formFixture({ fetch: (_url, options) => {
    calls++;
    payload = JSON.parse(options.body);
    return new Promise((done) => { resolve = done; });
  } });
  f.elements.launchEmail.value = 'Alex$&@example.com';
  const pending = f.submit();
  await f.submit();
  f.elements.launchEmail.value = 'edited@example.com';
  assert.equal(calls, 1);
  assert.equal(f.elements.launchSubmit.disabled, true);
  resolve(ok());
  await pending;
  assert.equal(payload.email, 'alex$&@example.com');
  assert.equal(f.elements.launchSavedEmail.textContent, 'We’ll write to alex$&@example.com.');
  assert.equal(f.elements.launchForm.hidden, true);
  assert.equal(f.focused(), 'launchSuccess');
  assert.equal(f.elements.launchRemoval.hidden, false);
  f.click('launchEdit');
  assert.equal(f.elements.launchForm.hidden, false);
  assert.equal(f.elements.launchSuccess.hidden, true);
  assert.equal(f.focused(), 'launchEmail');
  assert.equal(f.elements.launchEmail.selected, true);
});

test('redirect success has no invented email; busy redirect does not claim to retain it', () => {
  const f = formFixture({ search: '?joined=1' });
  assert.equal(f.elements.launchSuccess.hidden, false);
  assert.equal(f.elements.launchSavedEmail.hidden, true);
  const busy = formFixture({ search: '?error=busy' });
  assert.doesNotMatch(busy.elements.launchStatus.textContent, /still in the box/);
});

test('copy reports success for two seconds and handles permission denial', async () => {
  const f = formFixture();
  await f.click('launchCopy');
  assert.equal(f.copied(), 'support@nivolo.app');
  assert.equal(f.elements.launchCopy.textContent, 'Copied');
  [...f.timers].find(([, ms]) => ms === 2000)[0]();
  assert.equal(f.elements.launchCopy.textContent, 'Copy address');
  const denied = formFixture({ clipboard: async () => { throw new Error('denied'); } });
  await denied.click('launchCopy');
  assert.match(denied.elements.launchCopyStatus.textContent, /select and copy/);
});

test('new interface copy has a Chinese path', async () => {
  const f = formFixture({ online: false, lang: 'zh-Hans' });
  await f.submit();
  assert.equal(f.labels[0].textContent, '加入上线通知名单');
  assert.match(f.elements.launchStatus.textContent, /离线/);
});

test('all HTML launch CTAs are links before scripts load; store enhancement retains them', () => {
  for (const file of ['index.html', 'support.html', 'privacy.html', '404.html']) {
    const html = read(file);
    const tags = [...html.matchAll(/<([a-z]+)\b[^>]*\bdata-store\b[^>]*>/g)];
    assert.ok(tags.length);
    for (const tag of tags) {
      assert.equal(tag[1], 'a');
      assert.match(tag[0], new RegExp('href="' + (file === '404.html' ? '/' : '') + 'launch.html"'));
    }
    assert.ok([...html.matchAll(/data-soon="([^"]+)"/g)].every((m) => m[1] === 'Join the launch list'));
  }
  const label = { getAttribute: (name) => name === 'data-live' ? 'Get the app' : 'Join the launch list' };
  const link = {
    href: '/launch.html', classList: { remove() {} },
    getAttribute: () => '/launch.html',
    querySelector: () => label,
  };
  const document = { querySelectorAll: () => [link] };
  runInNewContext(read('assets/store.js'), { document });
  assert.equal(link.href, '/launch.html');
  assert.equal(label.textContent, 'Join the launch list');
  const live = read('assets/store.js').replace('var APP_STORE_URL = "";', 'var APP_STORE_URL = "https://apps.apple.com/app/test";');
  runInNewContext(live, { document });
  assert.equal(link.href, 'https://apps.apple.com/app/test');
  assert.equal(label.textContent, 'Get the app');
});
