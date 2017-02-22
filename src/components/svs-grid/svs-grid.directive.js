(function (angular) {
    'use strict';
    angular
        .module('svs.svsGrid')
        .directive('svsGrid', svsGrid);

    function svsGrid() {
        return {
            restrict: 'E',
            templateUrl: 'components/svs-grid/svs-grid.html',
            scope: {},
            bindToController:{
                data: '=',
                sortBy : '='
            },
            controller: 'svsGridController',
            controllerAs: 'svsGridVm'
        };
    }

}(angular));
