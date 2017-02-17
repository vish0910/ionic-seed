(function (angular) {
    'use strict';
    angular
        .module('app.addTransaction', [])
        .config(remindersConfig);

    function remindersConfig($stateProvider) {
        $stateProvider
            .state('app.home.add-transaction', {
                url: '/add-transaction',
                views: {
                    'addTransactionView': {
                        templateUrl: 'features/add-transaction/add-transaction.html',
                        controller: 'AddTransactionController as addTransactionVm'
                    }
                },
                data: {
                    authenticate: false
                }
            });
    }
}(angular));
