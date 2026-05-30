(function () {
    window.bindPlayer = function (url) {
        var video = document.getElementById('movie-video');
        var cover = document.querySelector('.play-cover');
        var attached = false;
        var hls = null;

        function attach() {
            if (attached || !video) {
                return;
            }
            attached = true;
            if (video.canPlayType('application/vnd.apple.mpegurl')) {
                video.src = url;
            } else if (window.Hls && window.Hls.isSupported()) {
                hls = new window.Hls({
                    enableWorker: true,
                    lowLatencyMode: false
                });
                hls.loadSource(url);
                hls.attachMedia(video);
            } else {
                video.src = url;
            }
        }

        function start() {
            attach();
            if (cover) {
                cover.hidden = true;
            }
            var playTask = video.play();
            if (playTask && typeof playTask.catch === 'function') {
                playTask.catch(function () {});
            }
        }

        if (cover) {
            cover.addEventListener('click', start);
        }
        if (video) {
            video.addEventListener('play', function () {
                if (cover) {
                    cover.hidden = true;
                }
            });
        }
        window.addEventListener('beforeunload', function () {
            if (hls) {
                hls.destroy();
            }
        });
    };
})();
