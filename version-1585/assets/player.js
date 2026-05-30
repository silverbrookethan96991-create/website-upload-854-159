(function () {
  function formatState(text) {
    return text || '点击播放';
  }

  function attachSource(video, source) {
    if (!source || video.dataset.hlsReady === '1') {
      return;
    }
    video.dataset.hlsReady = '1';

    if (window.Hls && window.Hls.isSupported()) {
      var hls = new window.Hls({
        enableWorker: true,
        lowLatencyMode: true
      });
      hls.loadSource(source);
      hls.attachMedia(video);
      video._hlsInstance = hls;
    } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
      video.src = source;
    } else {
      video.src = source;
    }
  }

  function initPlayer(shell) {
    var video = shell.querySelector('.player-video');
    var button = shell.querySelector('[data-play-toggle]');
    var state = shell.querySelector('[data-player-state]');
    if (!video) {
      return;
    }
    var source = video.getAttribute('data-src');

    function setState(text) {
      if (state) {
        state.textContent = formatState(text);
      }
    }

    function playVideo() {
      attachSource(video, source);
      var playPromise = video.paused ? video.play() : video.pause();
      if (playPromise && typeof playPromise.catch === 'function') {
        playPromise.catch(function () {
          setState('请再次点击播放');
        });
      }
    }

    if (button) {
      button.addEventListener('click', playVideo);
    }

    video.addEventListener('click', function () {
      if (video.paused) {
        playVideo();
      } else {
        video.pause();
      }
    });

    video.addEventListener('play', function () {
      shell.classList.add('is-playing');
      setState('正在播放');
    });

    video.addEventListener('pause', function () {
      shell.classList.remove('is-playing');
      setState('已暂停');
    });

    video.addEventListener('waiting', function () {
      setState('缓冲中');
    });

    video.addEventListener('canplay', function () {
      setState(video.paused ? '点击播放' : '正在播放');
    });

    video.addEventListener('error', function () {
      setState('播放源加载失败');
    });
  }

  document.addEventListener('DOMContentLoaded', function () {
    var players = document.querySelectorAll('[data-player]');
    Array.prototype.forEach.call(players, initPlayer);
  });
})();
