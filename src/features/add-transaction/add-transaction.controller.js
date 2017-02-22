(function (angular) {
    'use strict';
    angular
        .module('app.addTransaction')
        .controller('AddTransactionController', AddTransactionController);

    function AddTransactionController(svsGetDataService) {
        var vm = this;
        var cards;
        var categories;

        vm.addTransaction = addTransaction;

        init();

        function init() {
            categories = svsGetDataService.getCategories();
            cards = svsGetDataService.getCards();

            vm.categories = {
                options: _.map(categories, _.property('name'))
            };

            vm.cards = {
                options: _.map(cards, _.property('name'))
            };
        }

        function addTransaction(obj) {
            var transaction = angular.copy(obj);

            _.set(transaction, 'date', obj.date.toISOString());

            svsGetDataService.putTransaction(transaction)
        }
    }
}(angular));
