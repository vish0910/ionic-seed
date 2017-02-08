(function(angular) {
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
                        controller: 'LoginController as loginVm'
                    }
                },
                data: {
                    authenticate: false
                }
            });
    }
}(angular));
