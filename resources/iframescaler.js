var s = +document.currentScript.getAttribute('data-zoom') || 0.5,
    v = 1, _v;
addEventListener('load', _ => {
    if (window.self !== window.top)
        scale(s);
}, { once: true });

addEventListener('resize', _ => {
    v = window.top.innerWidth === window.self.innerWidth &&
        window.top.innerHeight === window.self.innerHeight ? 1 : s;
        
    if (v !== _v) _v = v, scale(v);
});

function scale(ratio) {
    document.documentElement.style.cssText =
        `width: ${100/ratio}vw;
        height: ${100/ratio}vh;
        transform-origin: 0 0;
        transform: scale(${ratio})`;
}