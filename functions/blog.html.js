import {
  escapeHtml,
  formatThaiDate,
  renderPageShell,
  getBlogPosts,
  getOverrides
} from "./_shared/blog-helpers.js";

function renderGrid(posts) {
  if (!posts.length) {
    return '<p style="color:var(--muted);grid-column:1/-1;text-align:center;">ยังไม่มีบทความ</p>';
  }
  return posts.slice().reverse().map(function (post) {
    return `<a class="blog-card" href="/blog/${escapeHtml(post.slug)}">
      <img loading="lazy" src="${escapeHtml(post.coverImage)}" alt="${escapeHtml(post.title)}">
      <div class="blog-card-body">
        <span class="blog-date">${formatThaiDate(post.date)}</span>
        <h3>${escapeHtml(post.title)}</h3>
        <p>${escapeHtml(post.excerpt)}</p>
      </div>
    </a>`;
  }).join("");
}

export async function onRequestGet(context) {
  const posts = await getBlogPosts(context.env);
  const overrides = await getOverrides(context.env);
  const heroBadge = overrides["blog-hero-badge"] || "Blog";
  const heroTitle = overrides["blog-hero-title"] || "บทความ & ข่าวสาร";
  const heroSubtitle = overrides["blog-hero-subtitle"] || "เรื่องราวเบื้องหลัง บทสัมภาษณ์ และรีวิวจากสื่อต่าง ๆ ที่เคยพูดถึงกุ้งถัง";
  const heroTitleI18n = overrides["blog-hero-title"] ? "" : ' data-i18n="blogPage.heroTitle"';
  const heroSubtitleI18n = overrides["blog-hero-subtitle"] ? "" : ' data-i18n="blogPage.heroSubtitle"';

  const headExtra = `<title>บทความ | KOONGTUNG กุ้งถัง Seafood Boil</title>
<meta name="description" content="บทความและข่าวสารจากร้าน Seafood Boil กุ้งถัง KOONGTUNG เรื่องราวเบื้องหลัง บทสัมภาษณ์ และรีวิวที่เคยออกสื่อ">
<link rel="canonical" href="https://koongtungseafood.com/blog.html">
<meta property="og:type" content="website">
<meta property="og:title" content="บทความ | KOONGTUNG กุ้งถัง Seafood Boil">
<meta property="og:description" content="บทความและข่าวสารจากร้าน Seafood Boil กุ้งถัง KOONGTUNG เรื่องราวเบื้องหลัง บทสัมภาษณ์ และรีวิวที่เคยออกสื่อ">
<meta property="og:image" content="https://koongtungseafood.com/assets/images/about-story.jpg">
<meta property="og:url" content="https://koongtungseafood.com/blog.html">
<meta property="og:site_name" content="KOONGTUNG กุ้งถัง">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="บทความ | KOONGTUNG กุ้งถัง Seafood Boil">
<meta name="twitter:description" content="บทความและข่าวสารจากร้าน Seafood Boil กุ้งถัง KOONGTUNG เรื่องราวเบื้องหลัง บทสัมภาษณ์ และรีวิวที่เคยออกสื่อ">
<meta name="twitter:image" content="https://koongtungseafood.com/assets/images/about-story.jpg">`;

  const bodyHtml = `<section class="hero" style="min-height:30vh; background-image:url('/assets/images/about-story.jpg')">
  <div class="container hero-content">
    <span class="hero-badge">${escapeHtml(heroBadge)}</span>
    <h1${heroTitleI18n}>${escapeHtml(heroTitle)}</h1>
    <p${heroSubtitleI18n}>${escapeHtml(heroSubtitle)}</p>
  </div>
</section>
<section>
  <div class="container">
    <div class="blog-grid">${renderGrid(posts)}</div>
  </div>
</section>`;

  return new Response(renderPageShell(headExtra, bodyHtml), {
    headers: {
      "content-type": "text/html; charset=utf-8",
      "cache-control": "public, max-age=60"
    }
  });
}
