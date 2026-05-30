(function () {
  function normalize(value) {
    return (value || '').toString().trim().toLowerCase();
  }

  function initMenu() {
    var toggle = document.querySelector('[data-menu-toggle]');
    var nav = document.querySelector('[data-site-nav]');
    if (!toggle || !nav) {
      return;
    }
    toggle.addEventListener('click', function () {
      nav.classList.toggle('is-open');
    });
  }

  function initHero() {
    var hero = document.querySelector('[data-hero]');
    if (!hero) {
      return;
    }
    var slides = Array.prototype.slice.call(hero.querySelectorAll('[data-hero-slide]'));
    var dots = Array.prototype.slice.call(hero.querySelectorAll('[data-hero-dot]'));
    if (slides.length <= 1) {
      return;
    }
    var current = 0;

    function show(index) {
      current = (index + slides.length) % slides.length;
      slides.forEach(function (slide, slideIndex) {
        slide.classList.toggle('is-active', slideIndex === current);
      });
      dots.forEach(function (dot, dotIndex) {
        dot.classList.toggle('is-active', dotIndex === current);
      });
    }

    dots.forEach(function (dot, index) {
      dot.addEventListener('click', function () {
        show(index);
      });
    });

    setInterval(function () {
      show(current + 1);
    }, 5600);
  }

  function fieldValue(form, selector) {
    var field = form.querySelector(selector);
    return field ? normalize(field.value) : '';
  }

  function initFilters() {
    var form = document.querySelector('.js-card-filter-form');
    var grid = document.querySelector('[data-filter-grid]');
    if (!form || !grid) {
      return;
    }
    var cards = Array.prototype.slice.call(grid.querySelectorAll('.movie-card'));
    var result = document.querySelector('[data-result-count]');
    var params = new URLSearchParams(window.location.search);
    var paramMap = {
      q: '[data-filter-query]',
      region: '[data-filter-region]',
      type: '[data-filter-type]',
      year: '[data-filter-year]',
      category: '[data-filter-category]',
      tag: '[data-filter-query]'
    };

    Object.keys(paramMap).forEach(function (key) {
      var value = params.get(key);
      var field = form.querySelector(paramMap[key]);
      if (field && value) {
        field.value = value;
      }
    });

    function apply() {
      var q = fieldValue(form, '[data-filter-query]');
      var region = fieldValue(form, '[data-filter-region]');
      var type = fieldValue(form, '[data-filter-type]');
      var year = fieldValue(form, '[data-filter-year]');
      var category = fieldValue(form, '[data-filter-category]');
      var count = 0;

      cards.forEach(function (card) {
        var title = normalize(card.getAttribute('data-title'));
        var cardRegion = normalize(card.getAttribute('data-region'));
        var cardType = normalize(card.getAttribute('data-type'));
        var cardYear = normalize(card.getAttribute('data-year'));
        var cardCategory = normalize(card.getAttribute('data-category'));
        var cardTags = normalize(card.getAttribute('data-tags'));
        var text = normalize(card.textContent) + ' ' + cardTags;
        var matched = true;

        if (q && text.indexOf(q) === -1 && title.indexOf(q) === -1) {
          matched = false;
        }
        if (region && cardRegion !== region) {
          matched = false;
        }
        if (type && cardType !== type) {
          matched = false;
        }
        if (year && cardYear !== year) {
          matched = false;
        }
        if (category && cardCategory !== category) {
          matched = false;
        }

        card.classList.toggle('is-hidden', !matched);
        if (matched) {
          count += 1;
        }
      });

      if (result) {
        result.textContent = '当前显示 ' + count + ' 部影片';
      }
    }

    form.addEventListener('input', apply);
    form.addEventListener('change', apply);
    form.addEventListener('reset', function () {
      setTimeout(apply, 0);
    });
    apply();
  }

  document.addEventListener('DOMContentLoaded', function () {
    initMenu();
    initHero();
    initFilters();
  });
})();
