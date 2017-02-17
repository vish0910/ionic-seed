(function (angular) {
    'use strict';
    angular
        .module('app.transactions')
        .controller('TransactionsController', TransactionsController);

    function TransactionsController(svsGetDataService) {
        var vm = this;
        init();

        function init() {
            vm.data = svsGetDataService.getTransaction();
        }

    }
}(angular));
