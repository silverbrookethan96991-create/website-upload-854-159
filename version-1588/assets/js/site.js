(function () {
  function ready(callback) {
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", callback);
    } else {
      callback();
    }
  }

  ready(function () {
    var toggle = document.querySelector(".nav-toggle");
    var mobile = document.querySelector(".mobile-nav");

    if (toggle && mobile) {
      toggle.addEventListener("click", function () {
        var opened = mobile.classList.toggle("is-open");
        toggle.setAttribute("aria-expanded", opened ? "true" : "false");
      });
    }

    var slides = Array.prototype.slice.call(document.querySelectorAll(".hero-slide"));
    var dots = Array.prototype.slice.call(document.querySelectorAll(".hero-dot"));
    var prev = document.querySelector(".hero-prev");
    var next = document.querySelector(".hero-next");
    var current = 0;
    var timer = null;

    function showSlide(index) {
      if (!slides.length) {
        return;
      }

      current = (index + slides.length) % slides.length;

      slides.forEach(function (slide, slideIndex) {
        slide.classList.toggle("is-active", slideIndex === current);
      });

      dots.forEach(function (dot, dotIndex) {
        dot.classList.toggle("is-active", dotIndex === current);
      });
    }

    function play() {
      if (timer) {
        window.clearInterval(timer);
      }

      if (slides.length > 1) {
        timer = window.setInterval(function () {
          showSlide(current + 1);
        }, 5200);
      }
    }

    if (prev) {
      prev.addEventListener("click", function () {
        showSlide(current - 1);
        play();
      });
    }

    if (next) {
      next.addEventListener("click", function () {
        showSlide(current + 1);
        play();
      });
    }

    dots.forEach(function (dot, index) {
      dot.addEventListener("click", function () {
        showSlide(index);
        play();
      });
    });

    showSlide(0);
    play();

    var input = document.getElementById("movieSearch");
    var clear = document.getElementById("clearSearch");
    var grid = document.querySelector(".searchable-grid");
    var empty = document.querySelector(".no-results");

    function filterMovies() {
      if (!input || !grid) {
        return;
      }

      var value = input.value.trim().toLowerCase();
      var cards = Array.prototype.slice.call(grid.querySelectorAll(".movie-card, .rank-row"));
      var visible = 0;

      cards.forEach(function (card) {
        var text = (card.getAttribute("data-search") || card.textContent || "").toLowerCase();
        var matched = !value || text.indexOf(value) !== -1;
        card.style.display = matched ? "" : "none";
        if (matched) {
          visible += 1;
        }
      });

      if (empty) {
        empty.classList.toggle("is-visible", visible === 0);
      }
    }

    if (input) {
      input.addEventListener("input", filterMovies);
    }

    if (clear && input) {
      clear.addEventListener("click", function () {
        input.value = "";
        filterMovies();
        input.focus();
      });
    }
  });
})();
