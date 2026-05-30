(function () {
    const menuButton = document.querySelector(".js-menu-button");
    const mobileMenu = document.querySelector(".js-mobile-menu");

    if (menuButton && mobileMenu) {
        menuButton.addEventListener("click", function () {
            mobileMenu.classList.toggle("is-open");
            const open = mobileMenu.classList.contains("is-open");
            menuButton.setAttribute("aria-expanded", open ? "true" : "false");
        });
    }

    document.querySelectorAll(".js-hero").forEach(function (hero) {
        const slides = Array.from(hero.querySelectorAll(".hero-slide"));
        const dots = Array.from(hero.querySelectorAll(".hero-dot"));
        let activeIndex = 0;

        function activate(index) {
            if (!slides.length) {
                return;
            }

            activeIndex = (index + slides.length) % slides.length;
            slides.forEach(function (slide, slideIndex) {
                slide.classList.toggle("is-active", slideIndex === activeIndex);
            });
            dots.forEach(function (dot, dotIndex) {
                dot.classList.toggle("is-active", dotIndex === activeIndex);
                dot.setAttribute("aria-selected", dotIndex === activeIndex ? "true" : "false");
            });
        }

        dots.forEach(function (dot, dotIndex) {
            dot.addEventListener("click", function () {
                activate(dotIndex);
            });
        });

        if (slides.length > 1) {
            window.setInterval(function () {
                activate(activeIndex + 1);
            }, 5200);
        }
    });

    document.querySelectorAll(".js-filter-panel").forEach(function (panel) {
        const input = panel.querySelector(".js-filter-input");
        const typeSelect = panel.querySelector(".js-filter-type");
        const cards = Array.from(panel.querySelectorAll(".movie-card"));
        const emptyState = panel.querySelector(".js-empty-state");

        function normalize(value) {
            return (value || "").toString().trim().toLowerCase();
        }

        function filterCards() {
            const keyword = normalize(input ? input.value : "");
            const typeValue = normalize(typeSelect ? typeSelect.value : "");
            let visibleCount = 0;

            cards.forEach(function (card) {
                const haystack = normalize([
                    card.dataset.title,
                    card.dataset.year,
                    card.dataset.type,
                    card.dataset.region,
                    card.dataset.genre,
                    card.dataset.tags
                ].join(" "));
                const typeMatch = !typeValue || normalize(card.dataset.type) === typeValue;
                const keywordMatch = !keyword || haystack.indexOf(keyword) !== -1;
                const matched = typeMatch && keywordMatch;

                card.style.display = matched ? "" : "none";
                if (matched) {
                    visibleCount += 1;
                }
            });

            if (emptyState) {
                emptyState.classList.toggle("is-visible", visibleCount === 0);
            }
        }

        if (input) {
            input.addEventListener("input", filterCards);
        }
        if (typeSelect) {
            typeSelect.addEventListener("change", filterCards);
        }
    });
})();
