(function (angular) {
    'use strict';

    angular
        .module('svs.svsGetData')
        .service('svsGetDataService', svsGetDataService);

    function svsGetDataService() {
        var self = this;

        self.putTransaction = putTransaction;
        self.getTransaction = getTransaction;
        self.getCreditCardsData = getCreditCardsData;
        self.getCreditCardsTransactionData = getCreditCardsTransactionData;
        self.getCategoriesTransactionData = getCategoriesTransactionData;
        self.getCategoriesData = getCategoriesData;
        self.getCategories = getCategories;
        self.getCards = getCards;
        self.getUtilities = getUtilities;
        self.setCategories = setCategories;
        self.setCards = setCards;
        self.setUtilities = setUtilities;

        var transaction = [
            {
                "amount": 10,
                "description": "MacD",
                "date": "2017-02-17T06:00:00.000Z",
                "category": "Eating Out",
                "card": "American Express"
            },
            {
                "amount": 30,
                "description": "Vodka",
                "date": "2017-02-01T06:00:00.000Z",
                "category": "Nightlife",
                "card": "Bank Of America"
            },
            {
                "amount": 20,
                "description": "Jeans",
                "date": "2017-02-05T06:00:00.000Z",
                "category": "Clothing",
                "card": "Bank Of America"
            },
            {
                "amount": 56,
                "description": "Costco",
                "date": "2017-02-12T06:00:00.000Z",
                "category": "Groceries",
                "card": "Citi"
            },
            {
                "amount": 10,
                "description": "uber",
                "date": "2017-02-16T06:00:00.000Z",
                "category": "Travel",
                "card": "Citi"
            }];
        var categories = [
            { name: 'Business', budget: 300 },
            { name: 'Car/Transport', budget: 400 },
            { name: 'Clothing', budget: 100 },
            { name: 'Eating Out', budget: 200 },
            { name: 'Education', budget: 50 },
            { name: 'Electronics', budget: 200 },
            { name: 'Fun', budget: 300 },
            { name: 'Groceries', budget: 200 },
            { name: 'Health', budget: 50 },
            { name: 'Nightlife', budget: 300 },
            { name: 'Shopping', budget: 200 },
            { name: 'Travel', budget: 300 }
        ];
        var cards = [
            { name: 'Chase', dueDate: "2017-03-17T06:00:00.000Z", limit: 1000 },
            { name: 'Bank Of America', dueDate: "2017-03-11T06:00:00.000Z", limit: 2000 },
            { name: 'Citi', dueDate: "2017-02-27T06:00:00.000Z", limit: 1000 },
            { name: 'American Express', dueDate: "2017-03-03T06:00:00.000Z", limit: 2000 },
            { name: 'Chase Sapphire', dueDate: "2017-02-25T06:00:00.000Z", limit: 1000 }
        ];
        var utilities = [
            { name: 'Electricity', dueDate: "2017-02-17T06:00:00.000Z" },
            { name: 'Telephone', dueDate: "2017-03-11T06:00:00.000Z" },
            { name: 'Mobile', dueDate: "2017-03-27T06:00:00.000Z" },
            { name: 'Internet', dueDate: "2017-02-03T06:00:00.000Z" },
            { name: 'Car Insurance', dueDate: "2017-02-25T06:00:00.000Z" },
            { name: 'Home Insurance', dueDate: "2017-02-20T06:00:00.000Z" },
            { name: 'Home Rent', dueDate: "2017-03-25T06:00:00.000Z" }
        ];

        function getCategories() {
            return categories;
        }

        function setCategories() {
            categories.push(data);
        }

        function getCards() {
            return cards;
        }

        function setCards(data) {
            cards.push(data);
        }

        function getUtilities() {
            return utilities;
        }

        function setUtilities(data) {
            utilities.push(data);
        }

        function getCreditCardsData() {
            var data =
                _.chain(transaction)
                    .groupBy('card')
                    .map(function (value, key) {
                        return {
                            dueDate: Date.now(),
                            budget: _.random(1000, 2000),
                            type: key,
                            used: _.sum(_.pluck(value, 'amount'))
                        }
                    })
                    .value();

            _.forEach(data, function (d) {
                d.barColor = getColor(d.used, d.budget, 25, 35)
            });

            return _.sortBy(data, function (d) {
                return (d.budget / d.used)
            });

        }

        function getCreditCardsTransactionData(type) {
            var data = _
                .chain(transaction)
                .groupBy('card')
                .value();

            return data[type];
        }

        function getCategoriesTransactionData(type) {
            var data = _
                .chain(transaction)
                .groupBy('category')
                .value();

            return data[type];
        }

        function getCategoriesData() {
            var data =
                _.chain(transaction)
                    .groupBy('category')
                    .map(function (value, key) {
                        return {
                            budget: _.random(100, 200),
                            type: key,
                            used: _.sum(_.pluck(value, 'amount'))
                        }
                    })
                    .value();

            _.forEach(data, function (d) {
                d.barColor = getColor(d.used, d.budget, 25, 75)
            });

            return _.sortBy(data, function (d) {
                return (d.budget / d.used)
            });
        }

        function getTransaction() {
            return _.sortByOrder(transaction, 'date', 'desc')
        }

        function putTransaction(data) {
            transaction.push(data);
        }

        function getColor(used, budget, min, max) {
            var value = (used / budget) * 100;
            var type;

            if (value < min) {
                type = 'success';
            } else if (value < max) {
                type = 'warning';
            } else {
                type = 'danger';
            }

            return type;
        }
    }

}(angular));
