(function (angular) {
    'use strict';
    angular
        .module('app.sideCategories', [])
        .config(settingsConfig);

    function settingsConfig($stateProvider) {
        $stateProvider
            .state('app.home.category', {
                url: '/category',
                views: {
                    'sideCategoryView': {
                        templateUrl: 'features/side-categories-view/side-categories.html',
                        controller: 'SideCategoriesCtrl as Vm'
                    }
                },
                data: {
                    authenticate: false
                }
            });
    }
}(angular));
