function koongtungToYouTubeEmbed(url) {
  if (!url) return null;
  var idMatch = url.match(/(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/);
  if (!idMatch) return null;
  var id = idMatch[1];
  var params = [];
  var tMatch = url.match(/[?&]t=(\d+)/);
  if (tMatch) params.push('start=' + tMatch[1]);
  return 'https://www.youtube.com/embed/' + id + (params.length ? '?' + params.join('&') : '');
}

function koongtungLoadGA4(measurementId) {
  if (!measurementId || window.__koongtungGaLoaded) return;
  window.__koongtungGaLoaded = true;
  var script = document.createElement('script');
  script.async = true;
  script.src = 'https://www.googletagmanager.com/gtag/js?id=' + encodeURIComponent(measurementId);
  document.head.appendChild(script);
  window.dataLayer = window.dataLayer || [];
  function gtag() { window.dataLayer.push(arguments); }
  window.gtag = gtag;
  gtag('js', new Date());
  gtag('config', measurementId);
}

(function () {
  fetch('/api/content', { cache: 'no-store' })
    .then(function (res) { return res.ok ? res.json() : {}; })
    .then(function (overrides) {
      Object.keys(overrides).forEach(function (id) {
        var value = overrides[id];
        document.querySelectorAll('[data-cms-id="' + id + '"]').forEach(function (el) {
          if (el.hasAttribute('data-cms-video')) {
            el.src = koongtungToYouTubeEmbed(value) || value;
          } else if (el.hasAttribute('data-cms-link')) {
            el.href = value;
          } else if (el.tagName === 'IMG' || el.hasAttribute('data-cms-bg')) {
            // Single-image fields (hero backgrounds, card photos, etc.) no
            // longer route through here — they're served directly by
            // /api/image/:id so the correct version renders from the very
            // first paint, with no client-side swap and no flash of an old
            // image. This branch only remains as a harmless fallback for any
            // legacy override that might still exist in the overrides blob.
            if (el.tagName === 'IMG') el.src = value;
            else el.style.backgroundImage = "url('" + value + "')";
          } else {
            el.textContent = value;
            // If this element is also a translated (data-i18n) field, refresh
            // its cached "original Thai" text to this new CMS value. i18n.js
            // caches that text the first time it runs — which happens before
            // this fetch resolves — so without this refresh, re-applying the
            // saved language just below would restore the stale pre-override
            // default and silently wipe out the admin's edit.
            if (el.hasAttribute('data-i18n')) {
              el.setAttribute('data-i18n-original', value);
            }
          }
        });
      });
      koongtungLoadGA4(overrides['ga4-measurement-id']);

      // Re-apply the user's selected language on top of the freshly-loaded CMS
      // overrides. Without this, a non-Thai override arriving after i18n.js has
      // already run would silently flash Thai text back into an EN/ZH page.
      if (typeof koongtungApplyLanguage === 'function') {
        koongtungApplyLanguage(localStorage.getItem('koongtung-lang') || 'th');
      }
    })
    .catch(function () { /* if it fails, page just shows default content */ });
})();
