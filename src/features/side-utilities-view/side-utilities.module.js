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
                }
            });
    }
}(angular));
