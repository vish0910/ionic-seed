(function (angular) {
    'use strict';
    angular
        .module('app.addTransaction')
        .controller('AddTransactionController', AddTransactionController);

    function AddTransactionController(Categories, Cards, $firebaseArray, rootRef, Auth) {
        var vm = this;

        vm.addTransaction = addTransaction;

        init();

        function init() {
            vm.categories = Categories;
            vm.cards = Cards;
            setDefaults();
        }

        function setDefaults() {
            vm.selectedCategory = Categories[0];
            vm.selectedCard = Cards[0];
            vm.selectedAmount = '';
            vm.selectedDate = new Date();
            vm.selectedDescription = ''
        }

        function addTransaction() {
            var transaction = {
                category: { name: vm.selectedCategory.name, id: vm.selectedCategory.$id },
                card: { name: vm.selectedCard.name, id: vm.selectedCard.$id },
                amount: vm.selectedAmount,
                date: vm.selectedDate.getTime(),
                description: vm.selectedDescription
            };

            $firebaseArray(rootRef.child('users').child(Auth.$getAuth().uid).child('transactions')).$add(transaction);
        }
    }
}(angular));
