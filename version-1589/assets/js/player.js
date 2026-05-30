(function () {
  function ready(callback) {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', callback);
    } else {
      callback();
    }
  }

  function initPlayer(shell) {
    var video = shell.querySelector('video');
    var source = shell.getAttribute('data-src');
    var poster = shell.getAttribute('data-poster');
    var playCover = shell.querySelector('[data-player-play]');
    var toggleButton = shell.querySelector('[data-player-toggle]');
    var muteButton = shell.querySelector('[data-player-mute]');
    var fullscreenButton = shell.querySelector('[data-player-fullscreen]');
    var status = shell.querySelector('[data-player-status]');
    var hls = null;

    if (!video || !source) {
      setError('视频加载失败，请稍后再试');
      return;
    }

    if (poster) {
      video.setAttribute('poster', poster);
    }

    function setStatus(text) {
      if (status) {
        status.textContent = text;
      }
    }

    function setReady() {
      shell.classList.add('is-ready');
      setStatus('准备就绪');
    }

    function setError(text) {
      shell.classList.add('is-error');
      shell.classList.remove('is-ready');
      setStatus(text);
    }

    function play() {
      var promise = video.play();
      if (promise && typeof promise.catch === 'function') {
        promise.catch(function () {
          shell.classList.add('is-paused');
        });
      }
    }

    function togglePlay() {
      if (video.paused) {
        play();
      } else {
        video.pause();
      }
    }

    function attachSource() {
      setStatus('正在加载');
      if (window.Hls && window.Hls.isSupported()) {
        hls = new window.Hls({
          enableWorker: true,
          lowLatencyMode: true
        });
        hls.loadSource(source);
        hls.attachMedia(video);
        hls.on(window.Hls.Events.MANIFEST_PARSED, setReady);
        hls.on(window.Hls.Events.ERROR, function (event, data) {
          if (data && data.fatal) {
            setError('视频加载失败，请稍后再试');
          }
        });
      } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
        video.src = source;
        video.addEventListener('loadedmetadata', setReady, { once: true });
        video.addEventListener('error', function () {
          setError('视频加载失败，请稍后再试');
        });
      } else {
        video.src = source;
        video.addEventListener('loadedmetadata', setReady, { once: true });
        video.addEventListener('error', function () {
          setError('当前浏览器无法播放该视频');
        });
      }
    }

    video.addEventListener('play', function () {
      shell.classList.add('is-playing');
      shell.classList.remove('is-paused');
      if (toggleButton) {
        toggleButton.textContent = '暂停';
      }
    });

    video.addEventListener('pause', function () {
      shell.classList.remove('is-playing');
      shell.classList.add('is-paused');
      if (toggleButton) {
        toggleButton.textContent = '播放';
      }
    });

    video.addEventListener('click', togglePlay);

    if (playCover) {
      playCover.addEventListener('click', togglePlay);
    }

    if (toggleButton) {
      toggleButton.addEventListener('click', togglePlay);
    }

    if (muteButton) {
      muteButton.addEventListener('click', function () {
        video.muted = !video.muted;
        muteButton.textContent = video.muted ? '取消静音' : '静音';
      });
    }

    if (fullscreenButton) {
      fullscreenButton.addEventListener('click', function () {
        if (document.fullscreenElement) {
          document.exitFullscreen();
        } else if (shell.requestFullscreen) {
          shell.requestFullscreen();
        }
      });
    }

    window.addEventListener('beforeunload', function () {
      if (hls) {
        hls.destroy();
      }
    });

    attachSource();
  }

  ready(function () {
    document.querySelectorAll('[data-player]').forEach(initPlayer);
  });
})();
