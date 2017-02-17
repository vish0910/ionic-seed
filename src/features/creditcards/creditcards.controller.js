(function (angular) {
    'use strict';
    angular
        .module('app.creditcards')
        .controller('CreditcardsController', CreditcardsController);

    function CreditcardsController (svsGetDataService) {
        var creditcardsVm = this;

        init();

        function init (){
            creditcardsVm.data = svsGetDataService.getCreditCardsData();
        }
    }
} (angular));
