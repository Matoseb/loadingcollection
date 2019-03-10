addEventListener('load', _ => {
    var s = document.body.firstElementChild,
    	t = 0,
        f = e => s.style.cssText = `position:absolute;top:0;left:0;transform:translate(${e.clientX-5}px,${e.clientY-5}px)`;
    addEventListener('wheel', f, { passive: true });
    addEventListener('mousemove', e => {
    	if(!t) f(e);
    	t = 0;
    });
    addEventListener('touchend', _ => t = 1, true);
    document.body.addEventListener('mouseleave', _ => s.removeAttribute('style'));
    document.body.style = 'cursor:none';
}, { once: true });
