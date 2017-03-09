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
        $scope.uncheckRecurring = uncheckRecurring;
        $scope.dismissReminder = dismissReminder;
        $scope.closeReminderPopover = closeReminderPopover;
        $scope.modifyNotification = modifyNotification;

        $scope.closeAddTransactionModal = closeAddTransactionModal;
        $scope.addPaymentTransaction = addPaymentTransaction;

        remindersVm.openReminderPopover = openReminderPopover;
        remindersVm.removeAllNotifications = svsNotificationService.removeAllNotifications;
        remindersVm.getAllNotifications = svsNotificationService.getAllNotifications;
        remindersVm.getNotificationObj = svsNotificationService.getNotificationObj;
        init();
        function init() {

            calculateRemainingDays();
            $ionicPopover.fromTemplateUrl(POPOVER_TEMPLATE, {
                scope: $scope,
                backdropClickToClose: false
            }).then(function (popover) {
                remindersVm.popover = popover;
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

        function uncheckRecurring(item) {
            if (!item.notification) {
                item.recurring = false;
            }
        }

        function modifyNotification(item) {
            var config = {
                id: item.notification_id,
                title: 'Payment Reminder',
                text: item.name + ' bill is due soon',
                every: (item.recurring) ? 'month' : undefined,
                autoClear: true,
                at: new Date(item.dueDate).setHours(0,0,0,0)
            };
            //new Date(new Date(item.dueDate).getTime() + 10 * 1000)
            //at: new Date(new Date().getTime() + 10 * 1000)
            console.log("Notification modified as:");
            console.log(config);
            return svsNotificationService.addNotification(config);
        }

        function removeNotification(item) {
            return svsNotificationService.getNotification(item.notification_id)
                .then(function (value) {
                    console.log(value);
                    if (value) {
                        return svsNotificationService.removeNotification(item.notification_id);
                    }
                });
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
                saveNotificationConfig(item, true);
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

        function saveNotificationConfig(item, mod) {
            if (item.notification) {
                modifyNotification(item)
                    .then(function (v) {
                        //update item
                        if (mod) {
                            ionicToast.show('Notification updated.', 'bottom', false, 2500);
                            saveReminderProperties(item);
                        }
                    });
            } else {
                removeNotification(item)
                    .then(function (v) {
                        //update item
                        if (mod) {
                            ionicToast.show('Notification removed.', 'bottom', false, 2500);
                            saveReminderProperties(item);
                        }
                    });
            }
        }

        function saveReminderProperties(item) {
            console.log('save reminder item');

            var Items = (item.type == 'CARD') ? Cards : userUtilities;

            var itemToBeUpdated = Items.$getRecord(item.$id) || {};


            itemToBeUpdated.notification = item.notification;
            itemToBeUpdated.recurring = item.recurring;
            console.log(Items);
            console.log(item);
            updateItem(itemToBeUpdated, Items);
        }

        function reminderConfigChanged(item) {
            console.log("New item vvvv");
            console.log(item);
            console.log("Old item vvvv");
            console.log(oldReminder);
            return (item.notification != _.get(oldReminder, 'notification') || item.recurring != _.get(oldReminder, 'recurring'))
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

        function openAddTransactionModal(item) {
            oldReminder = angular.copy(item);
            $scope.selectedReminder = item;
            $ionicModal.fromTemplateUrl(ADD_TRANSACTION_MODAL_TEMPLATE, {
                scope: $scope,
                animation: 'slide-in-up'
            }).then(function (modal) {
                remindersVm.modal = modal;
                remindersVm.modal.show();
            });
        }

        function closeAddTransactionModal(item) {
            cleanModal(item);
        }

        function cleanModal() {
            console.log("here");
            oldReminder = null;
            remindersVm.amountPaid = undefined;
            remindersVm.modal.remove();
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
                amount: -(remindersVm.amountPaid),
                date: item.dueDate,
                description: 'Bill Paid'
            };

            $firebaseArray(rootRef.child('users').child(Auth.$getAuth().uid).child('transactions')).$add(transaction)
                .then(function () {
                    ionicToast.show('The transaction is added successfully', 'bottom', false, 2500);
                });


            updateCard(item, transaction);
            cleanModal();
            cleanPopover();
        }

        function updateCard(item, transaction) {
            var itemToBeUpdated = Cards.$getRecord(item.$id) || {};

            itemToBeUpdated.lastAmountPaid = remindersVm.amountPaid;
            itemToBeUpdated.amountDue = _.get(itemToBeUpdated, 'amountDue', 0) + transaction.amount;
            if (Math.abs(transaction.amount) >= item.amountDue) {
                itemToBeUpdated.amountDue += _.get(itemToBeUpdated, 'pending', 0);
                itemToBeUpdated.pending = 0;
                updateDueDate(itemToBeUpdated);
            }
            updateItem(itemToBeUpdated, Cards);
        }

        function updateUserUtilities(item) {
            var itemToBeUpdated = userUtilities.$getRecord(item.$id) || {};

            updateDueDate(itemToBeUpdated);
            updateItem(itemToBeUpdated, userUtilities);
        }

        function updateDueDate(itemToBeUpdated) {
            itemToBeUpdated.dueDate = new Date(itemToBeUpdated.dueDate).next().month().setHours(23, 59, 59, 999);
            //itemToBeUpdated.dueDate = new Date(new Date().getTime() + 60 * 1000);
            saveNotificationConfig(itemToBeUpdated);
        }

        function updateItem(itemToBeUpdated, Items) {
            console.log('update item');
            console.log(itemToBeUpdated);
            if (itemToBeUpdated.$id) {
                Items.$save(itemToBeUpdated);
            }
            $timeout(function () {
                calculateRemainingDays();
            });
        }
    }

}(angular, _));
