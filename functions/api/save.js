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

  const { id, value, overrides } = body || {};
  if (!id || typeof value !== "string") {
    return new Response(JSON.stringify({ error: "missing_id_or_value" }), {
      status: 400,
      headers: { "content-type": "application/json; charset=utf-8" }
    });
  }

  // Prefer the full snapshot the admin panel already holds in memory over a
  // fresh KV read. KV reads are eventually consistent — re-reading "overrides"
  // right after a previous save can hit a stale copy on a different edge
  // node and silently drop that earlier save when this one writes back. The
  // client's in-memory copy (updated after every successful save this
  // session) avoids that race for the single-admin workflow this app has.
  let data;
  if (overrides && typeof overrides === "object" && !Array.isArray(overrides)) {
    data = overrides;
    data[id] = value;
  } else {
    const raw = await context.env.CONTENT.get("overrides");
    data = raw ? JSON.parse(raw) : {};
    data[id] = value;
  }
  await context.env.CONTENT.put("overrides", JSON.stringify(data));

  return new Response(JSON.stringify({ ok: true }), {
    headers: { "content-type": "application/json; charset=utf-8" }
  });
}
