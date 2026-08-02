export async function onRequestGet(context) {
  const password = context.request.headers.get("x-admin-password") || "";
  if (password !== context.env.ADMIN_PASSWORD) {
    return new Response(JSON.stringify({ error: "unauthorized" }), {
      status: 401,
      headers: { "content-type": "application/json; charset=utf-8" }
    });
  }
  const raw = await context.env.CONTENT.get("click-counts");
  return new Response(raw || "{}", {
    headers: { "content-type": "application/json; charset=utf-8", "cache-control": "no-store" }
  });
}
