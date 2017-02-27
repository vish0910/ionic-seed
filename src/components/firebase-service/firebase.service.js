(function (angular) {
    'use strict';

    angular
        .module('app.firebase', [])
        .factory('rootRef', function () {
            return firebase.database().ref();
        })
        .factory("Auth", function ($firebaseAuth) {
            return $firebaseAuth();
        });

}(angular));
