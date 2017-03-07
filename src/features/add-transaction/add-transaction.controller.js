(function (angular) {
    'use strict';
    angular
        .module('app.addTransaction')
        .controller('AddTransactionController', AddTransactionController);

    function AddTransactionController(Categories, Cards, $firebaseArray, rootRef, Auth, ionicToast, $state) {
        var vm = this;
        var MONTH_NAMES = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

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

            $firebaseArray(rootRef.child('users').child(Auth.$getAuth().uid).child('transactions')).$add(transaction)
                .then(function () {
                    ionicToast.show('The transaction is added successfully', 'bottom', false, 2500);
                    $state.go('app.home.transactions')
                });

            updateCategory(vm.selectedCategory, transaction);
            updateCard(vm.selectedCard, transaction);
        }

        function updateCategory(item, transaction) {
            //TODO replace vm.selectedDate with item.duedate
            var itemToBeUpdated = Categories.$getRecord(item.$id) || {};
            var transMonth = MONTH_NAMES[vm.selectedDate.getMonth()];
            var transYear = vm.selectedDate.getYear();
            var transKey = transMonth + transYear;

            //Updating transaction total based on month and year
            _.set(itemToBeUpdated, ['totals', transKey], _.get(itemToBeUpdated, ['totals', transKey], 0) + transaction.amount);
            updateItem(itemToBeUpdated, Categories);
        }

        function updateCard(item, transaction) {
            var itemToBeUpdated = Cards.$getRecord(item.$id) || {};

            if (transaction.date > item.dueDate) {
                //TODO make sure future dated transactions cannot be added
                itemToBeUpdated.pending = _.get(itemToBeUpdated, 'pending', 0) + transaction.amount;
            } else {
                itemToBeUpdated.amountDue = _.get(itemToBeUpdated, 'amountDue', 0) + transaction.amount;
            }
            updateItem(itemToBeUpdated, Cards);
        }

        function updateItem(itemToBeUpdated, Items) {
            if (itemToBeUpdated.$id) {
                Items.$save(itemToBeUpdated);
            }
        }
    }
}(angular));
