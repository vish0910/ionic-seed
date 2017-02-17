(function (angular) {
    'use strict';
    angular
        .module('app.categories')
        .controller('CategoriesController', CategoriesController);

    function CategoriesController(svsGetDataService) {
        var catagoriesVm = this;

        init();

        function init() {
            catagoriesVm.data = getCategoriesData();
        }

        function getCategoriesData() {
            return svsGetDataService.getData('CATEGORIES');
        }
    }
}(angular));
