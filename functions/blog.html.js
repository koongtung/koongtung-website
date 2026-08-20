import {
  escapeHtml,
  formatThaiDate,
  renderPageShell,
  getBlogPosts
} from "./_shared/blog-helpers.js";

function renderGrid(posts) {
  if (!posts.length) {
    return '<p style="color:var(--muted);grid-column:1/-1;text-align:center;">ยังไม่มีบทความ</p>';
  }
  return posts.slice().reverse().map(function (post) {
    return `<a class="blog-card" href="/blog/${escapeHtml(post.slug)}">
      <img src="${escapeHtml(post.coverImage)}" alt="${escapeHtml(post.title)}">
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

  const headExtra = `<title>บทความ | KOONGTUNG กุ้งถัง Seafood Boil</title>
<meta name="description" content="บทความและข่าวสารจากร้าน Seafood Boil กุ้งถัง KOONGTUNG เรื่องราวเบื้องหลัง บทสัมภาษณ์ และรีวิวที่เคยออกสื่อ">
<link rel="canonical" href="https://koongtungseafood.com/blog.html">`;

  const bodyHtml = `<section class="hero" style="min-height:30vh; background-image:url('/assets/images/about-story.jpg')">
  <div class="container hero-content">
    <span class="hero-badge">Blog</span>
    <h1>บทความ &amp; ข่าวสาร</h1>
    <p>เรื่องราวเบื้องหลัง บทสัมภาษณ์ และรีวิวจากสื่อต่าง ๆ ที่เคยพูดถึงกุ้งถัง</p>
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
