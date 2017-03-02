(function (angular) {
    'use strict';
    angular
        .module('app.sideCategories', [])
        .config(settingsConfig);

    function settingsConfig($stateProvider) {
        $stateProvider
            .state('app.home.category', {
                url: '/category',
                views: {
                    'sideCategoryView': {
                        templateUrl: 'features/side-categories-view/side-categories.html',
                        controller: 'SideCategoriesCtrl as vm'
                    }
                },
                data: {
                    authenticate: false
                },
                resolve: {
                    DefaultCategories: function ($firebaseArray, rootRef, Auth) {
                        return Auth.$requireSignIn().then(function () {
                            return $firebaseArray(rootRef.child('categories')).$loaded().then(function(categories){
                                return categories;
                            });
                        })
                    },
                    userCategories: function ($firebaseArray, rootRef, Auth) {
                        return Auth.$requireSignIn().then(function () {
                            return $firebaseArray(rootRef.child('users').child(Auth.$getAuth().uid).child('categories')).$loaded().then(function (categories) {
                                return categories;
                            });
                        })
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
