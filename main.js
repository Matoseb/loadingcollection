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
});

document.body.addEventListener('canplay', e => {
    e.target.play();
    show(e);
}, true);

document.body.addEventListener('load', show, true);

function show(e) {
    if (e.target.parentElement.className === 'item' && !e.target.classList.contains('a')) {
        e.target.classList.add('a');
    }
}

function render() {

    const newItems = document.createDocumentFragment();
    let i = ~~(window.scrollY / itemHeight - offscreenRows) * cols;
    if (i < 0) i = 0;

    const _i = i;
    let _first = first;

    while (_first < i) {
        const el = document.querySelector(`.item[data-n='${_first}']`);
        if (el) el.parentNode.removeChild(el);
        _first++;
    }

    for (; i < amt; i++) {
        const currRow = ~~(i / cols) + 1;

        if (window.innerHeight + window.scrollY + offscreenRows * itemHeight < currRow * itemHeight) {
            const el = document.querySelector(`.item[data-n='${i}']`);

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
    if (e && e.target !== window)
        return;

    if (parseInt(window.getComputedStyle(document.documentElement).getPropertyValue('--mobile')) === 1) {
        cols = 1;
    } else {
        cols = Math.ceil(window.innerWidth / 600);

    }

    rows = ~~(amt / cols);

    const t = document.documentElement.style;
    t.setProperty('--ratio', ratio);
    t.setProperty('--cols', cols);
    t.setProperty('--rows', rows);

    document.querySelectorAll('.item').forEach(e => {
        e.parentNode.removeChild(e);
    });

    itemHeight = $ctrl.getBoundingClientRect().height;
    last = first = 0;

    render();
}

function scroll() {
    render();
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



    // const info = document.createElement('div');
    // info.className = 'info';
    // info.innerText = meta.src;
    // el.appendChild(info);

    return el;
}