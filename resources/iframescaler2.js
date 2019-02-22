var s = Number(document.currentScript.getAttribute('data-scale'));
if (s === undefined)
    s = 0.5;

window.addEventListener('load', _ => {

    if (window.self === window.top || s === 0)
        return;

    resize = _ => {

        document.documentElement.style.cssText =
            `width: ${100 / s }vw;
                height: ${100 / s }vh;
            transform-origin: 0 0;
            transform: scale(${s})`;
    };

    resize();
    // window.addEventListener('resize', resize, true);
    sheets();
    function sheets(selector) {
        var s = document.styleSheets;

        var i, j, r;
        for (var i = s.length; i--;) {
            for(r = s[i].cssRules, j = r.length; j--;) {
                if(r[j].constructor.name == 'CSSMediaRule')
                    console.log(r[j]);
            }
            
        }
    }


}, { once: true });