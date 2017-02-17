(function (angular) {
    'use strict';
    angular
        .module('app.categories', ['svs.svsGetData'])
        .config(categoriesConfig);

    function categoriesConfig($stateProvider) {
        $stateProvider
            .state('app.home.categories', {
                url: '/categories',
                views: {
                    'categoriesView': {
                        templateUrl: 'features/categories/categories.html',
                        controller: 'CategoriesController as categoriesVm'
                    }
                },
                data: {
                    authenticate: false
                }
            });
    }
}(angular));
