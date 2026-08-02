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

  const { id, value } = body || {};
  if (!id || typeof value !== "string") {
    return new Response(JSON.stringify({ error: "missing_id_or_value" }), {
      status: 400,
      headers: { "content-type": "application/json; charset=utf-8" }
    });
  }

  const raw = await context.env.CONTENT.get("overrides");
  const data = raw ? JSON.parse(raw) : {};
  data[id] = value;
  await context.env.CONTENT.put("overrides", JSON.stringify(data));

  return new Response(JSON.stringify({ ok: true }), {
    headers: { "content-type": "application/json; charset=utf-8" }
  });
}
