(function () {
  function init(config) {
    var video = document.getElementById(config.videoId);
    var button = document.getElementById(config.buttonId);
    var shell = document.getElementById(config.shellId);
    if (!video || !button || !shell || !config.url) {
      return;
    }

    function attach() {
      if (video.getAttribute("data-ready") === "1") {
        return;
      }
      if (window.Hls && window.Hls.isSupported()) {
        var hls = new window.Hls({
          enableWorker: true,
          lowLatencyMode: true
        });
        hls.loadSource(config.url);
        hls.attachMedia(video);
        hls.on(window.Hls.Events.ERROR, function (event, data) {
          if (!data || !data.fatal) {
            return;
          }
          if (data.type === window.Hls.ErrorTypes.NETWORK_ERROR) {
            hls.startLoad();
            return;
          }
          if (data.type === window.Hls.ErrorTypes.MEDIA_ERROR) {
            hls.recoverMediaError();
            return;
          }
          hls.destroy();
          video.src = config.url;
        });
        video._hlsInstance = hls;
      } else if (video.canPlayType("application/vnd.apple.mpegurl")) {
        video.src = config.url;
      } else {
        video.src = config.url;
      }
      video.setAttribute("data-ready", "1");
    }

    function play() {
      attach();
      shell.classList.add("is-playing");
      var result = video.play();
      if (result && typeof result.catch === "function") {
        result.catch(function () {
          shell.classList.remove("is-playing");
        });
      }
    }

    button.addEventListener("click", function (event) {
      event.preventDefault();
      event.stopPropagation();
      play();
    });

    shell.addEventListener("click", function (event) {
      if (event.target === video) {
        return;
      }
      play();
    });

    video.addEventListener("play", function () {
      shell.classList.add("is-playing");
    });
  }

  window.RJPlayer = {
    init: init
  };
})();
