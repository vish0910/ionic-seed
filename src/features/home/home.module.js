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
                    // controller will not be loaded until $requireAuth resolves
                    currentAuth: ['Auth',
                        function (Auth) {
                            // $requireAuth returns a promise so the resolve waits for it to complete
                            // If the promise is rejected, it will throw a $stateChangeError (see above)
                            return Auth.$requireSignIn();
                        }]
                }
            });

        $urlRouterProvider.when('/app/home', '/app/home/categories');
        $urlRouterProvider.otherwise('/app/login');
    }
}(angular));
