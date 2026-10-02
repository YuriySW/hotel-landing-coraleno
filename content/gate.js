(function () {
  function ready(fn) {
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', fn);
    else fn();
  }

  ready(function () {
    var burger = document.querySelector('.crl-burger');
    var nav = document.querySelector('.crl-nav');
    if (burger && nav) {
      burger.addEventListener('click', function () {
        var open = nav.classList.toggle('is-open');
        burger.classList.toggle('is-open', open);
        burger.setAttribute('aria-expanded', open ? 'true' : 'false');
        burger.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
        var icon = burger.querySelector('i') || burger.firstElementChild;
        if (icon) icon.className = open ? 'ti ti-x' : 'ti ti-menu-2';
        document.body.style.overflow = open ? 'hidden' : '';
      });
      nav.querySelectorAll('a').forEach(function (a) {
        a.addEventListener('click', function () {
          nav.classList.remove('is-open');
          burger.classList.remove('is-open');
          burger.setAttribute('aria-expanded', 'false');
          var icon = burger.querySelector('i') || burger.firstElementChild;
          if (icon) icon.className = 'ti ti-menu-2';
          document.body.style.overflow = '';
        });
      });
      window.addEventListener('resize', function () {
        if (window.innerWidth > 1040) {
          nav.classList.remove('is-open');
          burger.classList.remove('is-open');
          document.body.style.overflow = '';
        }
      });
    }

    var year = document.querySelectorAll('[data-crl-year]');
    for (var i = 0; i < year.length; i++) year[i].textContent = new Date().getFullYear();

    var reveals = document.querySelectorAll('.crl-reveal');
    if (reveals.length && 'IntersectionObserver' in window) {
      var io = new IntersectionObserver(
        function (entries) {
          entries.forEach(function (e) {
            if (e.isIntersecting) {
              e.target.classList.add('is-in');
              io.unobserve(e.target);
            }
          });
        },
        { threshold: 0.12 }
      );
      reveals.forEach(function (el) {
        io.observe(el);
      });
    } else {
      reveals.forEach(function (el) {
        el.classList.add('is-in');
      });
    }

    var strip = document.querySelector('[data-crl-strip]');
    if (strip) {
      var bar = document.querySelector('[data-crl-meter]');
      var prev = document.querySelector('[data-crl-prev]');
      var next = document.querySelector('[data-crl-next]');

      var update = function () {
        if (!bar) return;
        var max = strip.scrollWidth - strip.clientWidth;
        var share = strip.clientWidth / strip.scrollWidth;
        var pos = max > 0 ? strip.scrollLeft / max : 0;
        bar.style.width = Math.max(share * 100, 12) + '%';
        bar.style.marginLeft = pos * (100 - Math.max(share * 100, 12)) + '%';
      };

      var step = function (dir) {
        var card = strip.querySelector('.crl-card');
        var w = card ? card.getBoundingClientRect().width + 24 : 320;
        strip.scrollBy({ left: dir * w, behavior: 'smooth' });
      };

      if (prev) prev.addEventListener('click', function () { step(-1); });
      if (next) next.addEventListener('click', function () { step(1); });
      strip.addEventListener('scroll', update, { passive: true });
      window.addEventListener('resize', update);
      update();

      var down = false;
      var startX = 0;
      var startLeft = 0;
      var moved = false;

      strip.addEventListener('pointerdown', function (e) {
        if (e.pointerType !== 'mouse') return;
        down = true;
        moved = false;
        startX = e.clientX;
        startLeft = strip.scrollLeft;
      });

      window.addEventListener('pointermove', function (e) {
        if (!down) return;
        var dx = e.clientX - startX;
        if (Math.abs(dx) > 4) {
          moved = true;
          strip.classList.add('is-drag');
        }
        strip.scrollLeft = startLeft - dx;
      });

      window.addEventListener('pointerup', function () {
        if (!down) return;
        down = false;
        strip.classList.remove('is-drag');
      });

      strip.addEventListener('click', function (e) {
        if (moved) {
          e.preventDefault();
          moved = false;
        }
      }, true);
    }
  });
})();
