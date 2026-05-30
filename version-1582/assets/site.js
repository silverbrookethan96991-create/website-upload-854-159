(function () {
  function ready(callback) {
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", callback);
      return;
    }
    callback();
  }

  ready(function () {
    var toggle = document.querySelector("[data-menu-toggle]");
    var nav = document.querySelector("[data-mobile-nav]");
    if (toggle && nav) {
      toggle.addEventListener("click", function () {
        nav.classList.toggle("open");
      });
    }

    var hero = document.querySelector("[data-hero]");
    if (hero) {
      var slides = Array.prototype.slice.call(hero.querySelectorAll("[data-hero-slide]"));
      var dots = Array.prototype.slice.call(hero.querySelectorAll("[data-hero-dot]"));
      var prev = hero.querySelector("[data-hero-prev]");
      var next = hero.querySelector("[data-hero-next]");
      var active = 0;
      var timer = null;

      function show(index) {
        if (!slides.length) {
          return;
        }
        active = (index + slides.length) % slides.length;
        slides.forEach(function (slide, idx) {
          slide.classList.toggle("active", idx === active);
        });
        dots.forEach(function (dot, idx) {
          dot.classList.toggle("active", idx === active);
        });
      }

      function start() {
        stop();
        timer = window.setInterval(function () {
          show(active + 1);
        }, 5000);
      }

      function stop() {
        if (timer) {
          window.clearInterval(timer);
        }
      }

      if (prev) {
        prev.addEventListener("click", function () {
          show(active - 1);
          start();
        });
      }
      if (next) {
        next.addEventListener("click", function () {
          show(active + 1);
          start();
        });
      }
      dots.forEach(function (dot, idx) {
        dot.addEventListener("click", function () {
          show(idx);
          start();
        });
      });
      hero.addEventListener("mouseenter", stop);
      hero.addEventListener("mouseleave", start);
      show(0);
      start();
    }

    document.querySelectorAll("[data-filter-scope]").forEach(function (scope) {
      var input = scope.querySelector("[data-filter-input]");
      var chips = Array.prototype.slice.call(scope.querySelectorAll("[data-filter-value]"));
      var items = Array.prototype.slice.call(scope.querySelectorAll("[data-filter-item]"));
      var activeType = "all";

      if (scope.hasAttribute("data-query-page") && input) {
        var params = new URLSearchParams(window.location.search);
        var query = params.get("q") || "";
        input.value = query;
      }

      function normalize(value) {
        return String(value || "").trim().toLowerCase();
      }

      function apply() {
        var q = normalize(input ? input.value : "");
        items.forEach(function (item) {
          var text = normalize(item.getAttribute("data-search"));
          var type = normalize(item.getAttribute("data-type"));
          var matchText = !q || text.indexOf(q) !== -1;
          var matchType = activeType === "all" || type.indexOf(normalize(activeType)) !== -1 || text.indexOf(normalize(activeType)) !== -1;
          item.classList.toggle("is-hidden", !(matchText && matchType));
        });
      }

      if (input) {
        input.addEventListener("input", apply);
      }
      chips.forEach(function (chip) {
        chip.addEventListener("click", function () {
          activeType = chip.getAttribute("data-filter-value") || "all";
          chips.forEach(function (item) {
            item.classList.toggle("active", item === chip);
          });
          apply();
        });
      });
      apply();
    });
  });
})();
