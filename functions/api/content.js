export async function onRequestGet(context) {
  const raw = await context.env.CONTENT.get("overrides");
  const data = raw ? JSON.parse(raw) : {};

  // Let the admin panel know which single-image fields currently have an
  // uploaded override (those images now live under "img:<id>" keys, served
  // directly by /api/image/:id, not in this text blob) — used only to show
  // the "แก้ไขแล้ว" badge. Reserved key, harmless no-op for cms.js on the
  // public pages since no element has data-cms-id="__imageIds".
  const list = await context.env.CONTENT.list({ prefix: "img:" });
  data.__imageIds = list.keys.map(function (k) { return k.name.slice(4); });

  return new Response(JSON.stringify(data), {
    headers: {
      "content-type": "application/json; charset=utf-8",
      "cache-control": "no-store"
    }
  });
}
