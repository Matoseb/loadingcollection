'use strict';

function Utils() {}

Utils.readJson = url => {
    return new Promise((resolve, reject) => {
        const x = new XMLHttpRequest();

        x.onreadystatechange = _ => {

            if (x.status === 404) {
                x.abort();
                reject(url);
            }

            if (x.readyState == 4 && x.status == 200)
                resolve(JSON.parse(x.responseText));
        };

        x.open("GET", url, true);
        x.send();
    });
}

Utils.html = meta => {
    let e = document.createElement('iframe');
    e.src = '../sources/' + meta.src;
    return e;
}
Utils.gif = meta => {
    let e = new Image();
    e.src = '../sources/' + meta.src;
    return e;
}
Utils.mp4 = meta => {
    let e = document.createElement('video');
    e.src = '../sources/' + meta.src;
    e.autoplay = e.muted = e.loop = true;
    return e;
}

let metas = Utils.readJson('metadata.json').then(m => metas = m);
let amt = 0;

let ratio = 0.75,
    cols = 1,
    rows, grid;
let offscreenRows = 1;
let itemHeight = 0;

let $ctrl;
let $scroller;

let first, last;

let totalheight;

let fullElem = -1;

let width;

window.addEventListener('load', async _ => {
    $ctrl = document.querySelector('#control');
    $scroller = document.querySelector('#scroller');

    await metas;
    amt = metas.length;
    // console.log(metas);
    resize();

    window.addEventListener('scroll', scroll, {
        capture: true,
        passive: true
    });

    window.addEventListener('resize', resize, true);

    openFullscreen();
});

window.addEventListener("beforeunload", e => {});

window.addEventListener('click', e => {
    // if(e.target === )
    if (e.target.className === 'close') {
        e.preventDefault();
        minimize();
    }
}, true);


window.addEventListener('animationend', e => {

    switch (e.animationName) {
        case '_full':
            e.target.classList.replace('_full', 'full');
            break;
        case 'full_':
            e.target.classList.replace('full', 'full__');
            break;
        case 'full__':
            e.target.classList.remove('full__', 'full_', 'full');
            break;
        case 'full':
            hide(true);
            break;
    }
});

window.addEventListener('keydown', e => {
    if (e.key === 'Escape')
        minimize();
}, false);

document.body.addEventListener('canplay', e => {
    e.target.play();
    show(e);
}, true);

document.body.addEventListener('load', show, true);

function show(e) {
    if (e.target.parentElement.classList.contains('item') && !e.target.classList.contains('a')) {
        e.target.classList.add('a');
        addClick(e.target);
    }
}

function openFullscreen() {
    let h = window.location.hash.substring(1);

    if (h) {
        h += '.';
        for (var i = metas.length; i--;) {
            if (metas[i].src.includes(h)) {
                h = '';
                break;
            }
        }

        if (!h) {
            let el, b = (Math.floor(i / cols) * (Math.max(document.body.scrollHeight, document.documentElement.scrollHeight) / rows));
            window.scrollTo(0, b);
            window.requestAnimationFrame(_ => {
                el = document.querySelector(`.item[data-n='${i}']`);
                if (el) fullScreen(el);
            });
        } else {
            window.history.pushState(null, null, '/');
        }
    }
}

function hide(add) {
    let p = document.querySelectorAll('.item:not(.full)'), i = p.length;
    for (; i--;) p[i].style.display = add ?'none':'';
}

function addClick(el) {
    let c = el.contentWindow ? el.contentWindow : el.parentElement;

    c.onmouseup = _ => fullScreen(el.parentElement);
    c.onkeydown = e => window.dispatchEvent(new KeyboardEvent('keydown', { key: e.key }));
}

function fullScreen(el) {
    if (fullElem < 0) {

        window.history.pushState(null, null, '#' + metas[el.dataset.n].src.split('.')[0]);

        el.classList.add('_full');
        document.body.style.overflow = 'hidden';
        addInfo(el);
        fullElem = el.dataset.n;
    }
}

function minimize() {
    if (fullElem < 0)
        return;


    hide(false);

    window.history.pushState(null, null, '/');

    let el = document.querySelector(`.item[data-n='${fullElem}']`);
    el.classList.remove('_full');
    el.classList.add('full_');
    document.body.style.removeProperty('overflow');
    fullElem = -1;
}

function render() {
    const newItems = document.createDocumentFragment();
    let i = ~~(window.scrollY / itemHeight - offscreenRows) * cols;
    if (i < 0) i = 0;

    const _i = i;
    let _first = first;

    while (_first < i) {
        const el = document.querySelector(`.item[data-n='${_first}']:not([data-n='${fullElem}'])`);
        if (el) el.parentNode.removeChild(el);
        _first++;
    }

    for (; i < amt; i++) {
        const currRow = ~~(i / cols) + 1;

        if (window.innerHeight + window.scrollY + offscreenRows * itemHeight < currRow * itemHeight) {
            const el = document.querySelector(`.item[data-n='${i}']:not([data-n='${fullElem}'])`);

            if (el) el.parentNode.removeChild(el);
            else
                break;

        } else if (i < first || i >= last) {

            const el = generate(i, currRow);
            newItems.appendChild(el);
        }
    }

    last = i;
    first = _i;

    document.body.appendChild(newItems);
}

function resize(e) {

    let ismobile = +window.getComputedStyle(document.documentElement).getPropertyValue('--mobile');

    if ((e && e.target !== window) || (ismobile && width === window.innerWidth))
        return;

    width = window.innerWidth;
    cols = ismobile === 1 ? 1 : Math.ceil(window.innerWidth / 600);
    rows = Math.ceil(amt / cols);

    const t = document.documentElement.style;
    t.setProperty('--ratio', ratio);
    t.setProperty('--cols', cols);
    t.setProperty('--rows', rows);

    document.querySelectorAll(`.item:not([data-n='${fullElem}'])`).forEach(e => {
        e.parentNode.removeChild(e);
    });

    itemHeight = $ctrl.getBoundingClientRect().height;
    last = first = 0;

    render();
}

function scroll(e) {
    render();
}

function addInfo(el) {
    if (el.querySelector('.info'))
        return;

    const meta = metas[el.dataset.n],
        info = document.createElement('div'),
        closeBtn = document.createElement('div'),
        title = document.createElement('a');

    closeBtn.className = 'close';

    info.className = 'info';
    title.innerText = meta.name;
    title.target = '_blank';
    if (meta.href) title.href = meta.href;

    info.appendChild(title);
    info.appendChild(closeBtn);
    el.appendChild(info);
}

function generate(number, row) {
    const el = document.createElement('div');
    el.className = 'item';

    el.dataset.n = number;

    el.style.left = `calc(${number % cols} * var(--width))`;
    el.style.top = `calc(${row - 1} * var(--height))`;

    let meta = metas[number];
    let content;
    let ext = meta.src.split('.');

    switch (ext[ext.length - 1]) {
        case 'gif':
            content = new Image();
            break;
        case 'mp4':
            content = document.createElement('video');
            content.autoplay = content.muted = content.loop = content.disableRemotePlayback = true;
            break;
        default:
            content = document.createElement('iframe');
    }

    content.src = '../sources/' + meta.src;
    content.className = 'content';

    if (meta.style) content.style.cssText += meta.style;
    if (meta._style) el.style.cssText += meta._style;
    if (meta.class)
        content.className += ' ' + meta.class;



    el.appendChild(content);

    return el;
}