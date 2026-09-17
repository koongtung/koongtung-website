import {
  SITE_URL,
  escapeHtml,
  renderPageShell,
  getOverrides
} from "./_shared/blog-helpers.js";
import { getBranchData, ALL_BRANCH_NUMBERS } from "./_shared/branch-data.js";

function renderFaq(items) {
  if (!items || !items.length) return "";
  const rows = items.map(function (it) {
    return `<details class="faq-item">
      <summary>${escapeHtml(it.q || "")}</summary>
      <div class="faq-answer">${escapeHtml(it.a || "")}</div>
    </details>`;
  }).join("");
  return `<div class="section-head" style="margin-top:50px;">
    <h2>คำถามที่พบบ่อย</h2>
  </div>
  <div class="faq-list">${rows}</div>`;
}

export async function onRequestGet(context) {
  const overrides = await getOverrides(context.env);

  const val = function (id, fallback) {
    return overrides.hasOwnProperty(id) ? overrides[id] : fallback;
  };

  const title = val("pillar-title", "Seafood Boil เจ้าแรกในไทย ตั้งแต่ปี 2015 | กุ้งถัง KOONGTUNG");
  const subtitle = val("pillar-subtitle", "ร้าน Seafood Boil สไตล์อเมริกันเจ้าแรกในกรุงเทพฯ ซอส Bang Bang สูตรเฉพาะ 5 สาขาทั่วเมือง");
  const seoTitle = val("pillar-seo-title", "") || title;
  const seoDesc = val("pillar-seo-desc", "") || subtitle;
  const body1 = val("pillar-body-1", "");
  const body2 = val("pillar-body-2", "");
  const body3 = val("pillar-body-3", "");
  const heroImage = SITE_URL + "/api/image/img-pillar-hero-bg?default=/assets/images/branch-1.jpg";

  const faqRaw = await context.env.CONTENT.get("gallery-pillar-faq");
  const faqItems = faqRaw ? JSON.parse(faqRaw) : [];

  const canonicalUrl = SITE_URL + "/seafood-boil-bangkok";

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Restaurant",
    "name": "KOONGTUNG กุ้งถัง",
    "alternateName": "Seafood Boil Bangkok",
    "url": canonicalUrl,
    "image": heroImage,
    "servesCuisine": ["Seafood", "American"],
    "priceRange": "$$",
    "address": { "@type": "PostalAddress", "addressLocality": "กรุงเทพมหานคร", "addressCountry": "TH" }
  };
  const jsonLdBlocks = [`<script type="application/ld+json">${JSON.stringify(jsonLd)}</script>`];
  if (faqItems.length) {
    const jsonLdFaq = {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "mainEntity": faqItems.map(function (it) {
        return { "@type": "Question", "name": it.q || "", "acceptedAnswer": { "@type": "Answer", "text": it.a || "" } };
      })
    };
    jsonLdBlocks.push(`<script type="application/ld+json">${JSON.stringify(jsonLdFaq)}</script>`);
  }

  const headExtra = `<title>${escapeHtml(seoTitle)}</title>
<meta name="description" content="${escapeHtml(seoDesc)}">
<link rel="canonical" href="${canonicalUrl}">
<meta property="og:type" content="website">
<meta property="og:title" content="${escapeHtml(seoTitle)}">
<meta property="og:description" content="${escapeHtml(seoDesc)}">
<meta property="og:image" content="${heroImage}">
<meta property="og:url" content="${canonicalUrl}">
<meta property="og:site_name" content="KOONGTUNG กุ้งถัง">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="${escapeHtml(seoTitle)}">
<meta name="twitter:description" content="${escapeHtml(seoDesc)}">
<meta name="twitter:image" content="${heroImage}">
${jsonLdBlocks.join("\n")}`;

  const branchCards = ALL_BRANCH_NUMBERS.map(function (n) {
    const b = getBranchData(n, overrides);
    if (b.status === "ซ่อนสาขานี้") return "";
    return `<a class="card branch-card" href="/branch/${n}" style="max-width:none;">
      <div class="card-body">
        <h3>${escapeHtml(b.name)}</h3>
        <p>${escapeHtml(b.address)}</p>
      </div>
    </a>`;
  }).filter(Boolean).join("\n");

  const bodyHtml = `<section class="hero" style="background-image:url('${escapeHtml(heroImage)}')">
  <div class="container hero-content">
    <span class="hero-badge">Seafood Boil Bangkok</span>
    <h1>${escapeHtml(title)}</h1>
    <p>${escapeHtml(subtitle)}</p>
  </div>
</section>
<section>
  <div class="container" style="max-width:760px;">
    ${body1 ? `<p style="line-height:1.8;">${escapeHtml(body1)}</p>` : ""}
    ${body2 ? `<p style="line-height:1.8;">${escapeHtml(body2)}</p>` : ""}
    ${body3 ? `<p style="line-height:1.8;">${escapeHtml(body3)}</p>` : ""}
  </div>
</section>
<section class="section-alt">
  <div class="container">
    <div class="section-head"><h2>สาขาทั้งหมด</h2></div>
    <div class="grid">${branchCards}</div>
  </div>
</section>
<section>
  <div class="container" style="max-width:760px;">
    ${renderFaq(faqItems)}
    <div style="text-align:center;margin-top:40px;">
      <a href="/menu.html" class="btn btn-primary">ดูเมนูอาหาร</a>
    </div>
  </div>
</section>`;

  return new Response(renderPageShell(headExtra, bodyHtml), {
    headers: {
      "content-type": "text/html; charset=utf-8",
      "cache-control": "public, max-age=60"
    }
  });
}
