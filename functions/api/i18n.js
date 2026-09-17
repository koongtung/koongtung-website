export async function onRequestGet(context) {
  const raw = await context.env.CONTENT.get("i18n-overrides");
  return new Response(raw || "{}", {
    headers: {
      "content-type": "application/json; charset=utf-8",
      "cache-control": "no-store"
    }
  });
}

export async function onRequestPost(context) {
  const password = context.request.headers.get("x-admin-password") || "";
  if (password !== context.env.ADMIN_PASSWORD) {
    return new Response(JSON.stringify({ error: "unauthorized" }), {
      status: 401,
      headers: { "content-type": "application/json; charset=utf-8" }
    });
  }
  let body;
  try {
    body = await context.request.json();
  } catch (e) {
    return new Response(JSON.stringify({ error: "bad_request" }), {
      status: 400,
      headers: { "content-type": "application/json; charset=utf-8" }
    });
  }
  const key = (body.key || "").toString().trim();
  if (!key) {
    return new Response(JSON.stringify({ error: "missing_key" }), {
      status: 400,
      headers: { "content-type": "application/json; charset=utf-8" }
    });
  }
  const raw = await context.env.CONTENT.get("i18n-overrides");
  const overrides = raw ? JSON.parse(raw) : {};
  overrides[key] = {
    en: (body.en || "").toString(),
    zh: (body.zh || "").toString()
  };
  await context.env.CONTENT.put("i18n-overrides", JSON.stringify(overrides));
  return new Response(JSON.stringify({ ok: true }), {
    headers: { "content-type": "application/json; charset=utf-8" }
  });
}

export async function onRequestDelete(context) {
  const password = context.request.headers.get("x-admin-password") || "";
  if (password !== context.env.ADMIN_PASSWORD) {
    return new Response(JSON.stringify({ error: "unauthorized" }), {
      status: 401,
      headers: { "content-type": "application/json; charset=utf-8" }
    });
  }
  let body;
  try {
    body = await context.request.json();
  } catch (e) {
    return new Response(JSON.stringify({ error: "bad_request" }), {
      status: 400,
      headers: { "content-type": "application/json; charset=utf-8" }
    });
  }
  const raw = await context.env.CONTENT.get("i18n-overrides");
  const overrides = raw ? JSON.parse(raw) : {};
  delete overrides[body.key];
  await context.env.CONTENT.put("i18n-overrides", JSON.stringify(overrides));
  return new Response(JSON.stringify({ ok: true }), {
    headers: { "content-type": "application/json; charset=utf-8" }
  });
}
