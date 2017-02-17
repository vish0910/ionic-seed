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
                requester: '=?',
                type:'=?',
                fromDate:'=?',
                toDate:'=?'
            },
            controller: 'svsGridController',
            controllerAs: 'svsGridVm'
        };
    }

}(angular));
