export async function onRequestPost(context) {
  let body;
  try {
    body = await context.request.json();
  } catch (e) {
    return new Response(null, { status: 204 });
  }
  const id = body && body.id;
  if (!id || typeof id !== "string" || id.length > 100) {
    return new Response(null, { status: 204 });
  }

  const raw = await context.env.CONTENT.get("click-counts");
  const counts = raw ? JSON.parse(raw) : {};
  counts[id] = (counts[id] || 0) + 1;
  await context.env.CONTENT.put("click-counts", JSON.stringify(counts));

  return new Response(null, { status: 204 });
}
