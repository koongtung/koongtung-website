import { SITE_URL, getBlogPosts, getOverrides } from "./_shared/blog-helpers.js";
import { ALL_BRANCH_NUMBERS } from "./_shared/branch-data.js";

const STATIC_PAGES = [
  "", "index.html", "about.html", "branches.html", "menu.html",
  "promotion.html", "reviews.html", "contact.html", "links.html", "blog.html"
];

export async function onRequestGet(context) {
  const posts = await getBlogPosts(context.env);
  const overrides = await getOverrides(context.env);

  let urls = STATIC_PAGES.map(function (p) {
    return `<url><loc>${SITE_URL}/${p}</loc></url>`;
  }).join("");

  urls += posts.map(function (p) {
    return `<url><loc>${SITE_URL}/blog/${p.slug}</loc><lastmod>${p.date}</lastmod></url>`;
  }).join("");

  // Hidden SEO pages only join the sitemap once their own "เผยแพร่แล้ว"
  // switch is flipped in the admin panel — until then they exist and are
  // reachable by direct link (for review) but stay invisible to Google.
  ALL_BRANCH_NUMBERS.forEach(function (n) {
    if (overrides["branch-" + n + "-seo-publish"] === "เผยแพร่แล้ว") {
      urls += `<url><loc>${SITE_URL}/branch/${n}</loc></url>`;
    }
  });
  if (overrides["pillar-publish"] === "เผยแพร่แล้ว") {
    urls += `<url><loc>${SITE_URL}/seafood-boil-bangkok</loc></url>`;
  }

  const xml = `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${urls}</urlset>`;

  return new Response(xml, {
    headers: {
      "content-type": "application/xml; charset=utf-8",
      "cache-control": "public, max-age=300"
    }
  });
}
