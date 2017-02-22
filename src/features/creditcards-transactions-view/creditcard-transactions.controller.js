(function (angular) {
    'use strict';
    angular
        .module('app.creditCardTransactions')
        .controller('CreditCardTransactionsController', CreditCardTransactionsController);

    function CreditCardTransactionsController(svsGetDataService, $stateParams) {
        var vm = this;
        init();

        function init() {
            vm.cardName = $stateParams.creditcard;
            vm.data = svsGetDataService.getCreditCardsTransactionData($stateParams.creditcard);
        }


    }
}(angular));
