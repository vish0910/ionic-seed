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
                },
                resolve: {
                    DefaultCards: function ($firebaseArray, rootRef, Auth) {
                        return Auth.$requireSignIn().then(function () {
                            return $firebaseArray(rootRef.child('cards')).$loaded().then(function (cards) {
                                return cards;
                            });
                        });
                    },
                    userCards: function ($firebaseArray, rootRef, Auth) {
                        return Auth.$requireSignIn().then(function () {
                            return $firebaseArray(rootRef.child('users').child(Auth.$getAuth().uid).child('cards')).$loaded().then(function (cards) {
                                return cards;
                            });
                        });
                    },
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
