angular
    .module('app.sideCategories')
    .controller('SideCategoriesCtrl', SideCategoriesCtrl);

function SideCategoriesCtrl(svsGetDataService, $ionicModal, $scope) {
    var vm = this;
    var Categories = ['Business', 'Car/Transport', 'Clothing', 'Eating Out', 'Education', 'Electronics', 'Fun',
        'Groceries', 'Health', 'Nightlife', 'Shopping', 'Travel'];

    vm.openEditModal = openEditModal;
    vm.openAddModal = openAddModal;
    vm.deleteCategory = deleteCategory;

    init();

    function init(){
        vm.usersCategories = svsGetDataService.getCategories();
        vm.suggestedCategories = _.difference(Categories,_.map(vm.usersCategories, 'name'));
    }

    function deleteCategory(category){
        svsGetDataService.deleteCategory(category);
        vm.suggestedCategories = _.difference(Categories,_.map(vm.usersCategories, 'name'));
    }

    $ionicModal.fromTemplateUrl('features/side-categories-view/add-category.html', {
        scope: $scope,
        animation: 'slide-in-up',
        focusFirstInput: true
    }).then(function(modal) {
        $scope.modal = modal;
    });

    $scope.addCategory = function(data) {
        svsGetDataService.setCategory(data);
        vm.suggestedCategories = _.difference(Categories,_.map(vm.usersCategories, 'name'));
        $scope.modal.hide();
    };

    function openEditModal(category) {
        $scope.category = {
            name: category.name,
            budget: category.budget
        };
        $scope.modal.show($scope.category);

    }

    function openAddModal(categoryName){
        if (vm.data) {
            vm.data.showDelete = false;
        }
        if (categoryName) {
            $scope.category = {
                name: categoryName
            };
        }
        else {
            $scope.category = {}
        }
        $scope.modal.show($scope.category);
    }

}
