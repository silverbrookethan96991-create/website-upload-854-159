(function () {
  function qs(selector, scope) {
    return (scope || document).querySelector(selector);
  }

  function qsa(selector, scope) {
    return Array.prototype.slice.call((scope || document).querySelectorAll(selector));
  }

  function setupMenu() {
    var toggle = qs('.nav-toggle');
    var menu = qs('.mobile-nav');
    if (!toggle || !menu) {
      return;
    }

    toggle.addEventListener('click', function () {
      var open = menu.hasAttribute('hidden');
      if (open) {
        menu.removeAttribute('hidden');
      } else {
        menu.setAttribute('hidden', '');
      }
      toggle.setAttribute('aria-expanded', String(open));
    });
  }

  function setupHero() {
    var hero = qs('[data-hero]');
    if (!hero) {
      return;
    }

    var slides = qsa('.hero-slide', hero);
    var dots = qsa('[data-hero-dot]', hero);
    var prev = qs('[data-hero-prev]', hero);
    var next = qs('[data-hero-next]', hero);
    var index = 0;
    var timer = null;

    function show(nextIndex) {
      index = (nextIndex + slides.length) % slides.length;
      slides.forEach(function (slide, i) {
        slide.classList.toggle('is-active', i === index);
      });
      dots.forEach(function (dot, i) {
        dot.classList.toggle('is-active', i === index);
      });
    }

    function restart() {
      if (timer) {
        window.clearInterval(timer);
      }
      timer = window.setInterval(function () {
        show(index + 1);
      }, 5200);
    }

    dots.forEach(function (dot) {
      dot.addEventListener('click', function () {
        show(Number(dot.getAttribute('data-hero-dot')) || 0);
        restart();
      });
    });

    if (prev) {
      prev.addEventListener('click', function () {
        show(index - 1);
        restart();
      });
    }

    if (next) {
      next.addEventListener('click', function () {
        show(index + 1);
        restart();
      });
    }

    restart();
  }

  function setupFilters() {
    var input = qs('[data-filter-input]');
    var list = qs('[data-filter-list]');
    if (!input || !list) {
      return;
    }

    var cards = qsa('[data-search]', list);
    var empty = qs('[data-empty-state]');
    var params = new URLSearchParams(window.location.search);
    var q = params.get('q') || '';

    if (input.hasAttribute('data-query-sync') && q) {
      input.value = q;
    }

    function apply() {
      var term = input.value.trim().toLowerCase();
      var visible = 0;
      cards.forEach(function (card) {
        var text = card.getAttribute('data-search') || '';
        var match = !term || text.indexOf(term) !== -1;
        card.hidden = !match;
        if (match) {
          visible += 1;
        }
      });
      if (empty) {
        empty.hidden = visible !== 0;
      }
    }

    input.addEventListener('input', apply);
    apply();
  }

  document.addEventListener('DOMContentLoaded', function () {
    setupMenu();
    setupHero();
    setupFilters();
  });
})();
