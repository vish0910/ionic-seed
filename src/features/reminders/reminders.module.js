(function (angular) {
    'use strict';
    angular
        .module('app.reminders', [])
        .config(remindersConfig);

    function remindersConfig($stateProvider) {
        $stateProvider
            .state('app.home.reminders', {
                url: '/reminders',
                views: {
                    'remindersView': {
                        templateUrl: 'features/reminders/reminders.html',
                        controller: 'RemindersController as remindersVm'
                    }
                },
                data: {
                    authenticate: false
                },
                resolve: {
                    Cards: function ($firebaseArray, rootRef, Auth) {
                        return Auth.$requireSignIn().then(function () {
                            return $firebaseArray(rootRef.child('users').child(Auth.$getAuth().uid).child('cards')).$loaded().then(function (cards) {
                                return cards;
                            });
                        });
                    },
                    userUtilities: function ($firebaseArray, rootRef, Auth) {
                        return Auth.$requireSignIn().then(function () {
                            return $firebaseArray(rootRef.child('users').child(Auth.$getAuth().uid).child('utilities')).$loaded().then(function (cards) {
                                return cards;
                            });
                        });
                    }
                }
            });
    }
}(angular));
