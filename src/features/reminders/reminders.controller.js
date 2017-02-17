(function (angular) {
    'use strict';
    angular
        .module('app.reminders')
        .controller('RemindersController', RemindersController);

    function RemindersController (svsGetDataService) {
        var remindersVm = this;

        var data = svsGetDataService.getCards().concat(svsGetDataService.getUtilities());

        _.forEach(data, function(reminder){
            reminder.remainingDays = moment(reminder.dueDate).diff(moment(new Date().toISOString()), 'days')
        });

        remindersVm.reminders = _.sortBy(data, function (d) {
            return (d.remainingDays)
        });
    }
} (angular));
