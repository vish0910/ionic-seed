(function (angular) {
    'use strict';
    angular
        .module('app.creditcards')
        .controller('CreditcardsController', CreditcardsController);

    function CreditcardsController (svsGetDataService, $state) {
        var creditcardsVm = this;
        creditcardsVm.goToCard = goToCard;

        init();

        function init (){
            creditcardsVm.data = svsGetDataService.getCreditCardsData();
        }

        function goToCard(data){
            $state.go('app.home.creditCardTransactions', { creditcard: data });
        }
    }
} (angular));
