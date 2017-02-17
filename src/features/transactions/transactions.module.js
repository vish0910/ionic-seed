(function (angular) {
    'use strict';
    angular
        .module('app.transactions', [])
        .config(transactionsConfig);

    function transactionsConfig($stateProvider) {
        $stateProvider
            .state('app.home.transactions', {
                url: '/transactions',
                views: {
                    'transactionsView': {
                        templateUrl: 'features/transactions/transactions.html',
                        controller: 'TransactionsController as transactionsVm'
                    }
                },
                data: {
                    authenticate: false
                }
            });
    }
}(angular));
