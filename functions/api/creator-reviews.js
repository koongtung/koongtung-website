export async function onRequestGet(context) {
  const raw = await context.env.CONTENT.get("creator-reviews");
  return new Response(raw || "null", {
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

  if (!Array.isArray(body.items)) {
    return new Response(JSON.stringify({ error: "items_must_be_array" }), {
      status: 400,
      headers: { "content-type": "application/json; charset=utf-8" }
    });
  }

  await context.env.CONTENT.put("creator-reviews", JSON.stringify(body.items));

  return new Response(JSON.stringify({ ok: true }), {
    headers: { "content-type": "application/json; charset=utf-8" }
  });
}
