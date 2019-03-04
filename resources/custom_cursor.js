addEventListener('load', _ => {
    var s = document.body.firstElementChild,
        f = e => s.style.cssText = `position:absolute;top:0;left:0;transform:translate(${e.clientX-5}px,${e.clientY-5}px)`;
    addEventListener('wheel', f, { passive: true });
    addEventListener('mousemove', f);
    addEventListener('touchend', e => e.preventDefault());
    document.body.addEventListener('mouseleave', _ => s.removeAttribute('style'));
    document.body.style = 'cursor:none';
}, { once: true });
