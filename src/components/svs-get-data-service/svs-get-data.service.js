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
        self.setCategory = setCategory;
        self.deleteCategory = deleteCategory;
        self.setCard = setCard;
        self.deleteCard = deleteCard;
        self.setUtility = setUtility;
        self.deleteUtility = deleteUtility;

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
            { name: 'Clothing', budget: 100 },
            { name: 'Eating Out', budget: 200 },
            { name: 'Groceries', budget: 200 },
            { name: 'Nightlife', budget: 300 },
            { name: 'Travel', budget: 300 }
        ];
        var cards = [
            { name: 'Chase', dueDate: "2017-03-17T06:00:00.000Z", budget: 1000 },
            { name: 'Bank Of America', dueDate: "2017-03-11T06:00:00.000Z", budget: 2000 },
            { name: 'Citi', dueDate: "2017-02-27T06:00:00.000Z", budget: 1000 },
            { name: 'American Express', dueDate: "2017-03-03T06:00:00.000Z", budget: 2000 },
            { name: 'Chase Sapphire', dueDate: "2017-02-25T06:00:00.000Z", budget: 1000 }
        ];
        var utilities = [
            { name: 'Electricity', dueDate: "2017-02-17T06:00:00.000Z" },
            { name: 'Telephone', dueDate: "2017-03-11T06:00:00.000Z" },
            { name: 'Mobile', dueDate: "2017-03-27T06:00:00.000Z" }
        ];

        function getCategories() {
            return categories;
        }

        function setCategory(data) {
            if (data.name && data.budget) {
                _.mergeById(categories, data, 'name')
            }
        }

        function deleteCategory(data) {
            if (data.name) {
                _.remove(categories, {
                    name: data.name
                });

                // to make all old transaction with that category name to other
                _.map(transaction, function (d) {
                    if (d.category === data.name) {
                        d.category = "other"
                    }
                    return d;
                })
            }
        }

        function getCards() {
            return cards;
        }

        function setCard(data) {
            if (data.name && data.budget && data.dueDate) {
                _.mergeById(cards, data, 'name')
            }
        }

        function deleteCard(data) {
            if (data.name) {
                _.remove(cards, {
                    name: data.name
                });

                // to make all old transaction with that card name to other
                _.map(transaction, function (d) {
                    if (d.card === data.name) {
                        d.card = "other"
                    }
                    return d;
                })
            }
        }

        function getUtilities() {
            return utilities;
        }

        function setUtility(data) {
            if (data.name && data.dueDate) {
                _.mergeById(utilities, data, 'name')
            }
        }

        function deleteUtility(data) {
            if (data.name) {
                _.remove(utilities, {
                    name: data.name
                });
            }
        }

        function getCreditCardsData() {
            var data =
                _.chain(transaction)
                    .groupBy('card')
                    .omit(function (transaction) {
                        return transaction[0].card === 'other'
                    })
                    .map(function (value, key) {
                        return {
                            dueDate: Date.now(),
                            budget: _.filter(cards, { 'name': key })[0].budget,
                            name: key,
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

        function getCreditCardsTransactionData(name) {
            var data = _
                .chain(transaction)
                .groupBy('card')
                .value();

            return data[name];
        }

        function getCategoriesTransactionData(name) {
            var data = _
                .chain(transaction)
                .groupBy('category')
                .value();

            return data[name];
        }

        function getCategoriesData() {
            var data =
                _.chain(transaction)
                    .groupBy('category')
                    .omit(function (transaction) {
                        return transaction[0].category === 'other'
                    })
                    .map(function (value, key) {
                        return {
                            budget: _.filter(categories, { 'name': key })[0].budget,
                            name: key,
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
            return transaction;
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

        _.mixin({
            mergeById: function mergeById(arr, obj, idProp) {
                var index = _.findIndex(arr, function (elem) {
                    // double check, since undefined === undefined
                    return typeof elem[idProp] !== "undefined" && elem[idProp] === obj[idProp];
                });

                if (index > -1) {
                    arr[index] = obj;
                } else {
                    arr.push(obj);
                }

                return arr;
            }
        });
    }

}(angular));
