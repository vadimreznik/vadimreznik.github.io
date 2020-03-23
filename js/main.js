window.onload = () => {
    'use strict';

    if ('serviceWorker' in navigator) {
        navigator.serviceWorker
            .register('./sw.js');
    }

    start();
}

function start() {
    var container = document.querySelector('.container');
    var backButton = document.querySelector('.back-button');
    var listItems = document.querySelectorAll('.list-item');
    const homeView = container.querySelector('.home-view');
    const views = container.querySelectorAll('.view')

    container.addEventListener('click', (e) => {
        if(e.target.closest('.button') && e.target.closest('.button').dataset && e.target.closest('.button').dataset.target){
            removeActiveFromViews();
            let target = e.target.closest('.button').dataset.target;
            container.classList.add('view-change');
            container.querySelector(`.${target}`).classList.add('active');
            if(target === 'home-view'){
                container.classList.remove('view-change');
                homeView.classList.remove('active');
                removeActiveFromViews();
            }
        }
        if(e.target.closest('.button') && e.target.closest('.button').classList.contains('add-player')){
            const form = e.target.closest('.form'); 
            const row = form.querySelector('.row').cloneNode(true);
            const inputs = row.querySelectorAll('input');
            for (const input of inputs) {
                input.value = '';
            }
            form.insertBefore(row, form.querySelector('.controls'));
        }
        if(e.target.closest('.button') && e.target.closest('.button').classList.contains('remove-player')){
            if(e.target.closest('.form').querySelectorAll('.row').length > 1){
                e.target.closest('.form').removeChild(e.target.closest('.row'));
            }
        }
    });

    function removeActiveFromViews(){
        for (const view of views) {
            view.classList.remove('active');
        }
    }

    /**
     * Toggles the class on the container so that
     * we choose the correct view.
     */
    function onViewChange(evt) {
        container.classList.toggle('view-change');
    }

    // When you click on a list item bring on the details view.
    for (var i = 0; i < listItems.length; i++) {
        listItems[i].addEventListener('click', onViewChange, false);
    }

    // And switch it back again when you click on the back button
    backButton.addEventListener('click', onViewChange);

}