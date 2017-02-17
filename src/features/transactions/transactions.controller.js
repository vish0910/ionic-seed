(function (angular) {
    'use strict';
    angular
        .module('app.transactions')
        .controller('TransactionsController', TransactionsController);

    function TransactionsController () {
        var transactionsVm = this;
    }
} (angular));
