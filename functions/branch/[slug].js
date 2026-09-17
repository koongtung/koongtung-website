import {
  SITE_URL,
  escapeHtml,
  renderPageShell,
  getOverrides
} from "../_shared/blog-helpers.js";
import { getBranchData, ALL_BRANCH_NUMBERS } from "../_shared/branch-data.js";

function render404() {
  return renderPageShell(
    "<title>ไม่พบหน้าสาขานี้ | KOONGTUNG กุ้งถัง Seafood Boil</title>",
    `<section><div class="container" style="text-align:center;padding:80px 0;">
      <h1>ไม่พบหน้าสาขานี้</h1>
      <p><a href="/branches.html" class="btn btn-navy">ดูสาขาทั้งหมด</a></p>
    </div></section>`
  );
}

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
  const slugNum = parseInt(context.params.slug, 10);
  if (!ALL_BRANCH_NUMBERS.includes(slugNum)) {
    return new Response(render404(), {
      status: 404,
      headers: { "content-type": "text/html; charset=utf-8" }
    });
  }

  const overrides = await getOverrides(context.env);
  const branch = getBranchData(slugNum, overrides);

  const faqRaw = await context.env.CONTENT.get("gallery-branch-" + slugNum + "-faq");
  const faqItems = faqRaw ? JSON.parse(faqRaw) : [];

  const canonicalUrl = SITE_URL + "/branch/" + slugNum;
  const pageTitle = branch.seoTitle || (branch.name + " | KOONGTUNG กุ้งถัง Seafood Boil");
  const pageDesc = branch.seoDesc || ("ร้านอาหารทะเล กุ้งถัง KOONGTUNG " + branch.name + " " + branch.address + " เวลาเปิด-ปิด " + branch.hours + " โทร " + branch.phone);
  const ogImage = SITE_URL + branch.imageDefault;

  const jsonLdRestaurant = {
    "@context": "https://schema.org",
    "@type": "Restaurant",
    "name": "กุ้งถัง KOONGTUNG - " + branch.name,
    "image": ogImage,
    "telephone": branch.phone,
    "servesCuisine": ["Seafood", "American"],
    "priceRange": "$$",
    "brand": { "@type": "Brand", "name": "KOONGTUNG กุ้งถัง" },
    "address": {
      "@type": "PostalAddress",
      "streetAddress": branch.address,
      "addressLocality": "กรุงเทพมหานคร",
      "addressCountry": "TH"
    },
    "url": canonicalUrl
  };

  const jsonLdBlocks = [`<script type="application/ld+json">${JSON.stringify(jsonLdRestaurant)}</script>`];

  if (faqItems.length) {
    const jsonLdFaq = {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "mainEntity": faqItems.map(function (it) {
        return {
          "@type": "Question",
          "name": it.q || "",
          "acceptedAnswer": { "@type": "Answer", "text": it.a || "" }
        };
      })
    };
    jsonLdBlocks.push(`<script type="application/ld+json">${JSON.stringify(jsonLdFaq)}</script>`);
  }

  const headExtra = `<title>${escapeHtml(pageTitle)}</title>
<meta name="description" content="${escapeHtml(pageDesc)}">
<link rel="canonical" href="${canonicalUrl}">
<meta property="og:type" content="website">
<meta property="og:title" content="${escapeHtml(pageTitle)}">
<meta property="og:description" content="${escapeHtml(pageDesc)}">
<meta property="og:image" content="${ogImage}">
<meta property="og:url" content="${canonicalUrl}">
<meta property="og:site_name" content="KOONGTUNG กุ้งถัง">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="${escapeHtml(pageTitle)}">
<meta name="twitter:description" content="${escapeHtml(pageDesc)}">
<meta name="twitter:image" content="${ogImage}">
${jsonLdBlocks.join("\n")}`;

  const deliveryButtons = [
    branch.lineman ? `<a class="delivery-btn delivery-lineman" href="${escapeHtml(branch.lineman)}" target="_blank" rel="noopener">🛵 Lineman</a>` : "",
    branch.grab ? `<a class="delivery-btn delivery-grab" href="${escapeHtml(branch.grab)}" target="_blank" rel="noopener">🟩 Grab</a>` : "",
    branch.shopeefood ? `<a class="delivery-btn delivery-shopeefood" href="${escapeHtml(branch.shopeefood)}" target="_blank" rel="noopener">🛒 ShopeeFood</a>` : "",
    branch.robinhood ? `<a class="delivery-btn delivery-robinhood" href="${escapeHtml(branch.robinhood)}" target="_blank" rel="noopener">🐰 Robinhood</a>` : ""
  ].filter(Boolean).join("\n");

  const bodyHtml = `<section class="hero" style="min-height:30vh; background-image:url('${escapeHtml(ogImage)}')">
  <div class="container hero-content">
    <span class="hero-badge">Branch</span>
    <h1>${escapeHtml(branch.name)}</h1>
    <p>${escapeHtml(branch.address)}</p>
  </div>
</section>
<section>
  <div class="container" style="max-width:760px;">
    <div class="card branch-card" style="max-width:none;">
      <div class="card-body">
        <p>🕐 ${escapeHtml(branch.hours)}</p>
        ${branch.parkingNote ? `<p>🚗 ${escapeHtml(branch.parkingNote)}</p>` : ""}
        <p>📞 ${escapeHtml(branch.phone)}</p>
        ${branch.mapLink ? `<a class="map-link" href="${escapeHtml(branch.mapLink)}" target="_blank" rel="noopener">📍 เปิดแผนที่</a>` : ""}
        <div class="delivery-row">${deliveryButtons}</div>
      </div>
    </div>
    ${branch.seoBody ? `<div class="section-head" style="margin-top:40px;"><h2>เกี่ยวกับสาขานี้</h2></div><p style="line-height:1.8;">${escapeHtml(branch.seoBody)}</p>` : ""}
    ${renderFaq(faqItems)}
    <div style="text-align:center;margin-top:40px;">
      <a href="/branches.html" class="btn btn-navy">ดูสาขาทั้งหมด</a>
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
