export async function onRequestGet(context) {
  const url = new URL(context.request.url);
  const videoUrl = url.searchParams.get("url");
  if (!videoUrl) {
    return new Response(JSON.stringify({ error: "missing_url" }), {
      status: 400,
      headers: { "content-type": "application/json; charset=utf-8" }
    });
  }

  try {
    const oembedRes = await fetch("https://www.tiktok.com/oembed?url=" + encodeURIComponent(videoUrl));
    if (!oembedRes.ok) {
      return new Response(JSON.stringify({ error: "oembed_failed" }), {
        status: 502,
        headers: { "content-type": "application/json; charset=utf-8" }
      });
    }
    const data = await oembedRes.json();
    return new Response(JSON.stringify(data), {
      headers: {
        "content-type": "application/json; charset=utf-8",
        "cache-control": "public, max-age=3600"
      }
    });
  } catch (e) {
    return new Response(JSON.stringify({ error: "fetch_failed" }), {
      status: 502,
      headers: { "content-type": "application/json; charset=utf-8" }
    });
  }
}
