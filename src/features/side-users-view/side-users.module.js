(function (angular) {
    'use strict';
    angular
        .module('app.sideUser', [])
        .config(settingsConfig);

    function settingsConfig($stateProvider) {
        $stateProvider
            .state('app.home.user', {
                url: '/user',
                views: {
                    'sideUserView': {
                        templateUrl: 'features/side-users-view/side-users.html',
                        controller: 'SideUsersCtrl as vm'
                    }
                },
                data: {
                    authenticate: false
                },
                resolve: {
                    UserInfo: function($firebaseArray, rootRef, Auth) {
                        return Auth.$requireSignIn().then(function () {
                            return $firebaseArray(rootRef.child('users').child(Auth.$getAuth().uid).child('userInfo')).$loaded().then(function(userInfo){
                                return userInfo;
                            });
                        });
                    }
                }
            });
    }
}(angular));
