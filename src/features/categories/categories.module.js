(function (angular) {
    'use strict';
    angular
        .module('app.categories', ['svs.svsGetData'])
        .config(categoriesConfig);

    function categoriesConfig($stateProvider) {
        $stateProvider
            .state('app.home.categories', {
                url: '/categories',
                views: {
                    'categoriesView': {
                        templateUrl: 'features/categories/categories.html',
                        controller: 'CategoriesController as categoriesVm'
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
                    },
                    Categories: function ($firebaseArray, rootRef, Auth) {
                        return Auth.$requireSignIn().then(function () {
                            return $firebaseArray(rootRef.child('users').child(Auth.$getAuth().uid).child('categories')).$loaded().then(function (categories) {
                                return categories;
                            });
                        })
                    }
                }
            });
    }
}(angular));
