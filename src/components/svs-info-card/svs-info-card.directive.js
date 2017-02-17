(function (angular) {
    'use strict';

    angular
        .module('svs.svsInfoCard')
        .directive('svsInfoCard', svsInfoCard);

    function svsInfoCard() {
        return {
            restrict: 'E',
            controller: 'svsInfoCardController',
            controllerAs: 'svsInfoCardVm',
            scope: {},
            bindToController: {
                data: '='
            },
            templateUrl: 'components/svs-info-card/svs-info-card.html'
        }
    }
}(angular));
