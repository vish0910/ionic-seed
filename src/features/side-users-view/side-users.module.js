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
                        controller: 'SideUsersCtrl as Vm'
                    }
                },
                data: {
                    authenticate: false
                }
            });
    }
}(angular));
