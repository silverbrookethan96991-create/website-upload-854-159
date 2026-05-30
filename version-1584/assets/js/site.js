(function () {
  function normalize(value) {
    return String(value || '').toLowerCase().trim();
  }

  function setupMenu() {
    var toggle = document.querySelector('[data-menu-toggle]');
    var mobileNav = document.querySelector('[data-mobile-nav]');
    if (!toggle || !mobileNav) {
      return;
    }
    toggle.addEventListener('click', function () {
      mobileNav.classList.toggle('is-open');
    });
  }


  function escapeHtml(value) {
    return String(value || '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  function setupLocalFilters() {
    var cards = Array.prototype.slice.call(document.querySelectorAll('[data-movie-card]'));
    if (!cards.length) {
      return;
    }

    var inputs = Array.prototype.slice.call(document.querySelectorAll('[data-search-input], [data-filter-group], [data-filter-year], [data-filter-genre]'));
    var resultCounter = document.querySelector('[data-result-count]');

    function applyFilters() {
      var queryInput = document.querySelector('[data-search-input]');
      var groupInput = document.querySelector('[data-filter-group]');
      var yearInput = document.querySelector('[data-filter-year]');
      var genreInput = document.querySelector('[data-filter-genre]');
      var query = normalize(queryInput && queryInput.value);
      var group = normalize(groupInput && groupInput.value);
      var year = normalize(yearInput && yearInput.value);
      var genre = normalize(genreInput && genreInput.value);
      var shown = 0;

      cards.forEach(function (card) {
        var searchText = normalize(card.getAttribute('data-search'));
        var cardGroup = normalize(card.getAttribute('data-group'));
        var cardYear = normalize(card.getAttribute('data-year'));
        var cardGenre = normalize(card.getAttribute('data-genre'));
        var match = true;

        if (query && searchText.indexOf(query) === -1) {
          match = false;
        }
        if (group && cardGroup !== group) {
          match = false;
        }
        if (year && cardYear !== year) {
          match = false;
        }
        if (genre && cardGenre.indexOf(genre) === -1) {
          match = false;
        }

        card.classList.toggle('is-hidden-card', !match);
        if (match) {
          shown += 1;
        }
      });

      if (resultCounter) {
        resultCounter.textContent = '共 ' + shown + ' 部影片';
      }
    }

    inputs.forEach(function (input) {
      input.addEventListener('input', applyFilters);
      input.addEventListener('change', applyFilters);
    });

    applyFilters();
  }

  function movieCardTemplate(movie) {
    return [
      '<article class="movie-card" data-movie-card>',
      '  <a class="poster-frame" href="' + escapeHtml(movie.href) + '">',
      '    <img src="' + escapeHtml(movie.cover) + '" alt="' + escapeHtml(movie.title) + '" class="cover-image" loading="lazy" onerror="this.classList.add(\'image-missing\');" />',
      '    <span class="poster-badge">' + escapeHtml(movie.year) + '</span>',
      '    <span class="poster-play">▶</span>',
      '  </a>',
      '  <div class="movie-card-body">',
      '    <h3><a href="' + escapeHtml(movie.href) + '">' + escapeHtml(movie.title) + '</a></h3>',
      '    <p>' + escapeHtml(movie.oneLine) + '</p>',
      '    <div class="movie-meta">',
      '      <span>' + escapeHtml(movie.group) + '</span>',
      '      <span>' + escapeHtml(movie.type) + '</span>',
      '      <span>' + escapeHtml(movie.score) + '分</span>',
      '    </div>',
      '  </div>',
      '</article>'
    ].join('');
  }

  function setupGlobalSearch() {
    var results = document.getElementById('searchResults');
    if (!results || !window.MOVIE_INDEX) {
      return;
    }

    var queryInput = document.querySelector('[data-search-input]');
    var groupInput = document.querySelector('[data-filter-group]');
    var yearInput = document.querySelector('[data-filter-year]');
    var genreInput = document.querySelector('[data-filter-genre]');
    var counter = document.querySelector('[data-global-result-count]');
    var params = new URLSearchParams(window.location.search);
    var initialQuery = params.get('q');

    if (initialQuery && queryInput) {
      queryInput.value = initialQuery;
    }

    function render() {
      var query = normalize(queryInput && queryInput.value);
      var group = normalize(groupInput && groupInput.value);
      var year = normalize(yearInput && yearInput.value);
      var genre = normalize(genreInput && genreInput.value);
      var matches = window.MOVIE_INDEX.filter(function (movie) {
        if (query && normalize(movie.search).indexOf(query) === -1) {
          return false;
        }
        if (group && normalize(movie.group) !== group) {
          return false;
        }
        if (year && normalize(movie.year) !== year) {
          return false;
        }
        if (genre && normalize(movie.genre).indexOf(genre) === -1) {
          return false;
        }
        return true;
      });

      if (!query && !group && !year && !genre) {
        matches = matches.slice(0, 60);
      }

      results.innerHTML = matches.slice(0, 120).map(movieCardTemplate).join('');
      if (counter) {
        counter.textContent = '共找到 ' + matches.length + ' 部影片，当前显示 ' + Math.min(matches.length, 120) + ' 部';
      }
    }

    [queryInput, groupInput, yearInput, genreInput].forEach(function (input) {
      if (!input) {
        return;
      }
      input.addEventListener('input', render);
      input.addEventListener('change', render);
    });

    render();
  }

  function setupPlayer() {
    var video = document.querySelector('[data-hls]');
    var button = document.querySelector('[data-player-start]');
    if (!video || !button) {
      return;
    }

    var source = video.getAttribute('data-hls');
    var initialized = false;

    function showMessage(message) {
      button.classList.remove('is-hidden');
      button.textContent = message;
    }

    function initializePlayer() {
      if (!source) {
        showMessage('当前影片缺少播放源');
        return;
      }

      if (initialized) {
        video.play().catch(function () {});
        return;
      }

      initialized = true;
      button.classList.add('is-hidden');

      if (video.canPlayType('application/vnd.apple.mpegurl')) {
        video.src = source;
        video.play().catch(function () {
          showMessage('点击继续播放');
        });
        return;
      }

      if (window.Hls && window.Hls.isSupported()) {
        var hls = new window.Hls({
          enableWorker: true,
          lowLatencyMode: true
        });
        hls.loadSource(source);
        hls.attachMedia(video);
        hls.on(window.Hls.Events.MANIFEST_PARSED, function () {
          video.play().catch(function () {
            showMessage('点击继续播放');
          });
        });
        hls.on(window.Hls.Events.ERROR, function (_, data) {
          if (data && data.fatal) {
            showMessage('播放源连接失败，请刷新后重试');
          }
        });
        return;
      }

      video.src = source;
      video.play().catch(function () {
        showMessage('当前浏览器可能不支持 HLS 播放');
      });
    }

    button.addEventListener('click', initializePlayer);
    video.addEventListener('play', function () {
      button.classList.add('is-hidden');
    });
  }

  document.addEventListener('DOMContentLoaded', function () {
    setupMenu();
    setupLocalFilters();
    setupGlobalSearch();
    setupPlayer();
  });
})();
