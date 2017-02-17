(function (angular) {
    'use strict';
    angular
        .module('app.reminders')
        .controller('RemindersController', RemindersController);

    function RemindersController () {
        var remindersVm = this;
    }
} (angular));
