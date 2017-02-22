(function (angular) {
    'use strict';
    angular
        .module('app.categories')
        .controller('CategoriesController', CategoriesController);

    function CategoriesController(svsGetDataService, $state) {
        var categoriesVm = this;
        categoriesVm.goToCategory = goToCategory;

        init();

        function init() {
            categoriesVm.data = svsGetDataService.getCategoriesData();
        }

        function goToCategory(data){
            $state.go('app.home.categoryTransactions', { category: data });
        }
    }
}(angular));
