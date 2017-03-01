(function (angular) {
    'use strict';
    angular
        .module('app.creditCardTransactions', [])
        .config(transactionsConfig);

    function transactionsConfig($stateProvider) {
        $stateProvider
            .state('app.home.creditCardTransactions', {
                url: '/creditcards/:creditcard',
                views: {
                    'creditcardsView': {
                        templateUrl: 'features/creditcards-transactions-view/creditcard-transactions.html',
                        controller: 'CreditCardTransactionsController as vm'
                    }
                },
                data: {
                    authenticate: false
                },
                params: {
                    transactions: '='
                }
            });
    }
}(angular));
