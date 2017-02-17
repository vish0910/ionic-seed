(function (angular) {
    'use strict';
    angular
        .module('app.creditcards')
        .controller('CreditcardsController', CreditcardsController);

    function CreditcardsController (svsGetDataService) {
        var creditcardsVm = this;

        init();

        function init (){
            creditcardsVm.data = getData('CREDIT_CARDS');
        }

        function getData(type){
            return svsGetDataService.getData(type);
        }
    }
} (angular));
