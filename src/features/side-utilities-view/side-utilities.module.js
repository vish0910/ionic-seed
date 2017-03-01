(function (angular) {
    'use strict';
    angular
        .module('app.sideUtilities', [])
        .config(settingsConfig);

    function settingsConfig($stateProvider) {
        $stateProvider
            .state('app.home.utilities', {
                url: '/utilities',
                views: {
                    'sideUtilitiesView': {
                        templateUrl: 'features/side-utilities-view/side-utilities.html',
                        controller: 'SideUtilitiesCtrl as vm'
                    }
                },
                data: {
                    authenticate: false
                },
                resolve: {
                    DefaultUtilities: function($firebaseArray, rootRef) {
                        return $firebaseArray(rootRef.child('utilities')).$loaded().then(function(cards){
                            return cards;
                        });
                    },
                    userUtilities: function($firebaseArray, rootRef, Auth) {
                        return $firebaseArray(rootRef.child('users').child(Auth.$getAuth().uid).child('utilities')).$loaded().then(function(cards){
                            return cards;
                        });
                    }
                }
            });
    }
}(angular));
