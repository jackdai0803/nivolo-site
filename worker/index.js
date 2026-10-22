const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const OFFLINE_PAGE = `<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>Nivolo — Back soon</title>
<style>html{color-scheme:light}body{margin:0;min-height:100svh;display:grid;place-items:center;background:#f2f1ee;color:#163c2e;font-family:system-ui,-apple-system,sans-serif}main{max-width:480px;padding:40px 24px;text-align:center}p{font-size:16px;line-height:1.6;color:#526258}h1{margin:24px 0 16px;font-size:clamp(32px,7vw,48px);letter-spacing:-.045em;line-height:1.12}.brand{font-size:18px;font-weight:800;letter-spacing:-.04em;color:#163c2e}</style></head>
<body><main><p class="brand">Nivolo</p><h1>We'll be back soon.</h1><p>We're making a few changes.<br>Thanks for stopping by.</p></main></body></html>`;

function offlineResponse(request) {
  const api = new URL(request.url).pathname.startsWith("/api/");
  return new Response(request.method === "HEAD" ? null : api ? JSON.stringify({ error: "site_temporarily_offline" }) : OFFLINE_PAGE, {
    status: 503,
    headers: {
      "Content-Type": api ? "application/json; charset=utf-8" : "text/html; charset=utf-8",
      "Cache-Control": "no-store",
      "Retry-After": "3600",
      "X-Content-Type-Options": "nosniff",
    },
  });
}
const json = (body, status = 200) => new Response(JSON.stringify(body), {
  status,
  headers: {
    "Content-Type": "application/json; charset=utf-8",
    "Cache-Control": "no-store",
    "X-Content-Type-Options": "nosniff",
  },
});

const redirectToForm = (request, state) => {
  const url = new URL("/launch.html", request.url);
  url.searchParams.set(state === "joined" ? "joined" : "error", state === "joined" ? "1" : state);
  return Response.redirect(url, 303);
};

const wantsJson = (request) => {
  const contentType = request.headers.get("Content-Type") || "";
  return contentType.includes("application/json") || (request.headers.get("Accept") || "").includes("application/json");
};

const parseBody = async (request) => {
  const contentType = request.headers.get("Content-Type") || "";
  if (contentType.includes("application/json")) return request.json();
  if (contentType.includes("application/x-www-form-urlencoded") || contentType.includes("multipart/form-data")) {
    return Object.fromEntries(await request.formData());
  }
  throw new Error("unsupported_content_type");
};

const emailKey = async (email) => {
  const bytes = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(email));
  const base64 = btoa(String.fromCharCode(...new Uint8Array(bytes)));
  return `signup:${base64.replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "")}`;
};

const notifyOwner = async (env, email, joinedAt) => {
  if (!env.NOTIFY_SIGNUP) return;
  await env.NOTIFY_SIGNUP.send({
    from: { email: "support@nivolo.app", name: "Nivolo launch list" },
    to: "jackdai259@gmail.com",
    subject: "New Nivolo launch signup",
    text: `A visitor joined the Nivolo launch list.\n\nEmail: ${email}\nJoined: ${joinedAt}\n`,
  });
};

async function handleLaunchSignup(request, env, ctx) {
  const useJson = wantsJson(request);
  const ip = request.headers.get("CF-Connecting-IP") || "local";
  if (env.SIGNUP_LIMITER) {
    const { success } = await env.SIGNUP_LIMITER.limit({ key: ip });
    if (!success) return useJson ? json({ ok: false, error: "rate_limited" }, 429) : redirectToForm(request, "busy");
  }

  let body;
  try {
    body = await parseBody(request);
  } catch {
    return useJson ? json({ ok: false, error: "invalid_request" }, 400) : redirectToForm(request, "invalid");
  }

  // Quietly accept the hidden honeypot field so bots cannot learn how to
  // work around it, but do not save or notify for that submission.
  if (String(body.company || "").trim()) {
    return useJson ? json({ ok: true }) : redirectToForm(request, "joined");
  }

  const email = String(body.email || "").trim().toLowerCase();
  if (email.length > 254 || !EMAIL_PATTERN.test(email)) {
    return useJson ? json({ ok: false, error: "invalid_email" }, 400) : redirectToForm(request, "invalid");
  }

  const key = await emailKey(email);
  const existing = await env.LAUNCH_SIGNUPS.get(key);
  if (existing) {
    return useJson ? json({ ok: true, alreadyJoined: true }) : redirectToForm(request, "joined");
  }

  const joinedAt = new Date().toISOString();
  await env.LAUNCH_SIGNUPS.put(key, JSON.stringify({ email, joinedAt, source: "nivolo.app" }));
  ctx.waitUntil(notifyOwner(env, email, joinedAt).catch(() => {
    // The address is already safely stored. A notification failure should
    // not make the visitor retry and create misleading duplicate traffic.
  }));

  return useJson ? json({ ok: true }) : redirectToForm(request, "joined");
}

export default {
  async fetch(request, env, ctx) {
    if (env.SITE_OFFLINE === "true") return offlineResponse(request);
    const url = new URL(request.url);
    if (url.pathname === "/api/early-supporter/status") {
      if (request.method !== "GET") return new Response(null, { status: 405, headers: { Allow: "GET" } });
      try {
        const response = await fetch("https://api.nivolo.app/early-supporter/status", { signal: AbortSignal.timeout(5000) });
        const count = await response.json();
        if (!response.ok || count.limit !== 20 || !Number.isInteger(count.claimed) || count.claimed < 0 || count.claimed > 20) throw new Error("invalid_count");
        return json(count);
      } catch { return json({ error: "count_unavailable" }, 503); }
    }
    if (url.pathname === "/api/launch-alert") {
      if (request.method !== "POST") {
        return new Response("Method Not Allowed", { status: 405, headers: { Allow: "POST" } });
      }
      return handleLaunchSignup(request, env, ctx);
    }
    return env.ASSETS.fetch(request);
  },
};
