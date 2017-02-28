(function (angular) {
    'use strict';
    angular
        .module('app.login', [])
        .config(loginConfig);

    // @ngInject
    function loginConfig($stateProvider) {
        $stateProvider
            .state('app.login', {
                url: '/login',
                views: {
                    'appView': {
                        templateUrl: 'features/login/login.html',
                        controller: 'LoginController as vm'
                    }
                },
                data: {
                    authenticate: false
                },
                resolve: {
                    // controller will not be loaded until $waitForAuth resolves
                    currentAuth: ['Auth',
                        function (Auth) {
                            // $waitForAuth returns a promise so the resolve waits for it to complete
                            return Auth.$waitForSignIn();
                        }]
                }
            });
    }
}(angular));
