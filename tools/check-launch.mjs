// Run with node tools/check-launch.mjs. No requests leave this test process.
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { runInNewContext } from 'node:vm';
import test from 'node:test';
import { webcrypto } from 'node:crypto';

const read = (path) => readFileSync(new URL('../' + path, import.meta.url), 'utf8');
const source = read('assets/launch.js');
const ok = () => ({ ok: true, status: 200, json: async () => ({ ok: true }) });

// Only the DOM surfaces used by the form. This lets failures, delayed
// replies and clipboard denial run without touching real signup records.
function formFixture({ online = true, fetch = async () => ok(), search = '', lang = 'en', clipboard, valid = true, reduced = false } = {}) {
  let focused;
  let copied;
  const animations = [];
  const timers = new Map();
  const elements = Object.fromEntries([
    'launchForm', 'launchEmail', 'launchCompany', 'launchStarted', 'launchSubmit', 'launchStatus',
    'launchSuccess', 'launchHelp', 'launchSavedEmail', 'launchEdit', 'launchRemoval',
    'launchCopy', 'launchCopyStatus', 'launchCard', 'launchIntro', 'launchArtNote', 'launchReceipt',
  ].map((id) => [id, {
    hidden: ['launchSuccess', 'launchHelp', 'launchSavedEmail', 'launchEdit', 'launchRemoval'].includes(id),
    classList: { add() {}, remove() {} }, textContent: '', value: '', disabled: false, attributes: {}, listeners: {},
    addEventListener(event, callback) { this.listeners[event] = callback; },
    setAttribute(name, value) { this.attributes[name] = value; },
    removeAttribute(name) { delete this.attributes[name]; },
    getBoundingClientRect() { return { top: 0 }; },
    focus() { focused = id; }, select() { this.selected = true; },
    checkValidity() { return valid; },
    animate(frames, options) { animations.push({ id, frames, options }); },
    querySelector() { return this.label ||= { textContent: '' }; },
  }]));
  elements.launchSuccess.querySelector = () => ({ animate(frames, options) { animations.push({ id: 'art', frames, options }); } });
  elements.launchForm.action = 'https://example.test/api/launch-alert';
  elements.launchEmail.value = 'Alex@example.com';
  const labels = ['join', 'help', 'copy', 'back', 'another', 'remove'].map((key) => ({ dataset: { launchCopy: key } }));
  runInNewContext(source, {
    document: { getElementById: (id) => elements[id], documentElement: { lang }, querySelectorAll: () => labels },
    navigator: { onLine: online, clipboard: { writeText: clipboard || (async (value) => { copied = value; }) } },
    window: { location: { search, pathname: '/launch.html' }, matchMedia: () => ({ matches: reduced }) },
    history: { replaceState() {} }, fetch, AbortController, URLSearchParams, TypeError,
    setTimeout(callback, ms) { timers.set(callback, ms); return callback; },
    clearTimeout(id) { timers.delete(id); },
  });
  return {
    elements, labels, timers, animations, focused: () => focused, copied: () => copied,
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
  assert.equal(payload.started, Number(f.elements.launchStarted.value));
  assert.ok(Number.isFinite(payload.started) && payload.started > 0);
  assert.equal(f.elements.launchSavedEmail.textContent, 'alex$&@example.com');
  assert.equal(f.elements.launchForm.hidden, true);
  assert.equal(f.elements.launchIntro.hidden, true);
  assert.equal(f.elements.launchReceipt.hidden, false);
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
  assert.equal(f.elements.launchReceipt.hidden, true);
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


test('invalid email is explained inline without making a signup request', async () => {
  let calls = 0;
  const f = formFixture({ valid: false, fetch: async () => { calls++; return ok(); } });
  await f.submit();
  assert.equal(calls, 0);
  assert.equal(f.elements.launchEmail.attributes['aria-invalid'], 'true');
  assert.match(f.elements.launchStatus.textContent, /looks incomplete/);
  assert.equal(f.focused(), 'launchEmail');
  assert.equal(f.elements.launchForm.noValidate, true);
});

test('success moves focus and only animates a fresh signup with motion enabled', async () => {
  const normal = formFixture();
  await normal.submit();
  assert.equal(normal.focused(), 'launchSuccess');
  assert.equal(normal.animations.length, 2);
  const reduced = formFixture({ reduced: true });
  await reduced.submit();
  assert.equal(reduced.animations.length, 0);
  assert.equal(reduced.elements.launchSuccess.hidden, false);
  const redirected = formFixture({ search: '?joined=1' });
  assert.equal(redirected.animations.length, 0);
});

// Exercise the real Worker with in-memory KV and email mocks only.
function workerFixture({ welcomeFails = false, notifyFails = false, limiterAllows = true, welcomeEnabled = true } = {}) {
  const now = Date.parse('2026-11-04T12:30:00Z');
  class Clock extends Date {
    constructor(...args) { super(...(args.length ? args : [now])); }
    static now() { return now; }
  }
  const records = new Map();
  const writes = [];
  const emails = [];
  const errors = [];
  const pending = [];
  const limits = [];
  const worker = runInNewContext(read('worker/index.js').replace('export default {', 'globalThis.worker = {'), {
    Request, Response, URL, TextEncoder, crypto: webcrypto, btoa, Date: Clock,
    console: { error: (...args) => errors.push(args) },
  });
  const env = {
    LAUNCH_SIGNUPS: {
      async get(key) { return records.get(key) ?? null; },
      async put(key, value, options) { records.set(key, value); writes.push({ key, value, options }); },
    },
    SIGNUP_LIMITER: { async limit({ key }) { limits.push(key); return { success: limiterAllows }; } },
    NOTIFY_SIGNUP: { async send(message) {
      emails.push({ kind: 'owner', ...message });
      if (notifyFails) throw Object.assign(new Error('Mock owner failure'), { code: 'MOCK_NOTIFY' });
    } },
    ...(welcomeEnabled ? { WELCOME_EMAIL: { async send(message) {
      emails.push({ kind: 'welcome', ...message });
      if (welcomeFails) throw Object.assign(new Error('Mock welcome failure'), { code: 'MOCK_WELCOME' });
    } } } : {}),
  };
  return {
    now, records, writes, emails, errors, limits,
    async signup(body = {}, { form = false, ip = '192.0.2.1' } = {}) {
      const payload = { email: 'Alex@example.com', company: '', started: now - 3000, ...body };
      return worker.fetch(new Request('https://example.test/api/launch-alert', {
        method: 'POST',
        headers: { 'Content-Type': form ? 'application/x-www-form-urlencoded' : 'application/json', 'CF-Connecting-IP': ip },
        body: form ? new URLSearchParams(payload) : JSON.stringify(payload),
      }), env, { waitUntil(promise) { pending.push(promise); } });
    },
    async drain() { await Promise.all(pending); },
  };
}

const expectedWelcome = `Hi there,

Thanks for joining the Nivolo launch list! Nivolo is a habit app with a penguin buddy named Nivo, and we're still building it. We'll let you know as soon as it's ready to try.

Quick question: how did you hear about Nivolo? And what's one habit you're hoping to stick with? Just hit reply, we read every message.

Thanks,
The Nivolo team`;

test('Worker: normal signup saves, notifies owner, then sends the exact welcome and marks it', async () => {
  const f = workerFixture();
  const response = await f.signup({ started: f.now - 2000 });
  assert.equal(response.status, 200);
  assert.deepEqual(await response.json(), { ok: true });
  await f.drain();
  const signup = f.writes.find(({ key }) => key.startsWith('signup:'));
  assert.equal(JSON.parse(signup.value).email, 'alex@example.com');
  assert.deepEqual(f.emails.map(({ kind }) => kind), ['owner', 'welcome']);
  assert.deepEqual(JSON.parse(JSON.stringify(f.emails[1])), {
    kind: 'welcome', from: { email: 'support@nivolo.app', name: 'Nivolo Support' },
    replyTo: 'support@nivolo.app', to: 'alex@example.com', subject: 'Welcome to Nivolo 🐧', text: expectedWelcome,
  });
  assert.equal(f.records.get(signup.key.replace('signup:', 'welcome:')), new Date(f.now).toISOString());
});

for (const form of [false, true]) {
  test(`Worker: honeypot silently succeeds without saves or email (${form ? 'form' : 'JSON'})`, async () => {
    const f = workerFixture();
    const response = await f.signup({ company: 'bot', started: 'invalid', email: 'invalid' }, { form });
    assert.equal(response.status, form ? 303 : 200);
    if (form) assert.match(response.headers.get('Location'), /joined=1$/);
    else assert.deepEqual(await response.json(), { ok: true });
    await f.drain();
    assert.equal(f.writes.length, 0);
    assert.equal(f.emails.length, 0);
  });

  test(`Worker: rejects fast/non-finite starts and invalid emails (${form ? 'form' : 'JSON'})`, async () => {
    for (const body of [{ started: Date.parse('2026-11-04T12:30:00Z') - 1999 }, { started: 'invalid' }, { started: 'Infinity' }, { email: 'invalid' }]) {
      const f = workerFixture();
      const response = await f.signup(body, { form });
      assert.equal(response.status, form ? 303 : 400);
      if (form) assert.match(response.headers.get('Location'), /error=invalid$/);
      else assert.equal((await response.json()).error, body.email ? 'invalid_email' : 'too_fast');
      assert.equal(f.writes.length, 0);
      assert.equal(f.emails.length, 0);
    }
  });

  test(`Worker: fourth request from an IP is blocked, another IP can sign up (${form ? 'form' : 'JSON'})`, async () => {
    const f = workerFixture();
    for (let i = 0; i < 3; i++) assert.equal((await f.signup({ email: `person${i}@example.com` }, { form })).status, form ? 303 : 200);
    const response = await f.signup({ email: 'fourth@example.com' }, { form });
    assert.equal(response.status, form ? 303 : 429);
    if (form) assert.match(response.headers.get('Location'), /error=busy$/);
    else assert.deepEqual(await response.json(), { ok: false, error: 'rate_limited' });
    const rateWrites = f.writes.filter(({ key }) => key.startsWith('rate:'));
    assert.deepEqual(rateWrites.map(({ value }) => value), ['1', '2', '3']);
    for (const write of rateWrites) {
      assert.equal(write.key, `rate:192.0.2.1:${Math.floor(f.now / 3600000)}`);
      assert.equal(write.options.expirationTtl, 7200);
    }
    assert.equal((await f.signup({ email: 'fourth@example.com' }, { ip: '192.0.2.2' })).status, 200);
    await f.drain();
    assert.equal(f.emails.filter(({ kind }) => kind === 'welcome').length, 4);
  });
}

test('Worker: duplicate address does not save or send again; welcome marker also prevents resending', async () => {
  const f = workerFixture();
  await f.signup();
  await f.drain();
  assert.deepEqual(await (await f.signup({ email: ' ALEX@example.com ' })).json(), { ok: true, alreadyJoined: true });
  await f.drain();
  assert.equal(f.emails.length, 2);
  const signup = f.writes.find(({ key }) => key.startsWith('signup:'));
  assert.equal(f.writes.filter(({ key }) => key.startsWith('signup:')).length, 1);
  f.records.delete(signup.key); // Keep the welcome marker while exercising its guard.
  await f.signup();
  await f.drain();
  assert.equal(f.emails.filter(({ kind }) => kind === 'welcome').length, 1);
});

for (const kind of ['welcome', 'notify']) {
  test(`Worker: ${kind} failure keeps success and logs the failure`, async () => {
    const f = workerFixture({ [kind + 'Fails']: true });
    const response = await f.signup();
    assert.deepEqual(await response.json(), { ok: true });
    await f.drain();
    assert.deepEqual(f.errors[0], [`${kind}_failed`, `MOCK_${kind.toUpperCase()}`, `Mock ${kind === 'notify' ? 'owner' : kind} failure`]);
    assert.equal(f.emails.length, 2);
    assert.equal([...f.records.keys()].some(key => key.startsWith('signup:')), true);
    assert.equal([...f.records.keys()].some(key => key.startsWith('welcome:')), kind !== 'welcome');
  });
}

test('Worker: missing welcome binding skips sending; existing SIGNUP_LIMITER still blocks', async () => {
  const f = workerFixture({ welcomeEnabled: false });
  await f.signup();
  await f.drain();
  assert.deepEqual(f.emails.map(({ kind }) => kind), ['owner']);
  assert.equal([...f.records.keys()].some(key => key.startsWith('welcome:')), false);
  const blocked = workerFixture({ limiterAllows: false });
  assert.equal((await blocked.signup()).status, 429);
  assert.deepEqual(blocked.limits, ['192.0.2.1']);
  assert.equal(blocked.writes.length, 0);
});
