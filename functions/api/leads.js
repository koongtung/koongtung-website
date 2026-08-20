export async function onRequestGet(context) {
  const password = context.request.headers.get("x-admin-password") || "";
  if (password !== context.env.ADMIN_PASSWORD) {
    return new Response(JSON.stringify({ error: "unauthorized" }), {
      status: 401,
      headers: { "content-type": "application/json; charset=utf-8" }
    });
  }
  const raw = await context.env.CONTENT.get("leads");
  return new Response(raw || "[]", {
    headers: {
      "content-type": "application/json; charset=utf-8",
      "cache-control": "no-store"
    }
  });
}

export async function onRequestPost(context) {
  let body;
  try {
    body = await context.request.json();
  } catch (e) {
    return new Response(JSON.stringify({ error: "bad_request" }), {
      status: 400,
      headers: { "content-type": "application/json; charset=utf-8" }
    });
  }

  // Honeypot: bots often fill every field, humans never see or fill this one.
  if (body.website) {
    return new Response(JSON.stringify({ ok: true }), {
      headers: { "content-type": "application/json; charset=utf-8" }
    });
  }

  const name = (body.name || "").toString().trim().slice(0, 200);
  const phone = (body.phone || "").toString().trim().slice(0, 100);
  const message = (body.message || "").toString().trim().slice(0, 2000);

  if (!name || !message) {
    return new Response(JSON.stringify({ error: "missing_fields" }), {
      status: 400,
      headers: { "content-type": "application/json; charset=utf-8" }
    });
  }

  const raw = await context.env.CONTENT.get("leads");
  const leads = raw ? JSON.parse(raw) : [];

  leads.push({
    id: "lead-" + Date.now(),
    name: name,
    phone: phone,
    message: message,
    submittedAt: new Date().toISOString(),
    read: false
  });

  if (leads.length > 500) leads.splice(0, leads.length - 500);

  await context.env.CONTENT.put("leads", JSON.stringify(leads));

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
  const raw = await context.env.CONTENT.get("leads");
  const leads = raw ? JSON.parse(raw) : [];
  const filtered = leads.filter(function (l) { return l.id !== body.id; });
  await context.env.CONTENT.put("leads", JSON.stringify(filtered));
  return new Response(JSON.stringify({ ok: true }), {
    headers: { "content-type": "application/json; charset=utf-8" }
  });
}
