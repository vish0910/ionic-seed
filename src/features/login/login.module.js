(function (angular) {
    'use strict';
    angular
        .module('app.login', [])
        .config(loginConfig);

    function loginConfig($stateProvider) {
        $stateProvider
            .state('app.login', {
                url: '/login',
                views: {
                    'loginView': {
                        templateUrl: 'features/login/login.html',
                        controller: 'LoginController as loginVm'
                    }
                },
                data: {
                    authenticate: false
                }
            });
    }
}(angular));
