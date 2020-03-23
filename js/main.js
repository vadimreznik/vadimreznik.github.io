window.onload = () => {
    'use strict';

    if ('serviceWorker' in navigator) {
        navigator.serviceWorker
            .register('./sw.js');

            navigator.serviceWorker.addEventListener('activate', function (event) {
            event.waitUntil(
                caches.keys().then(function (cacheNames) {
                    return Promise.all(
                        cacheNames.filter(function (cacheName) {
                            return true;
                        }).map(function (cacheName) {
                            return caches.delete(cacheName);
                        })
                    );
                })
            );
        });
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
        if (e.target.classList.contains('button') || e.target.parentNode.classList.contains('button')) {
            removeActiveFromViews();
            let target = e.target.dataset.target || e.target.parentNode.dataset.target;
            container.classList.add('view-change');
            container.querySelector(`.${target}`).classList.add('active');
            if (target === 'home-view') {
                container.classList.remove('view-change');
                homeView.classList.remove('active');
                removeActiveFromViews();
            }
        }
    });

    function removeActiveFromViews() {
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