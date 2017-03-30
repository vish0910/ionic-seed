angular
    .module('app.sideUtilities')
    .controller('SideUtilitiesCtrl', SideUtilitiesCtrl);

function SideUtilitiesCtrl($ionicModal, $scope, DefaultUtilities, userUtilities, $timeout, $ionicHistory, svsNotificationService) {
    var vm = this;
    var UTILITY = 'UTILITY';

    vm.openEditModal = openEditModal;
    vm.openAddModal = openAddModal;
    vm.deleteUtility = deleteUtility;

    init();

    function init() {
        vm.usersUtilities = userUtilities;
        vm.suggestedUtilities = _.difference(_.map(DefaultUtilities, 'name'), _.map(userUtilities, 'name'));
    }

    function deleteUtility(utility) {
        userUtilities.$remove(utility); // remove utility from firebase

        // wait to load page so vm.suggestedUtilities updates
        $timeout(function () {
            vm.suggestedUtilities = _.difference(_.map(DefaultUtilities, 'name'), _.map(userUtilities, 'name'));
        });

        //Remove associated notification if exists
        removeNotification(utility);
    }

    $ionicModal.fromTemplateUrl('features/side-utilities-view/add-utility.html', {
        scope: $scope,
        animation: 'slide-in-up',
        focusFirstInput: true
    }).then(function (modal) {
        $scope.modal = modal;
    });

    $scope.addUtility = function (utility) {
        // edit existing data if key is present
        var utilityData = userUtilities.$getRecord(utility.key) || {};

        utilityData.name = utility.name;
        utilityData.dueDate = utility.dueDate.getTime();

        //For notifications
        utilityData.notification_id = new Date().getTime();
        utilityData.notification = true;
        utilityData.recurring = true;

        //Add type
        utilityData.type = UTILITY;

        //Create notification
        createNotification(utilityData);

        // save existing data if key is present, else add
        utility.key ? userUtilities.$save(utilityData) : userUtilities.$add(utilityData);

        // wait to load page so vm.suggestedUtilities updates
        $timeout(function () {
            vm.suggestedUtilities = _.difference(_.map(DefaultUtilities, 'name'), _.map(userUtilities, 'name'));
        });
        $scope.modal.hide();
    };

    function createNotification(item) {
        var config = {
            id: item.notification_id,
            title: 'Payment Reminder',
            text: item.name + ' bill is due soon',
            every: (item.recurring) ? 'month' : undefined,
            autoClear: true,
            at: new Date(item.dueDate).setHours(0,0,0,0)
        };
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

    function openEditModal(utility) {
        $scope.utility = {
            name: utility.name,
            dueDate: new Date(utility.dueDate),
            key: userUtilities.$keyAt(utility)
        };
        $scope.modal.show($scope.utility);

    }

    function openAddModal(utilityName) {
        if (vm.data) {
            vm.data.showDelete = false;
        }
        if (utilityName) {
            $scope.utility = {
                name: utilityName
            };
        }
        else {
            $scope.utility = {}
        }
        $ionicHistory.clearCache().then(function () {
            $scope.modal.show($scope.utility);
        });
    }
}
