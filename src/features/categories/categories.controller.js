(function (angular) {
    'use strict';
    angular
        .module('app.categories')
        .controller('CategoriesController', CategoriesController);

    function CategoriesController(svsGetDataService) {
        var categoriesVm = this;

        init();

        function init() {
            categoriesVm.data = svsGetDataService.getCategoriesData();
        }
    }
}(angular));
