(function (angular) {
    'use strict';
    angular
        .module('app.settings', [])
        .config(settingsConfig);

    function settingsConfig($stateProvider) {
        $stateProvider
            .state('app.home.settings', {
                url: '/settings',
                views: {
                    'settingsView': {
                        templateUrl: 'features/settings/settings.html',
                        controller: 'SettingsController as settingsVm'
                    }
                },
                data: {
                    authenticate: false
                }
            });
    }
}(angular));
