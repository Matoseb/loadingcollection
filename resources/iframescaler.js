var s = +document.currentScript.getAttribute('data-zoom') || 0.5;
addEventListener('load', _ => {
    if (window.self !== window.top)
        document.documentElement.style.cssText =
            `width: ${100/s }vw;
                height: ${100/s }vh;
            transform-origin: 0 0;
            transform: scale(${s})`;
}, { once: true });