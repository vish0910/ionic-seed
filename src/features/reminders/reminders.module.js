(function (angular) {
    'use strict';
    angular
        .module('app.reminders', [])
        .config(remindersConfig);

    function remindersConfig($stateProvider) {
        $stateProvider
            .state('app.home.reminders', {
                url: '/reminders',
                views: {
                    'remindersView': {
                        templateUrl: 'features/reminders/reminders.html',
                        controller: 'RemindersController as remindersVm'
                    }
                },
                data: {
                    authenticate: false
                }
            });
    }
}(angular));
