(function (angular) {
    'use strict';
    angular
        .module('app.creditcards')
        .controller('CreditcardsController', CreditcardsController);

    function CreditcardsController (svsGetDataService, $state, Transactions, Cards) {
        var creditcardsVm = this;
        creditcardsVm.goToCard = goToCard;

        init();

        function init (){
            creditcardsVm.data = svsGetDataService.getCreditCardsData(Cards);
        }

        function goToCard(data){
            $state.go('app.home.creditCardTransactions', { creditcard: data, transactions: Transactions });
        }
    }
} (angular));
