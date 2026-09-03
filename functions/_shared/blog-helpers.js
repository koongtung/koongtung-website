export const SITE_URL = "https://koongtungseafood.com";
export const DEFAULT_OG_IMAGE = SITE_URL + "/assets/images/logo.jpg";

export function escapeHtml(str) {
  return String(str || "").replace(/[&<>"']/g, function (c) {
    return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
  });
}

export function resolveImageUrl(src) {
  if (!src) return DEFAULT_OG_IMAGE;
  if (src.indexOf("data:") === 0) return DEFAULT_OG_IMAGE;
  if (src.indexOf("http") === 0) return src;
  return SITE_URL + "/" + src.replace(/^\//, "");
}

export function formatThaiDate(iso) {
  var months = ["ม.ค.", "ก.พ.", "มี.ค.", "เม.ย.", "พ.ค.", "มิ.ย.", "ก.ค.", "ส.ค.", "ก.ย.", "ต.ค.", "พ.ย.", "ธ.ค."];
  var d = new Date(iso);
  if (isNaN(d.getTime())) return iso;
  return d.getDate() + " " + months[d.getMonth()] + " " + (d.getFullYear() + 543);
}

export function renderBodyHtml(body) {
  return (body || "").split(/\n\s*\n/).map(function (p) {
    return "<p>" + escapeHtml(p).replace(/\n/g, "<br>") + "</p>";
  }).join("");
}

export function renderHeader() {
  return `<div class="announce-bar" id="announceBar">
  <div class="container">
    <a href="https://liff.line.me/2000733931-wPdEZX0R/channels/5000048775/crm/member/dashboard" target="_blank" rel="noopener" data-cms-id="link-member" data-cms-link="true"><span data-cms-id="announcement-bar-text" data-i18n="announce.text">🎉 สมัคร JOIN KOONGTUNG CLUB วันนี้ รับสิทธิพิเศษทันที</span></a>
    <button type="button" class="announce-close" aria-label="ปิด">✕</button>
  </div>
</div>
<header class="site-header">
  <div class="container">
    <a href="/index.html" class="brand">
      <img src="/api/image/logo?default=/assets/images/logo.jpg" alt="KoongTung logo" data-cms-id="logo">
      <span>
        <span class="brand-name">KOONGTUNG</span>
        <span class="brand-tagline">Eat with your hands</span>
      </span>
    </a>
    <div class="lang-switch">
      <button data-lang="th">TH</button>
      <button data-lang="en">EN</button>
      <button data-lang="zh">中文</button>
    </div>
    <button class="nav-toggle" aria-label="เปิดเมนู">☰</button>
    <nav class="main-nav">
      <ul>
        <li><a href="/index.html" data-i18n="nav.home">หน้าแรก</a></li>
        <li><a href="/about.html" data-i18n="nav.about">เกี่ยวกับเรา</a></li>
        <li><a href="/branches.html" data-i18n="nav.branches">สาขา</a></li>
        <li><a href="/menu.html" data-i18n="nav.menu">เมนู</a></li>
        <li><a href="/promotion.html" data-i18n="nav.promotion">โปรโมชั่น &amp; สมาชิก</a></li>
        <li><a href="/reviews.html" data-i18n="nav.reviews">รีวิว</a></li>
        <li><a href="/contact.html" data-i18n="nav.contact">ติดต่อเรา</a></li>
        <li><a href="/links.html" data-i18n="nav.links">ลิงก์ทั้งหมด</a></li>
      </ul>
    </nav>
  </div>
</header>`;
}

export function renderFooter() {
  return `<footer class="site-footer">
  <div class="container">
    <div class="footer-grid">
      <div>
        <h4>กุ้งถัง KOONGTUNG</h4>
        <p>ร้าน Seafood Boil (ซีฟู้ดบอยล์) สไตล์อเมริกันเจ้าแรกในไทย (Bar &amp; Seafood Restaurant · California Style) ตั้งแต่ปี 2015 เสิร์ฟคู่ซอส Bang Bang ออริจินอล 100% ปรับความเผ็ดได้ตามใจคุณ</p>
        <div class="social-row">
          <a href="https://www.facebook.com/Koongtung/" target="_blank" rel="noopener" aria-label="Facebook" data-track-id="social-facebook" data-cms-id="link-facebook" data-cms-link="true">f</a>
          <a href="https://page.line.me/koongtung" target="_blank" rel="noopener" aria-label="Line" data-track-id="social-line" data-cms-id="link-line" data-cms-link="true">L</a>
        </div>
        <a href="https://liff.line.me/2000733931-wPdEZX0R/channels/5000048775/crm/member/dashboard" target="_blank" rel="noopener" class="btn-join-club" data-track-id="footer-join-club" data-cms-id="link-member" data-cms-link="true"><span data-cms-id="footer-member-btn-text">JOIN KOONGTUNG CLUB</span></a>
      </div>
      <div>
        <h4 data-i18n="footer.quicklinks">เมนูลัด</h4>
        <ul>
          <li><a href="/branches.html" data-i18n="footer.linkBranches">สาขาทั้งหมด</a></li>
          <li><a href="/menu.html" data-i18n="footer.linkMenu">เมนูอาหาร</a></li>
          <li><a href="/promotion.html" data-i18n="footer.linkPromo">โปรโมชั่น</a></li>
          <li><a href="/contact.html" data-i18n="footer.linkContact">ติดต่อเรา</a></li>
        </ul>
      </div>
      <div>
        <h4 data-i18n="footer.contactTitle">ติดต่อ</h4>
        <ul>
          <li>โทร 086-761-5558</li>
          <li>Line: @koongtung</li>
          <li>Facebook: กุ้งถัง - Koongtung</li>
        </ul>
      </div>
    </div>
    <div class="footer-bottom">
      Copyright © 2015 KOONGTUNG Co.,Ltd. All rights reserved.
    </div>
  </div>
</footer>
<script src="/js/main.js?v=2"></script>
<script src="/js/cms.js?v=4"></script>
<script src="/js/track.js"></script>
<script src="/js/i18n.js?v=3"></script>`;
}

export function renderPageShell(headExtra, bodyHtml) {
  return `<!DOCTYPE html>
<html lang="th">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
${headExtra}
<link rel="icon" href="/assets/images/logo.jpg">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link href="https://fonts.googleapis.com/css2?family=Kanit:wght@300;400;500;600;700;800&display=swap" rel="stylesheet">
<link rel="stylesheet" href="/css/style.css?v=11">
</head>
<body>
${renderHeader()}
${bodyHtml}
${renderFooter()}
</body>
</html>`;
}

export async function getBlogPosts(env) {
  const raw = await env.CONTENT.get("blog-posts");
  return raw ? JSON.parse(raw) : [];
}

export async function getOverrides(env) {
  const raw = await env.CONTENT.get("overrides");
  return raw ? JSON.parse(raw) : {};
}
