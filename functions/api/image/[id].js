// Serves an admin-uploaded image directly from KV as a real image response —
// or, if nothing has been uploaded for this id yet, redirects to the static
// default file shipped with the site (passed in as the ?default= query param).
//
// This replaces the old approach where the static HTML always shipped the
// original default image and a client-side script (js/cms.js) swapped in the
// admin's uploaded version after the page had already painted. That always
// caused a visible flash of the old image on every single page load, for as
// long as an override existed. Routing <img src> / background-image straight
// through this endpoint means the FIRST request for the image already gets
// whichever version is current — no client JS involved, no flash, ever.

function base64ToBytes(base64) {
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
  return bytes;
}

export async function onRequestGet(context) {
  const { id } = context.params;
  const url = new URL(context.request.url);
  const fallback = url.searchParams.get("default");

  const bytes = await context.env.CONTENT.get("img:" + id, { type: "arrayBuffer" });
  if (bytes && bytes.byteLength > 0) {
    return new Response(bytes, {
      headers: {
        "content-type": "image/jpeg",
        "cache-control": "public, max-age=3600, must-revalidate"
      }
    });
  }

  if (fallback) {
    return Response.redirect(new URL(fallback, context.request.url).toString(), 302);
  }
  return new Response("Not found", { status: 404 });
}

export async function onRequestPost(context) {
  const password = context.request.headers.get("x-admin-password") || "";
  if (password !== context.env.ADMIN_PASSWORD) {
    return new Response(JSON.stringify({ error: "unauthorized" }), {
      status: 401,
      headers: { "content-type": "application/json; charset=utf-8" }
    });
  }

  const { id } = context.params;
  let body;
  try {
    body = await context.request.json();
  } catch (e) {
    return new Response(JSON.stringify({ error: "bad_request" }), {
      status: 400,
      headers: { "content-type": "application/json; charset=utf-8" }
    });
  }

  const value = body && body.value;
  if (!value || typeof value !== "string" || value.indexOf("base64,") === -1) {
    return new Response(JSON.stringify({ error: "missing_value" }), {
      status: 400,
      headers: { "content-type": "application/json; charset=utf-8" }
    });
  }

  const bytes = base64ToBytes(value.split("base64,")[1]);
  await context.env.CONTENT.put("img:" + id, bytes.buffer);

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

  const { id } = context.params;
  await context.env.CONTENT.delete("img:" + id);

  return new Response(JSON.stringify({ ok: true }), {
    headers: { "content-type": "application/json; charset=utf-8" }
  });
}
