(function () {
    const CONFIG_PATH = './shared/config.json';

    fetch(CONFIG_PATH)
        .then(r => r.json())
        .then(cfg => {
            const frame = document.getElementById('appFrame');
            const url = cfg.appBaseUrl + '?deviceId=' + encodeURIComponent(getDeviceId());
            frame.src = url;

            frame.style.position = 'fixed';
            frame.style.top = frame.style.left = '0';
            frame.style.width = frame.style.height = '100%';
            frame.style.border = 'none';

            registerKeys();
        })
        .catch(err => console.error('Failed to load config', err));

    function getDeviceId() {
        try {
            return tizen.systeminfo.getCapability('http://tizen.org/system/tizenid') ||
                tizen.systeminfo.getCapability('http://tizen.org/system/duid');
        } catch {
            return '';
        }
    }

    function registerKeys() {
        ['ColorF0Red', 'ColorF1Green', 'ColorF2Yellow', 'ColorF3Blue',
            'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'Enter', 'Back']
            .forEach(k => {
                try {
                    tizen.tvinputdevice.registerKey(k);
                } catch {
                }
            });

        document.addEventListener('keydown', e => {
            const frame = document.getElementById('appFrame');
            if (frame && frame.contentWindow) {
                frame.contentWindow.postMessage({type: 'tizen-key', key: e.keyCode}, '*');
            }
        });
    }
})();