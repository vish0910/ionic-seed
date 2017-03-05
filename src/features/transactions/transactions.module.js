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
                },
                resolve: {
                    Transactions: function ($firebaseArray, rootRef, Auth) {
                        return Auth.$requireSignIn().then(function () {
                            return $firebaseArray(rootRef.child('users').child(Auth.$getAuth().uid).child('transactions')).$loaded().then(function (transactions) {
                                return transactions;
                            });
                        })
                    }
                }
            });
    }
}(angular));
