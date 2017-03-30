angular
    .module('app.sideCategories')
    .controller('SideCategoriesCtrl', SideCategoriesCtrl);

function SideCategoriesCtrl($ionicModal, $q, $scope, DefaultCategories, userCategories, Transactions, $timeout, $ionicHistory) {
    var vm = this;
    var CATEGORY = 'CATEGORY';

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

        // to make all old transaction with that category name to other
        _.forEach(Transactions, function (d) {
            if (d.category.id === category.$id) {
                d.category.name = "other";

                Transactions.$save(d)
            }
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

        //Add default monthly dueDate;
        categoryData.dueDate = getEndOfCurrentMonth();

        //Add type
        categoryData.type = CATEGORY;

        // save existing data if key is present, else add
        category.key ? userCategories.$save(categoryData) : userCategories.$add(categoryData);

        // wait to load page so vm.suggestedCategories updates
        $timeout(function () {
            vm.suggestedCategories = _.difference(_.map(DefaultCategories, 'name'), _.map(userCategories, 'name'));
        });
        $scope.modal.hide();
    };

    function getEndOfCurrentMonth(){
            var date = new Date();
            var y = date.getFullYear();
            var m = date.getMonth() + 1;

        //TODO replace getTime with setHours()
            return (new Date(y, m, 0).getTime() + 86399999); //to got to 23.59.59 of that day
    }

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
        $ionicHistory.clearCache().then(function () {
            $scope.modal.show($scope.category);
        });
    }

}
