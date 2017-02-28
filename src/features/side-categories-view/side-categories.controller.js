angular
    .module('app.sideCategories')
    .controller('SideCategoriesCtrl', SideCategoriesCtrl);

function SideCategoriesCtrl($ionicModal, $scope, DefaultCategories, userCategories, $timeout) {
    var vm = this;

    vm.openEditModal = openEditModal;
    vm.openAddModal = openAddModal;
    vm.deleteCategory = deleteCategory;

    init();

    function init() {
        vm.usersCategories = userCategories;
        vm.suggestedCategories = _.difference(_.map(DefaultCategories, 'name'), _.map(userCategories, 'name'));
    }

    function deleteCategory(category) {
        userCategories.$remove(category); // remove category from firebase

        // wait to load page so vm.suggestedCategories updates
        $timeout(function () {
            vm.suggestedCategories = _.difference(_.map(DefaultCategories, 'name'), _.map(userCategories, 'name'));
        });
    }

    $ionicModal.fromTemplateUrl('features/side-categories-view/add-category.html', {
        scope: $scope,
        animation: 'slide-in-up',
        focusFirstInput: true
    }).then(function (modal) {
        $scope.modal = modal;
    });

    $scope.addCategory = function (category) {
        // edit existing data if key is present
        var categoryData = userCategories.$getRecord(category.key) || {};

        categoryData.name = category.name;
        categoryData.budget = category.budget;

        // save existing data if key is present, else add
        category.key ? userCategories.$save(categoryData) : userCategories.$add(categoryData);

        // wait to load page so vm.suggestedCategories updates
        $timeout(function () {
            vm.suggestedCategories = _.difference(_.map(DefaultCategories, 'name'), _.map(userCategories, 'name'));
        });
        $scope.modal.hide();
    };

    function openEditModal(category) {
        $scope.category = {
            name: category.name,
            budget: category.budget,
            key: userCategories.$keyAt(category)
        };
        $scope.modal.show($scope.category);

    }

    function openAddModal(categoryName) {
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
