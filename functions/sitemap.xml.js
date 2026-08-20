import { SITE_URL, getBlogPosts } from "./_shared/blog-helpers.js";

const STATIC_PAGES = [
  "", "index.html", "about.html", "branches.html", "menu.html",
  "promotion.html", "reviews.html", "contact.html", "links.html", "blog.html"
];

export async function onRequestGet(context) {
  const posts = await getBlogPosts(context.env);

  let urls = STATIC_PAGES.map(function (p) {
    return `<url><loc>${SITE_URL}/${p}</loc></url>`;
  }).join("");

  urls += posts.map(function (p) {
    return `<url><loc>${SITE_URL}/blog/${p.slug}</loc><lastmod>${p.date}</lastmod></url>`;
  }).join("");

  const xml = `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${urls}</urlset>`;

  return new Response(xml, {
    headers: {
      "content-type": "application/xml; charset=utf-8",
      "cache-control": "public, max-age=300"
    }
  });
}
