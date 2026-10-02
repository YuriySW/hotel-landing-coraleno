(function () {
  function ready(fn) {
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', fn);
    else fn();
  }

  ready(function () {
    var form = document.getElementById('crl-contact');
    if (!form) return;

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      if (!form.checkValidity()) {
        form.reportValidity();
        return;
      }

      var button = form.querySelector('button[type="submit"]');
      if (button) button.disabled = true;

      fetch(form.getAttribute('action') || '/send.php', {
        method: 'POST',
        body: new FormData(form),
        headers: { Accept: 'application/json' }
      })
        .then(function (res) {
          window.location.href = res.ok ? '/thanks.html' : '/contact.html';
        })
        .catch(function () {
          if (button) button.disabled = false;
          form.submit();
        });
    });
  });
})();
