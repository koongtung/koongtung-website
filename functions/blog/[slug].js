import {
  SITE_URL,
  escapeHtml,
  resolveImageUrl,
  formatThaiDate,
  renderBodyHtml,
  renderPageShell,
  getBlogPosts
} from "../_shared/blog-helpers.js";

function renderRelated(related) {
  if (!related.length) return "";
  var cards = related.map(function (p) {
    return `<a class="blog-card" href="/blog/${escapeHtml(p.slug)}">
      <img loading="lazy" src="${escapeHtml(p.coverImage)}" alt="${escapeHtml(p.title)}">
      <div class="blog-card-body">
        <span class="blog-date">${formatThaiDate(p.date)}</span>
        <h3>${escapeHtml(p.title)}</h3>
        <p>${escapeHtml(p.excerpt)}</p>
      </div>
    </a>`;
  }).join("");
  return `<div class="section-head" style="margin-top:50px;text-align:left;max-width:none;">
    <h2 style="font-size:1.3rem;" data-i18n="blogPage.related">บทความที่เกี่ยวข้อง</h2>
  </div>
  <div class="blog-grid">${cards}</div>`;
}

function render404() {
  return renderPageShell(
    "<title>ไม่พบบทความ | KOONGTUNG กุ้งถัง Seafood Boil</title>",
    `<section><div class="container" style="text-align:center;padding:80px 0;">
      <h1>ไม่พบบทความนี้</h1>
      <p><a href="/blog.html" class="btn btn-navy">กลับไปหน้าบทความ</a></p>
    </div></section>`
  );
}

export async function onRequestGet(context) {
  const slug = context.params.slug;
  const posts = await getBlogPosts(context.env);
  const post = posts.find(function (p) { return p.slug === slug; });

  if (!post) {
    return new Response(render404(), {
      status: 404,
      headers: { "content-type": "text/html; charset=utf-8" }
    });
  }

  const canonicalUrl = SITE_URL + "/blog/" + post.slug;
  const ogImage = resolveImageUrl(post.coverImage);
  const related = posts.filter(function (p) { return p.slug !== post.slug; }).slice(-3).reverse();

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": post.title,
    "description": post.excerpt,
    "image": [ogImage],
    "datePublished": post.date,
    "author": { "@type": "Organization", "name": "KOONGTUNG กุ้งถัง" },
    "publisher": {
      "@type": "Organization",
      "name": "KOONGTUNG กุ้งถัง",
      "logo": { "@type": "ImageObject", "url": SITE_URL + "/assets/images/logo.jpg" }
    },
    "mainEntityOfPage": canonicalUrl
  };

  const headExtra = `<title>${escapeHtml(post.title)} | KOONGTUNG กุ้งถัง Seafood Boil</title>
<meta name="description" content="${escapeHtml(post.excerpt)}">
<link rel="canonical" href="${canonicalUrl}">
<meta property="og:type" content="article">
<meta property="og:title" content="${escapeHtml(post.title)}">
<meta property="og:description" content="${escapeHtml(post.excerpt)}">
<meta property="og:image" content="${ogImage}">
<meta property="og:url" content="${canonicalUrl}">
<meta property="og:site_name" content="KOONGTUNG กุ้งถัง">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="${escapeHtml(post.title)}">
<meta name="twitter:description" content="${escapeHtml(post.excerpt)}">
<meta name="twitter:image" content="${ogImage}">
<script type="application/ld+json">${JSON.stringify(jsonLd)}</script>`;

  const bodyHtml = `<section>
  <div class="container" style="max-width:760px; padding-top:44px;">
    <a href="/blog.html" class="blog-back-link" data-i18n="blogPage.backLink">← กลับไปหน้าบทความ</a>
    <div class="blog-post-date">${formatThaiDate(post.date)}</div>
    <h1 class="blog-post-title">${escapeHtml(post.title)}</h1>
    ${post.coverImage ? `<img class="blog-post-cover" src="${escapeHtml(post.coverImage)}" alt="${escapeHtml(post.title)}">` : ""}
    <div class="blog-post-body">${renderBodyHtml(post.body)}</div>
    ${post.sourceUrl ? `<p class="blog-post-source">อ่านต้นฉบับที่ <a href="${escapeHtml(post.sourceUrl)}" target="_blank" rel="noopener">${escapeHtml(post.sourceName || post.sourceUrl)} ↗</a></p>` : ""}
    ${renderRelated(related)}
  </div>
</section>`;

  return new Response(renderPageShell(headExtra, bodyHtml), {
    headers: {
      "content-type": "text/html; charset=utf-8",
      "cache-control": "public, max-age=60"
    }
  });
}
