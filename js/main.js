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
    cardsPerRound: []
};

window.onload = () => {
    'use strict';

    if ('serviceWorker' in navigator) {
        navigator.serviceWorker
            .register('./sw.js');
    }

    start();
}

const hashCode = s => s.split('').reduce((a,b)=>{a=((a<<5)-a)+b.charCodeAt(0);return a&a},0);

function start() {
    var container = document.querySelector('.container');
    var backButton = document.querySelector('.back-button');
    var listItems = document.querySelectorAll('.list-item');
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
                    user.cardsPerRound.push(Number(row.querySelector('.player-card').value));
                    row.dataset.userid = user.id;
                    config.users.push(user);
                }

                container.querySelector('.round-view .title span').innerHTML = config.rounds.length + 1;
            }
            if (e.target.closest('.button').dataset.event === 'restart-round') {
                const hidden = container.querySelectorAll('.hidden');
                for (const element of hidden) {
                    element.classList.remove('hidden');
                }
                container.querySelector('.winner').innerHTML = '';
                for (const user of config.users) {
                    user.cardsPerRound.push(user.cards);
                }
                container.querySelector('.round-view .title span').innerHTML = config.rounds.length + 1;
            }
            if (e.target.closest('.button').dataset.event === 'finish-game') {
                gameResult = { ...config };
                config.users = [];
                config.rounds = [];
                config.bank = 0;
                console.log(gameResult);
            }
            if (e.target.closest('.button').dataset.event === 'save-game-settings') {
                const view = e.target.closest('.view');
                const price = view.querySelector('.card-price');
                config.priceOfCard = Number(price.value);
            }
            if (e.target.closest('.button').dataset.event === 'finish-round') {
                container.querySelector('.round-completed-view .title  span').innerHTML = config.rounds.length + 1;
            }
            if (e.target.closest('.button').dataset.event === 'change-round-settings') { 
                const btn = container.querySelector('.round-start-view .start-btn');
                btn.dataset.event = 'save-round-settings';
                btn.querySelector('span').innerHTML = 'Resume Game';
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
                    let user = config.users.filter(item => item.id === row.dataset.userid)[0];
                    user.name = userName;
                    user.cards = userCards;
                }
            }
        }
    });

    function removeActiveFromViews() {
        for (const view of views) {
            view.classList.remove('active');
        }
    }
}