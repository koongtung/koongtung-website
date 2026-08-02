(function () {
  document.addEventListener('click', function (e) {
    var el = e.target.closest('[data-track-id]');
    if (!el) return;
    var id = el.getAttribute('data-track-id');
    var payload = JSON.stringify({ id: id });
    if (navigator.sendBeacon) {
      navigator.sendBeacon('/api/track', new Blob([payload], { type: 'application/json' }));
    } else {
      fetch('/api/track', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: payload, keepalive: true });
    }
  }, true);
})();
