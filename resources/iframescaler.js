var s = Number(document.currentScript.getAttribute('data-scale')) || 0.5;

window.addEventListener('load', _ => {

    if (window.self === window.top)
        return;

    const w = window.screen.width * s,
        ds = document.documentElement.style,
        resize = _ => {
            var ratio = window.innerHeight / window.innerWidth;

            ds.width = w + 'px';
            ds.height = w * ratio + 'px';
            ds.transformOrigin = '0 0';
            ds.transform = `scale3d(${window.innerWidth/w}, ${window.innerWidth/w}, 1)`;
        };

    resize();
    window.addEventListener('resize', resize, true);

}, { once: true });