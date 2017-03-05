angular
    .module('app.sideUtilities')
    .controller('SideUtilitiesCtrl', SideUtilitiesCtrl);

function SideUtilitiesCtrl($ionicModal, $scope, DefaultUtilities, userUtilities, $timeout) {
    var vm = this;

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
        utilityData.notification_id = utilityData.dueDate;
        utilityData.notification = true;
        utilityData.recurring = true;

        //TODO Create notification

        // save existing data if key is present, else add
        utility.key ? userUtilities.$save(utilityData) : userUtilities.$add(utilityData);

        // wait to load page so vm.suggestedUtilities updates
        $timeout(function () {
            vm.suggestedUtilities = _.difference(_.map(DefaultUtilities, 'name'), _.map(userUtilities, 'name'));
        });
        $scope.modal.hide();
    };

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
        $scope.modal.show($scope.utility);
    }
}
