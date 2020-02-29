let draw = {};

let config = {
    size: { w: 500, h: 500 },
    attractors: 3,
    attractorsList: [],
    ratio: .5,
    n: 100,
    scale: 100
};

let elements = {
    attractors: null,
    'show-attractors': null,
    ratio: null,
    n: null,
    scale: null
};

let events = {
    attractors: (value) => {
        config.attractors = value || 3;
        config.attractorsList = [];
        let u = 0.0;
        let rad = 190;
        let ox = config.size.w / 2;
        let oy = config.size.h / 2;
        let a = Math.PI / config.attractors * 2;

        for (let i = 0; i < config.attractors; i++) {
            config.attractorsList.push({ x: ox + Math.cos(u) * rad, y: oy + Math.sin(u) * rad });
            u += a;
        }

        events.n();
    },
    'show-attractors': (display) => {
        if (display) {
            config.attractorsList.forEach((item, m) => {
                item.dot = draw.dot(item.x, item.y);
            });
        } else {
            config.attractorsList.forEach((item, m) => {
                item.dot.remove();
            });
        }
    },
    ratio: (value) => {
        if (value) {
            config.ratio = value;
        } else {
            config.ratio = 0.5;
            document.getElementById('ratio').value = config.ratio;
        }

        events.n();
    },
    n: (value) => {
        if (value) {
            config.n = value;
        } else {
            config.n = 100;
            document.getElementById('n').value = config.n;
        }

        if (draw.fractalDots.length > 0) {
            draw.fractalDots.forEach((dot) => { if (dot) { dot.remove() } });
        }
        for (let i = 0; i < config.n; i++) {
            draw.fractalDots.push(draw.fractal());
        }
    },
    scale: (value) => {
        if (value) {
            config.scale = value;
        } else {
            config.scale = 100;
            document.getElementById('scale').value = config.scale;
        }
        document.getElementById('current-scale').innerHTML = config.scale;
        draw.that.viewbox(0, 0, (config.size.w / config.scale) * 100, (config.size.h / config.scale) * 100)
    },
    startPoint: () => {
        draw.coords = randomRange();
        draw.dot(draw.coords.x, draw.coords.y, '#f00');
        events.scale();
        events.attractors();
    }
};

function defineElements() {
    for (let id in elements) {
        elements[id] = document.getElementById(id);
    }
}

function applyConfig() {
    for (let node in elements) {
        if (elements[node].value) {
            if (config.hasOwnProperty(node)) {
                config[node] = elements[node].value;
            }
        } else {
            if (config.hasOwnProperty(node)) {
                elements[node].value = config[node];
            }
        }
    }
}

function handleEvents() {
    document.body.addEventListener('input', (e) => {
        if (events.hasOwnProperty(e.target.id) && typeof events[e.target.id] === 'function') {
            events[e.target.id](e.target.type === 'checkbox' ? e.target.checked : e.target.value);
        }
    })
}

if (SVG && typeof SVG === 'function') {
    SVG.on(document, 'DOMContentLoaded', init);
}

function init() {
    defineElements();
    applyConfig();
    handleEvents();

    let holder = document.getElementById('holder');
    config.size.w = holder.offsetWidth - 12;
    config.size.h = window.innerHeight - 35;

    draw = {
        that: (() => SVG().addTo('#holder').size(config.size.w, config.size.h))(),
        dotRadius: 4,
        coords: {},
        fractalDots: [],
        dot: (x, y, color) => {
            return draw.that.circle(draw.dotRadius).move(x, y).attr({ fill: color || '#000' });
        },
        text: (x, y, str) => {
            return draw.that.text(str).move(x, y);
        },
        fractal: () => {
            let nextAttractor = config.attractorsList[random(0, config.attractors)];
            if (nextAttractor) {
                let x = (draw.coords.x + nextAttractor.x) * config.ratio;
                let y = (draw.coords.y + nextAttractor.y) * config.ratio;

                draw.coords.x = x;
                draw.coords.y = y;
                return draw.dot(x, y);
            }
        }
    };


    events.startPoint();
}

function randomRange() {
    return { x: random(0, config.size.w - draw.dotRadius), y: random(0, config.size.h - draw.dotRadius) }
}

function random(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}