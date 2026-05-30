(function () {
  function init(videoId, buttonId, overlayId, source) {
    var video = document.getElementById(videoId);
    var button = document.getElementById(buttonId);
    var overlay = document.getElementById(overlayId);
    var loaded = false;
    var hls = null;

    if (!video || !source) {
      return;
    }

    function bind() {
      if (loaded) {
        return;
      }

      if (video.canPlayType('application/vnd.apple.mpegurl')) {
        video.src = source;
      } else if (window.Hls && window.Hls.isSupported()) {
        hls = new window.Hls({
          enableWorker: true,
          lowLatencyMode: true,
          backBufferLength: 90
        });
        hls.loadSource(source);
        hls.attachMedia(video);
      } else {
        video.src = source;
      }

      loaded = true;
    }

    function play(event) {
      if (event && event.preventDefault) {
        event.preventDefault();
      }
      bind();
      if (overlay) {
        overlay.classList.add('is-hidden');
      }
      var promise = video.play();
      if (promise && promise.catch) {
        promise.catch(function () {
          if (overlay) {
            overlay.classList.remove('is-hidden');
          }
        });
      }
    }

    if (overlay) {
      overlay.addEventListener('click', play);
    }

    if (button) {
      button.addEventListener('click', play);
    }

    video.addEventListener('play', function () {
      if (overlay) {
        overlay.classList.add('is-hidden');
      }
    });

    video.addEventListener('error', function () {
      if (hls) {
        hls.destroy();
        hls = null;
      }
      loaded = false;
    });
  }

  window.MoviePlayer = {
    init: init
  };
})();
