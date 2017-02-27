angular
    .module('app.sideUtilities')
    .controller('SideUtilitiesCtrl', SideUtilitiesCtrl);

function SideUtilitiesCtrl(svsGetDataService, $ionicModal, $scope) {
    var vm = this;
    var Utilities = [
        { name: 'Internet' },
        { name: 'Car Insurance' },
        { name: 'Home Insurance' },
        { name: 'Home Rent' },
        { name: 'Health Insurance' },
        { name: 'Dental Insurance' },
        { name: 'Electricity' },
        { name: 'Telephone' },
        { name: 'Mobile' }
    ];

    vm.openEditModal = openEditModal;
    vm.openAddModal = openAddModal;
    vm.deleteUtility = deleteUtility;

    init();

    function init() {
        vm.usersUtilities = svsGetDataService.getUtilities();
        vm.suggestedUtilities = _.difference(_.map(Utilities, 'name'), _.map(vm.usersUtilities, 'name'));
    }

    function deleteUtility(utility) {
        svsGetDataService.deleteUtility(utility);
        vm.suggestedUtilities = _.difference(_.map(Utilities, 'name'), _.map(vm.usersUtilities, 'name'));
    }

    $ionicModal.fromTemplateUrl('features/side-utilities-view/add-utility.html', {
        scope: $scope,
        animation: 'slide-in-up',
        focusFirstInput: true
    }).then(function (modal) {
        $scope.modal = modal;
    });

    $scope.addUtility = function (data) {
        svsGetDataService.setUtility(data);
        vm.suggestedUtilities = _.difference(_.map(Utilities, 'name'), _.map(vm.usersUtilities, 'name'));
        $scope.modal.hide();
    };

    function openEditModal(utility) {
        $scope.utility = {
            name: utility.name,
            dueDate: new Date(utility.dueDate)
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
