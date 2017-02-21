(function (angular) {
    'use strict';
    angular
        .module('app.sideCards', [])
        .config(settingsConfig);

    function settingsConfig($stateProvider) {
        $stateProvider
            .state('app.home.cards', {
                url: '/cards',
                views: {
                    'sideCardsView': {
                        templateUrl: 'features/side-cards-view/side-cards.html',
                        controller: 'SideCardsCtrl as vm'
                    }
                },
                data: {
                    authenticate: false
                }
            });
    }
}(angular));
