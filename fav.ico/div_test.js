let amt = 1200;

let ratio = 0.75;
let cols = 3;
let rows;
let grid;

let offscreenRows = 2;

let itemHeight = 0;

let controlEl;

let first, last;

window.addEventListener('load', _ => {
    controlEl = document.querySelector('#control');

    resize();

    window.addEventListener('scroll', scroll, {
        capture: true,
        passive: true
    });

    window.addEventListener('resize', resize, true);
});

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

function resize() {
    cols = Math.ceil(window.innerWidth / 500);
    rows = ~~(amt / cols);

    const t = document.documentElement.style;
    t.setProperty('--ratio', ratio);
    t.setProperty('--cols', cols);
    t.setProperty('--rows', rows);

    document.querySelectorAll('.item').forEach(e => {
        e.parentNode.removeChild(e);
    });

    itemHeight = controlEl.getBoundingClientRect().height;
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

    const info = document.createElement('div');
    info.className = 'info';
    info.innerText = number;
    el.appendChild(info);

    return el;
}