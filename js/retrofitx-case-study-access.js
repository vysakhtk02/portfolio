/**
 * RetrofitX case study — passphrase gate (edit before production).
 * Loaded only by retrofitx-case-study.html. Links from the portfolio go here; the page
 * always shows the gate until the correct passphrase is submitted (no bypass in static HTML).
 */
(function () {
  var RETROFITX_CASE_PASSWORD = 'RetrofitX-Portfolio-2026';

  function initCaseStudyPage() {
    var obs = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (e) {
          if (e.isIntersecting) {
            e.target.classList.add('in');
            obs.unobserve(e.target);
          }
        });
      },
      { threshold: 0.08, rootMargin: '0px 0px -28px 0px' }
    );

    function observeAllReveals() {
      document.querySelectorAll('.reveal').forEach(function (el) {
        obs.observe(el);
      });
    }

    function unlockCaseStudy() {
      var fullGate = document.getElementById('retrofitx-full-gate');
      var main = document.getElementById('retrofitx-main');
      if (fullGate) {
        fullGate.hidden = true;
        fullGate.setAttribute('aria-hidden', 'true');
      }
      if (main) {
        main.classList.remove('retrofitx-main--locked');
      }
      document.body.classList.remove('retrofitx-body--locked');
      document.documentElement.classList.remove('retrofitx-locked');
      observeAllReveals();
    }

    var form = document.getElementById('retrofitx-full-gate-form');
    var err = document.getElementById('retrofitx-full-gate-error');
    var input = document.getElementById('retrofitx-full-pass');
    if (!form || !input) return;

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      if (err) err.hidden = true;
      var v = (input.value || '').trim();
      if (v && v === RETROFITX_CASE_PASSWORD) {
        input.value = '';
        unlockCaseStudy();
      } else if (err) {
        err.hidden = false;
      }
    });
  }

  function boot() {
    if (document.getElementById('retrofitx-full-gate')) {
      initCaseStudyPage();
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }
})();
