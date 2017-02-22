(function (angular) {
    'use strict';
    angular
        .module('app.categoryTransactions')
        .controller('CategoryTransactionsController', CategoryTransactionsController);

    function CategoryTransactionsController(svsGetDataService, $stateParams) {
        var vm = this;
        init();

        function init() {
            vm.categoryName = $stateParams.category;
            vm.data = svsGetDataService.getCategoriesTransactionData($stateParams.category);
        }


    }
}(angular));
