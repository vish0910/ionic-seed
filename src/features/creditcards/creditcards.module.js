(function (angular) {
    'use strict';
    angular
        .module('app.creditcards', [])
        .config(creditcardsConfig);

    function creditcardsConfig($stateProvider) {
        $stateProvider
            .state('app.home.creditcards', {
                url: '/creditcards',
                views: {
                    'creditcardsView': {
                        templateUrl: 'features/creditcards/creditcards.html',
                        controller: 'CreditcardsController as creditcardsVm'
                    }
                },
                data: {
                    authenticate: false
                }
            });
    }
}(angular));
