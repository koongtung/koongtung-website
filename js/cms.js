(function () {
  fetch('/api/content', { cache: 'no-store' })
    .then(function (res) { return res.ok ? res.json() : {}; })
    .then(function (overrides) {
      Object.keys(overrides).forEach(function (id) {
        var value = overrides[id];
        document.querySelectorAll('[data-cms-id="' + id + '"]').forEach(function (el) {
          if (el.hasAttribute('data-cms-link')) {
            el.href = value;
          } else if (el.tagName === 'IMG') {
            el.src = value;
          } else if (el.hasAttribute('data-cms-bg')) {
            el.style.backgroundImage = "url('" + value + "')";
          } else {
            el.textContent = value;
          }
        });
      });
    })
    .catch(function () { /* if it fails, page just shows default content */ });
})();
