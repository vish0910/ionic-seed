(function (angular) {
    'use strict';
    angular
        .module('app.home', [])
        .config(homeConfig);

    function homeConfig($stateProvider, $urlRouterProvider) {
        $stateProvider
            .state('app.home', {
                url: '/home',
                abstract: true,
                views: {
                    'appView': {
                        templateUrl: 'features/home/home.html',
                        controller: 'HomeController as vm'
                    }
                },
                data: {
                    authenticate: false
                },
                resolve: {
                    UserInfo: function ($firebaseArray, rootRef, Auth) {
                        return Auth.$requireSignIn().then(function () {
                            return $firebaseArray(rootRef.child('users').child(Auth.$getAuth().uid).child('userInfo')).$loaded().then(function (userInfo) {
                                return userInfo;
                            });
                        });
                    }
                }
            });

        $urlRouterProvider.when('/app/home', '/app/home/categories');
        $urlRouterProvider.otherwise('/app/login');
    }
}(angular));
