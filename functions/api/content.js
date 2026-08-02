export async function onRequestGet(context) {
  const raw = await context.env.CONTENT.get("overrides");
  return new Response(raw || "{}", {
    headers: {
      "content-type": "application/json; charset=utf-8",
      "cache-control": "no-store"
    }
  });
}
