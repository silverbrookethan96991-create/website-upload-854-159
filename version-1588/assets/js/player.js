(function () {
  function ready(callback) {
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", callback);
    } else {
      callback();
    }
  }

  function attachStream(video, url) {
    if (!video || !url || video.dataset.ready === "1") {
      return;
    }

    video.dataset.ready = "1";

    if (video.canPlayType("application/vnd.apple.mpegurl")) {
      video.src = url;
      return;
    }

    if (window.Hls && window.Hls.isSupported()) {
      var hls = new window.Hls({
        enableWorker: true,
        lowLatencyMode: true
      });
      hls.loadSource(url);
      hls.attachMedia(video);
      video._hls = hls;
      return;
    }

    video.src = url;
  }

  ready(function () {
    var shells = Array.prototype.slice.call(document.querySelectorAll(".video-shell"));

    shells.forEach(function (shell) {
      var video = shell.querySelector("video[data-hls]");
      var button = shell.querySelector(".play-cover");

      if (!video) {
        return;
      }

      function start() {
        attachStream(video, video.getAttribute("data-hls"));

        if (button) {
          button.classList.add("is-hidden");
        }

        video.controls = true;
        var playPromise = video.play();

        if (playPromise && typeof playPromise.catch === "function") {
          playPromise.catch(function () {});
        }
      }

      if (button) {
        button.addEventListener("click", start);
      }

      video.addEventListener("click", function () {
        if (video.paused) {
          start();
        }
      });
    });
  });
})();
