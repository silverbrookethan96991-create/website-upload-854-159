(function () {
  function ready(callback) {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', callback);
    } else {
      callback();
    }
  }

  function initMenu() {
    var button = document.querySelector('[data-menu-button]');
    if (!button) {
      return;
    }
    button.addEventListener('click', function () {
      var open = document.body.classList.toggle('menu-open');
      button.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
  }

  function initHero() {
    var slider = document.querySelector('[data-hero-slider]');
    if (!slider) {
      return;
    }
    var slides = Array.prototype.slice.call(slider.querySelectorAll('[data-hero-slide]'));
    var dots = Array.prototype.slice.call(slider.querySelectorAll('[data-hero-dot]'));
    var prev = slider.querySelector('[data-hero-prev]');
    var next = slider.querySelector('[data-hero-next]');
    var index = 0;
    var timer = null;

    function show(nextIndex) {
      if (!slides.length) {
        return;
      }
      index = (nextIndex + slides.length) % slides.length;
      slides.forEach(function (slide, slideIndex) {
        slide.classList.toggle('is-active', slideIndex === index);
      });
      dots.forEach(function (dot, dotIndex) {
        dot.classList.toggle('is-active', dotIndex === index);
      });
    }

    function start() {
      stop();
      timer = window.setInterval(function () {
        show(index + 1);
      }, 5200);
    }

    function stop() {
      if (timer) {
        window.clearInterval(timer);
        timer = null;
      }
    }

    if (prev) {
      prev.addEventListener('click', function () {
        show(index - 1);
        start();
      });
    }

    if (next) {
      next.addEventListener('click', function () {
        show(index + 1);
        start();
      });
    }

    dots.forEach(function (dot) {
      dot.addEventListener('click', function () {
        show(Number(dot.getAttribute('data-hero-dot')) || 0);
        start();
      });
    });

    slider.addEventListener('mouseenter', stop);
    slider.addEventListener('mouseleave', start);
    show(0);
    start();
  }

  function movieCard(movie) {
    var tags = [movie.year, movie.region, movie.type].filter(Boolean).map(function (item) {
      return '<span>' + escapeHtml(item) + '</span>';
    }).join('');
    return [
      '<article class="movie-card">',
      '  <a class="poster-link" href="' + movie.url + '">',
      '    <img src="' + movie.cover + '" alt="' + escapeHtml(movie.title) + '" loading="lazy">',
      '    <span class="play-badge">立即播放</span>',
      '    <span class="poster-gradient"></span>',
      '  </a>',
      '  <h3><a href="' + movie.url + '">' + escapeHtml(movie.title) + '</a></h3>',
      '  <p>' + escapeHtml(movie.oneLine || '') + '</p>',
      '  <div class="movie-meta">' + tags + '</div>',
      '</article>'
    ].join('');
  }

  function escapeHtml(value) {
    return String(value || '').replace(/[&<>"]/g, function (char) {
      return {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;'
      }[char];
    });
  }

  function initSearch() {
    var form = document.querySelector('[data-search-form]');
    var input = document.querySelector('[data-search-input]');
    var results = document.querySelector('[data-search-results]');
    var count = document.querySelector('[data-search-count]');
    var title = document.querySelector('[data-search-title]');
    if (!form || !input || !results || !window.MOVIE_SEARCH_INDEX) {
      return;
    }

    var params = new URLSearchParams(window.location.search);
    var initialQuery = params.get('q') || '';
    if (initialQuery) {
      input.value = initialQuery;
      search(initialQuery);
    }

    form.addEventListener('submit', function (event) {
      event.preventDefault();
      search(input.value);
    });

    input.addEventListener('input', function () {
      search(input.value);
    });

    function search(query) {
      var words = String(query || '').trim().toLowerCase().split(/\s+/).filter(Boolean);
      if (!words.length) {
        if (count) {
          count.textContent = '输入关键词后显示匹配结果';
        }
        if (title) {
          title.textContent = '热门搜索推荐';
        }
        return;
      }
      var matched = window.MOVIE_SEARCH_INDEX.filter(function (movie) {
        var haystack = [movie.title, movie.year, movie.region, movie.type, movie.genre, (movie.tags || []).join(' '), movie.oneLine].join(' ').toLowerCase();
        return words.every(function (word) {
          return haystack.indexOf(word) !== -1;
        });
      }).slice(0, 72);
      results.innerHTML = matched.map(movieCard).join('');
      if (count) {
        count.textContent = '找到 ' + matched.length + ' 条匹配影片';
      }
      if (title) {
        title.textContent = '搜索结果';
      }
    }
  }

  function initScrollToPlayer() {
    var links = document.querySelectorAll('[data-scroll-player]');
    if (!links.length) {
      return;
    }
    links.forEach(function (link) {
      link.addEventListener('click', function (event) {
        var player = document.querySelector('[data-player]');
        if (!player) {
          return;
        }
        event.preventDefault();
        player.scrollIntoView({ behavior: 'smooth', block: 'center' });
      });
    });
  }

  ready(function () {
    initMenu();
    initHero();
    initSearch();
    initScrollToPlayer();
  });
})();
