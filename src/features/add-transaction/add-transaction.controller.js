(function (angular) {
    'use strict';
    angular
        .module('app.addTransaction')
        .controller('AddTransactionController', AddTransactionController);

    function AddTransactionController() {
        var addTransactionVm = this;

        addTransactionVm.categories = {
            options: ['Food', 'Clothing', 'Shelter']
        };

        addTransactionVm.cards = {
            options: ['BOFA', 'Citibank', 'Discover']
        };

        addTransactionVm.addTransaction = addTransaction;

        function addTransaction(obj){
console.log(obj)
        }
    }
}(angular));
