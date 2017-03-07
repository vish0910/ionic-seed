(function (angular, _) {
    'use strict';
    angular
        .module('app.reminders')
        .controller('RemindersController', RemindersController);

    function RemindersController($q,
                                 $scope,
                                 $state,
                                 $ionicModal,
                                 $ionicPopover,
                                 Cards,
                                 svsGetDataService,
                                 svsNotificationService,
                                 userUtilities,
                                 $firebaseArray,
                                 rootRef,
                                 Auth,
                                 ionicToast,
                                 $timeout) {
        var remindersVm = this;
        var POPOVER_TEMPLATE = 'features/reminders/reminder-context-menu.html';
        var ADD_TRANSACTION_MODAL_TEMPLATE = 'features/reminders/add-transaction-modal.html';
        var PAYMENT_CATEGORY = "payment";

        var data = Cards.concat(userUtilities);
        var oldReminder;

        $scope.test = 'test';
        $scope.dismissReminder = dismissReminder;
        $scope.closeReminderPopover = closeReminderPopover;
        $scope.modifyNotification = modifyNotification;

        $scope.closeAddTransactionModal = closeAddTransactionModal;
        $scope.addPaymentTransaction = addPaymentTransaction;

        remindersVm.openReminderPopover = openReminderPopover;
        remindersVm.removeAllNotifications = svsNotificationService.removeAllNotifications;
        remindersVm.getAllNotifications = svsNotificationService.getAllNotifications;

        init();
        function init() {

            calculateRemainingDays();
            $ionicPopover.fromTemplateUrl(POPOVER_TEMPLATE, {
                scope: $scope
            }).then(function (popover) {
                remindersVm.popover = popover;
            });

            $ionicModal.fromTemplateUrl(ADD_TRANSACTION_MODAL_TEMPLATE, {
                scope: $scope,
                animation: 'slide-in-up'
            }).then(function (modal) {
                remindersVm.modal = modal;
            });
        }

        function calculateRemainingDays() {
            console.log(Cards);
            console.log(userUtilities);
            console.log(data);
            _.forEach(data, function (reminder) {
                reminder.remainingDays = moment(reminder.dueDate).diff(moment(new Date().toISOString()), 'days')
            });
            remindersVm.reminders = data;
        }

        function modifyNotification(item) {
            var config = {
                id: item.id,
                title: 'Payment Reminder',
                text: item.name + ' bill is due soon',
                sound: 'file://resources/sound/solemn.mp3',
                every: (item.recurring) ? 'minute' : undefined,
                autoClear: true,
                at: new Date(new Date().getTime() + 10 * 1000)
            };

            svsNotificationService.addNotification(config);

            console.log("Notification set as:");
            console.log(config);
        }

        function removeNotification(item) {
            svsNotificationService.getNotification(item.id)
                .then(function (value) {
                    console.log(value);
                    if (value) {
                        svsNotificationService.removeNotification(item.id);
                    }
                });
        }

        function dismissReminder(item) {
            console.log("called");
            console.log(item);
            //Paid is set to true Open Transaction recorder
            //todo open modal only for card bills
            if (item.type == 'CARD') {
                openAddTransactionModal(item);
            } else {
                cleanPopover();
                updateUserUtilities(item);
            }
        }

        function openReminderPopover($event, item) {
            console.log('Held');
            console.log($event);
            oldReminder = angular.copy(item);
            $scope.selectedReminder = item;
            remindersVm.popover.show($event);
        }

        function closeReminderPopover(item) {
            if (reminderConfigChanged(item)) {
                saveReminderConfig(item);
                cleanPopover();
            } else {
                cleanPopover();
            }
        }

        function cleanPopover() {
            console.log("clean popover here");
            oldReminder = null;
            remindersVm.popover.hide();
        }

        function saveReminderConfig(item) {
            //todo PUT the item back as it may have changed value.
            if (item.notification) {
                return modifyNotification(item)
            } else {
                return removeNotification(item);
            }
        }

        function reminderConfigChanged(item) {
            console.log("New item vvvv");
            console.log(item);
            console.log("Old item vvvv");
            console.log(oldReminder);
            return (item.notification != _.get(oldReminder, 'notification') || item.recurring != _.get(oldReminder, 'recurring'))
        }

        function openAddTransactionModal(item) {
            oldReminder = angular.copy(item);
            $scope.selectedReminder = item;
            remindersVm.modal.show();
        }

        function closeAddTransactionModal() {
            cleanModal();
        }

        function cleanModal() {
            console.log("here");
            oldReminder = null;
            remindersVm.modal.hide();
        }

        function addPaymentTransaction(item) {
            //var transaction = {
            //    amount: -(item.amountPaid),
            //    date: new Date().toISOString(),
            //    category: PAYMENT_CATEGORY,
            //    card: item.name
            //};
            //
            //console.log(item);
            //console.log(transaction);
            //svsGetDataService.putTransaction(transaction);

            //TODO id of payement. Optional.
            var transaction = {
                category: {name: PAYMENT_CATEGORY, id: PAYMENT_CATEGORY},
                card: {name: item.name, id: item.$id},
                amount: -(item.amountPaid),
                date: new Date().getTime(),
                description: 'Bill Paid'
            };

            $firebaseArray(rootRef.child('users').child(Auth.$getAuth().uid).child('transactions')).$add(transaction)
                .then(function () {
                    ionicToast.show('The transaction is added successfully', 'bottom', false, 2500);
                });


            //TODO Calculate new duedate
            cleanModal();
            cleanPopover();

            updateCard(item, transaction);
        }

        function updateCard(item, transaction) {
            var itemToBeUpdated = Cards.$getRecord(item.$id) || {};

            if (Math.abs(transaction.amount) < item.amountDue) {
                itemToBeUpdated.amountDue = _.get(itemToBeUpdated, 'amountDue', 0) + transaction.amount;
            } else {
                itemToBeUpdated.amountDue = _.get(itemToBeUpdated, 'amountDue', 0) + transaction.amount;
                itemToBeUpdated.amountDue += _.get(itemToBeUpdated, 'pending', 0);
                itemToBeUpdated.pending = 0;
                itemToBeUpdated.dueDate = new Date(item.dueDate).next().month().getTime();
            }
            updateItem(itemToBeUpdated, Cards);
        }

        function updateUserUtilities(item){
            var itemToBeUpdated = userUtilities.$getRecord(item.$id) || {};

            itemToBeUpdated.dueDate = new Date(item.dueDate).next().month().getTime();
            updateItem(itemToBeUpdated, userUtilities);
        }

        function updateItem(itemToBeUpdated, Items) {
            if (itemToBeUpdated.$id) {
                Items.$save(itemToBeUpdated);
            }
            $timeout(function () {
                calculateRemainingDays();
            });
        }
    }

}(angular, _));
