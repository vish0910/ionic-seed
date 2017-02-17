(function (angular) {
    'use strict';
    angular
        .module('app.addTransaction')
        .controller('AddTransactionController', AddTransactionController);

    function AddTransactionController(svsGetDataService) {
        var addTransactionVm = this;
        var cards;
        var categories;
        addTransactionVm.addTransaction = addTransaction;

        init();

        function init() {
            categories = svsGetDataService.getCategories();
            cards = svsGetDataService.getCards();

            addTransactionVm.categories = {
                options: _.map(categories, _.property('name'))
            };

            addTransactionVm.cards = {
                options: _.map(cards, _.property('name'))
            };
        }

        function addTransaction(obj) {
            svsGetDataService.putTransaction(obj)
        }
    }
}(angular));
