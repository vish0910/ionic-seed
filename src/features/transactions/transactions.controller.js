(function (angular, _) {
    'use strict';
    angular
        .module('app.transactions')
        .controller('TransactionsController', TransactionsController);

    function TransactionsController(Transactions) {
        var vm = this;
        init();

        function init() {
            vm.data = Transactions;
        }

    }
}(angular, _));
