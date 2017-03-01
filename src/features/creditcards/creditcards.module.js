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
                },
                resolve: {
                    Transactions: function($firebaseArray, rootRef, Auth) {
                        return $firebaseArray(rootRef.child('users').child(Auth.$getAuth().uid).child('transactions')).$loaded().then(function(transactions){
                            return transactions;
                        });
                    },
                    Cards: function($firebaseArray, rootRef, Auth) {
                        return $firebaseArray(rootRef.child('users').child(Auth.$getAuth().uid).child('cards')).$loaded().then(function(cards){
                            return cards;
                        });
                    }
                }
            });
    }
}(angular));
