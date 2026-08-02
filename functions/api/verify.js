export async function onRequestPost(context) {
  const password = context.request.headers.get("x-admin-password") || "";
  if (password !== context.env.ADMIN_PASSWORD) {
    return new Response(JSON.stringify({ ok: false }), {
      status: 401,
      headers: { "content-type": "application/json; charset=utf-8" }
    });
  }
  return new Response(JSON.stringify({ ok: true }), {
    headers: { "content-type": "application/json; charset=utf-8" }
  });
}
