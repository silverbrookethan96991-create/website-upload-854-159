(function () {
    var body = document.body;
    var toggle = document.querySelector('.mobile-toggle');
    if (toggle) {
        toggle.addEventListener('click', function () {
            body.classList.toggle('nav-open');
        });
    }

    var slides = Array.prototype.slice.call(document.querySelectorAll('.hero-slide'));
    var dots = Array.prototype.slice.call(document.querySelectorAll('.hero-dot'));
    var active = 0;
    var timer = null;

    function showSlide(index) {
        if (!slides.length) {
            return;
        }
        active = (index + slides.length) % slides.length;
        slides.forEach(function (slide, i) {
            slide.classList.toggle('active', i === active);
        });
        dots.forEach(function (dot, i) {
            dot.classList.toggle('active', i === active);
        });
    }

    function startHero() {
        if (!slides.length) {
            return;
        }
        clearInterval(timer);
        timer = setInterval(function () {
            showSlide(active + 1);
        }, 5600);
    }

    dots.forEach(function (dot, i) {
        dot.addEventListener('click', function () {
            showSlide(i);
            startHero();
        });
    });

    showSlide(0);
    startHero();

    var searchInput = document.querySelector('.js-search');
    var yearSelect = document.querySelector('.js-filter-year');
    var typeSelect = document.querySelector('.js-filter-type');
    var cards = Array.prototype.slice.call(document.querySelectorAll('.movie-card[data-search]'));
    var empty = document.querySelector('.empty-state');

    function applyFilter() {
        if (!cards.length) {
            return;
        }
        var keyword = searchInput ? searchInput.value.trim().toLowerCase() : '';
        var year = yearSelect ? yearSelect.value : '';
        var type = typeSelect ? typeSelect.value : '';
        var shown = 0;
        cards.forEach(function (card) {
            var text = (card.getAttribute('data-search') || '').toLowerCase();
            var cardYear = card.getAttribute('data-year') || '';
            var cardType = card.getAttribute('data-type') || '';
            var ok = true;
            if (keyword && text.indexOf(keyword) === -1) {
                ok = false;
            }
            if (year && cardYear !== year) {
                ok = false;
            }
            if (type && cardType !== type) {
                ok = false;
            }
            card.style.display = ok ? '' : 'none';
            if (ok) {
                shown += 1;
            }
        });
        if (empty) {
            empty.classList.toggle('show', shown === 0);
        }
    }

    [searchInput, yearSelect, typeSelect].forEach(function (el) {
        if (el) {
            el.addEventListener('input', applyFilter);
            el.addEventListener('change', applyFilter);
        }
    });
})();
