const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
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
    const url = new URL(request.url);
    if (url.pathname === "/api/launch-alert") {
      if (request.method !== "POST") {
        return new Response("Method Not Allowed", { status: 405, headers: { Allow: "POST" } });
      }
      return handleLaunchSignup(request, env, ctx);
    }
    return env.ASSETS.fetch(request);
  },
};
