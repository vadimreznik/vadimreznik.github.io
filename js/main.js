const config = {
    rounds: [],
    users: [],
    bank: 0,
    priceOfCard: 1
};

let gameResult = {};

const roundItem = {
    id: 0,
    time: 0,
    winner: '',
    row: null
};

const userItem = {
    id: null,
    name: '',
    cards: 0,
    cardsPerRound: [],
    score: 0
};

window.onload = () => {
    'use strict';

    if ('serviceWorker' in navigator) {
        navigator.serviceWorker
            .register('./sw.js');
    }
    // start();
}

const debounce = (func, wait) => {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  };
  
  document.documentElement.style.setProperty(
    "--100vh",
    `${window.innerHeight}px`
  );
  
  window.addEventListener(
    "resize",
    debounce(() => {
      document.documentElement.style.setProperty(
        "--100vh",
        `${window.innerHeight}px`
      );
    }, 100)
  );

const hashCode = s => s.split('').reduce((a, b) => { a = ((a << 5) - a) + b.charCodeAt(0); return a & a }, 0);

function calculateGameTime() {
    let s = gameResult.rounds.map(round => round.time.s);
    let m = gameResult.rounds.map(round => round.time.m);
    let h = gameResult.rounds.map(round => round.time.h);

    sec = s.reduce((x, y) => x + y, 0);
    min = m.reduce((x, y) => x + y, 0) + Math.floor(sec / 60 % 60);
    hrs = h.reduce((x, y) => x + y, 0) + Math.floor(min / 60 % 60);

    return `${hrs}:${parseInt(min % 60)}:${parseInt(sec % 60)}`;
}

function gameReport() {
    let report = [];
    gameResult.users.forEach(user => {
        let investment = user.cardsPerRound.reduce((x, y) => x + y, 0);
        report.push(`${user.name} invested ${investment} and won ${user.score}. Profit is ${user.score - investment}`)
    });
    return report;
}

function tableOfWinner() {
    return gameResult.users.map(user => user.name).reduce((x, y) => {
        x[y] = gameResult.rounds.filter(round => round.winner === y).length;
        return x;
    }, {});
}

function lookingForWinner(player) {
    return config.users.filter(user => user.name === player)[0];
}

function checkBank() {
    config.users.forEach(user => {
        let was = user.cardsPerRound[config.rounds.length - 1];
        let now = user.cards;
        config.bank += (now - was);
    });
}

function calculateGameBank(isFinish) {
    const lastRound = config.rounds[config.rounds.length - 1];
    const lastRoundWinnerName = lastRound.winner;
    const lastRoundRow = lastRound.row;
    const winner = lookingForWinner(lastRoundWinnerName);

    switch (lastRoundRow) {
        case 0:
            winner.score += winner.cards;
            config.bank -= winner.cards;
            break;
        case 1:
            let halfOfBank = config.bank / 2;
            winner.score += halfOfBank;
            config.bank = halfOfBank;
            break;
        case 2:
            winner.score += config.bank;
            config.bank = 0;
            break;
    }
    if (!isFinish) {
        config.users.forEach(user => {
            config.bank += user.cards
        });
    }
}

const timer = {
    seconds: 0,
    interval: null,
    time: {
        h: 0,
        m: 0,
        s: 0
    },
    start: () => {
        timer.interval = setInterval(() => {
            timer.seconds++;
            timer.time.h = Math.floor(timer.seconds / 3600);
            timer.time.m = Math.floor(timer.seconds / 60 % 60);
            timer.time.s = parseInt(timer.seconds % 60)
        }, 1000);
    },
    reset: () => {
        timer.pause();
        timer.seconds = 0;
        timer.time = { ...{ h: 0, m: 0, s: 0 } };
    },
    pause: () => {
        clearTimeout(timer.interval);
        timer.interval = null;
    },
    resume: () => {
        if (!timer.interval) timer.start();
    },
    moment: () => {
        return timer.time;
    },
    current: (callback) => {
        setInterval(() => {
            callback(timer.time);
        }, 1000);
    }
};

function demo() {

    new SpinnerPicker(
        document.getElementById("simple-example"),
        function (index) {
            // Check if the index is below zero or above 20 - Return null in this case
            if (index < 0 || index > 20) {
                return null;
            }
            return index;
        }, { index: 4 }
    );
}

