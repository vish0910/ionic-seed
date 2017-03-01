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
                        controller: 'AddTransactionController as vm'
                    }
                },
                data: {
                    authenticate: false
                },
                resolve: {
                    Categories: function($firebaseArray, rootRef, Auth) {
                        return $firebaseArray(rootRef.child('users').child(Auth.$getAuth().uid).child('categories')).$loaded().then(function(categories){
                            return categories;
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
