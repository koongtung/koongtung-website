document.addEventListener('DOMContentLoaded', function () {
  var toggle = document.querySelector('.nav-toggle');
  var nav = document.querySelector('.main-nav');
  if (toggle && nav) {
    toggle.addEventListener('click', function () {
      nav.classList.toggle('open');
    });
  }

  var announceClose = document.querySelector('.announce-close');
  var announceBar = document.querySelector('.announce-bar');
  if (announceClose && announceBar) {
    announceClose.addEventListener('click', function () {
      announceBar.classList.add('hidden');
    });
  }
});
