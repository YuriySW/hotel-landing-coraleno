(function () {
  var AGE_KEY = 'crl_age_ok';
  var COOKIE_KEY = 'crl_cookie_ok';
  var AGE_COOKIE = 'crl_age=1';
  var html = document.documentElement;

  html.classList.add('crl-js');

  function verified() {
    try {
      if (localStorage.getItem(AGE_KEY) === '1') return true;
    } catch (e) {}
    try {
      return document.cookie.split(';').some(function (c) {
        return c.trim().indexOf(AGE_COOKIE) === 0;
      });
    } catch (e2) {
      return false;
    }
  }

  if (verified()) {
    html.classList.remove('crl-pending');
    html.classList.add('crl-ok');
  } else {
    html.classList.add('crl-pending');
    html.classList.remove('crl-ok');
  }

  function ready(fn) {
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', fn);
    else fn();
  }

  function showCookie() {
    var banner = document.querySelector('.crl-cookie');
    if (!banner) return;
    try {
      if (localStorage.getItem(COOKIE_KEY) === '1') return;
    } catch (e) {}
    banner.classList.add('is-visible');
    var accept = banner.querySelector('[data-crl-cookie]');
    if (accept) {
      accept.addEventListener('click', function () {
        try { localStorage.setItem(COOKIE_KEY, '1'); } catch (e) {}
        banner.classList.remove('is-visible');
      });
    }
  }

  ready(function () {
    var yes = document.querySelector('[data-crl-yes]');
    var no = document.querySelector('[data-crl-no]');
    var gate = document.querySelector('.crl-gate');

    if (verified()) {
      html.classList.remove('crl-pending');
      html.classList.add('crl-ok');
      if (gate) gate.setAttribute('hidden', '');
      showCookie();
      return;
    }

    if (yes) {
      yes.addEventListener('click', function () {
        try { localStorage.setItem(AGE_KEY, '1'); } catch (e) {}
        try {
          document.cookie = 'crl_age=1;path=/;max-age=31536000;SameSite=Lax';
        } catch (e2) {}
        html.classList.remove('crl-pending');
        html.classList.add('crl-ok');
        if (gate) gate.setAttribute('hidden', '');
        showCookie();
      });
    }

    if (no) {
      no.addEventListener('click', function (e) {
        e.preventDefault();
        window.location.assign('denied.html');
      });
    }
  });
})();