function start() {
    demo();
    var container = document.querySelector('.container');
    const homeView = container.querySelector('.home-view');
    const views = container.querySelectorAll('.view')

    container.addEventListener('click', (e) => {
        if (e.target.closest('.button') && e.target.closest('.button').dataset && e.target.closest('.button').dataset.target) {
            removeActiveFromViews();
            let target = e.target.closest('.button').dataset.target;
            container.classList.add('view-change');
            container.querySelector(`.${target}`).classList.add('active');
            if (target === 'home-view') {
                container.classList.remove('view-change');
                homeView.classList.remove('active');
                removeActiveFromViews();
            }
        }
        if (e.target.closest('.button') && e.target.closest('.button').classList.contains('add-player')) {
            const form = e.target.closest('.form');
            const row = form.querySelector('.row').cloneNode(true);
            const inputs = row.querySelectorAll('input');
            for (const input of inputs) {
                input.value = '';
            }
            form.insertBefore(row, form.querySelector('.controls'));
        }
        if (e.target.closest('.button') && e.target.closest('.button').classList.contains('remove-player')) {
            if (e.target.closest('.form').querySelectorAll('.row').length > 1) {
                e.target.closest('.form').removeChild(e.target.closest('.row'));
            }
        }
        if (e.target.closest('.result') && e.target.closest('.form')) {
            let buttons = Array.from(e.target.closest('.form').querySelectorAll('.button'));
            let index = buttons.indexOf(e.target.closest('.button'));

            const winner = e.target.closest('.result').querySelector('.winner');
            e.target.closest('.form').classList.add('hidden');

            for (const user of config.users) {
                const userElement = document.createElement('span');
                const subElement = userElement.cloneNode();
                subElement.innerHTML = user.name;
                userElement.appendChild(subElement);
                userElement.classList.add('button');
                userElement.dataset.winner = index;

                winner.appendChild(userElement);
            }

        }

        if (e.target.closest('.button') && e.target.closest('.button').dataset && e.target.closest('.button').dataset.winner) {
            let round = { ...roundItem };
            round.winner = e.target.closest('.button').querySelector('span').innerHTML;
            round.row = Number(e.target.closest('.button').dataset.winner);
            round.time = timer.moment();
            timer.reset();
            config.rounds.push(round);
            e.target.closest('.result').querySelector('.winner').classList.add('hidden');
            e.target.closest('.view').querySelector('.overlay').classList.add('hidden');
        }

        if (e.target.closest('.button') && e.target.closest('.button').dataset && e.target.closest('.button').dataset.event) {
            if (e.target.closest('.button').dataset.event === 'start-game') {
                const initRound = container.querySelector('.round-start-view');
                const players = initRound.querySelector('.players');
                const rows = players.querySelectorAll('.row');

                for (const row of rows) {
                    let user = JSON.parse(JSON.stringify(userItem));
                    user.id = hashCode(row.querySelector('.player-name').value);
                    user.name = row.querySelector('.player-name').value;
                    user.cards = Number(row.querySelector('.player-card').value);
                    // user.defaultCards = Number(row.querySelector('.player-card').value);
                    row.dataset.userid = user.id;
                    config.users.push(user);
                }
                config.bank = config.users.reduce((x, y) => x + y.cards, 0);
                container.querySelector('.round-view .bank').innerHTML = `Bank: ${config.bank}`;
                container.querySelector('.round-view .title span').innerHTML = config.rounds.length + 1;
            }
            if (e.target.closest('.button').dataset.event === 'restart-round') {
                const hidden = container.querySelectorAll('.hidden');
                for (const element of hidden) {
                    element.classList.remove('hidden');
                }
                calculateGameBank();
                container.querySelector('.winner').innerHTML = '';
                container.querySelector('.round-view .bank').innerHTML = `Bank: ${config.bank}`;
                container.querySelector('.round-view .title span').innerHTML = config.rounds.length + 1;
            }
            if (e.target.closest('.button').dataset.event === 'finish-game') {
                const hidden = container.querySelectorAll('.hidden');
                for (const element of hidden) {
                    element.classList.remove('hidden');
                }
                container.querySelector('.winner').innerHTML = '';

                calculateGameBank(true);

                gameResult = { ...config };
                config.users = [];
                config.rounds = [];
                config.bank = 0;

                const view = document.querySelector('.game-completed-view');
                const text = view.querySelector('.view-content .text');
                text.innerHTML = `
                    Remaining bank - ${gameResult.bank}<br />
                    Total played rounds - ${gameResult.rounds.length}<br />
                    Total game time is ${calculateGameTime()}<br />
                    ${Object.entries(tableOfWinner()).map(([key, value]) => `<br />${key} won ${value} round(s)`).join('')}<br />
                    <br/>
                    ${gameReport().map(userReport => `<br/>${userReport}`).join('')}
                `;
                console.log(gameResult);
            }
            if (e.target.closest('.button').dataset.event === 'save-game-settings') {
                const view = e.target.closest('.view');
                const price = view.querySelector('.card-price');
                config.priceOfCard = Number(price.value);
            }
            if (e.target.closest('.button').dataset.event === 'finish-round') {
                container.querySelector('.round-completed-view .title  span').innerHTML = config.rounds.length + 1;
                for (const user of config.users) {
                    user.cardsPerRound.push(user.cards);
                }
                timer.pause();
            }
            if (e.target.closest('.button').dataset.event === 'change-round-settings') {
                const btn = container.querySelector('.round-start-view .start-btn');
                btn.dataset.event = 'save-round-settings';
                btn.querySelector('span').innerHTML = 'Resume Game';
                timer.pause();
            }
            if (e.target.closest('.button').dataset.event === 'save-round-settings') {
                const btn = container.querySelector('.round-start-view .start-btn');
                btn.dataset.event = 'start-game';
                btn.querySelector('span').innerHTML = 'Start Game';

                const initRound = container.querySelector('.round-start-view');
                const players = initRound.querySelector('.players');
                const rows = players.querySelectorAll('.row');

                for (const row of rows) {
                    let userName = row.querySelector('.player-name').value;
                    let userCards = Number(row.querySelector('.player-card').value);
                    config.users.forEach(user => {
                        if (user.id == row.dataset.userid) {
                            user.name = userName;
                            user.cards = userCards;
                        }
                    });
                }
                checkBank();
                container.querySelector('.round-view .bank').innerHTML = `Bank: ${config.bank}`;
                timer.resume();
            }
            if (e.target.closest('.button').dataset.event === 'start-game' || e.target.closest('.button').dataset.event === 'restart-round') {
                if (!timer.interval) {
                    timer.start();
                }
                const roundTitle = document.querySelector('.round-view .view-content .title');
                timer.current((current) => {
                    roundTitle.innerHTML = `${current.h}:${current.m}:${current.s}`;
                })
            }
        }
    });

    function removeActiveFromViews() {
        for (const view of views) {
            view.classList.remove('active');
        }
    }
}