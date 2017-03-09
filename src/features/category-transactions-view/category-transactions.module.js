(function (angular) {
    'use strict';
    angular
        .module('app.categoryTransactions', [])
        .config(transactionsConfig);

    function transactionsConfig($stateProvider) {
        $stateProvider
            .state('app.home.categoryTransactions', {
                url: '/categories/:category',
                views: {
                    'categoriesView': {
                        templateUrl: 'features/category-transactions-view/category-transactions.html',
                        controller: 'CategoryTransactionsController as vm'
                    }
                },
                data: {
                    authenticate: false
                },
                params: {
                    transactions: '=',
                    categories: '='
                }
            });
    }
}(angular));
