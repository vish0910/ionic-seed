(function (angular) {
    'use strict';

    angular
        .module('svs.svsGetData')
        .service('svsGetDataService', svsGetDataService);

    function svsGetDataService() {
        var self = this;
        var MONTH_NAMES = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        var date = new Date();
        // array of firstday and lastDay of the month starting from current month to current-12 month
        var monthArray = _.map(_.range(12), function(value){
            return {
                firstDay:new Date(date.getFullYear(), date.getMonth() - value, 1).getTime(),
                lastDay:new Date(date.getFullYear(), date.getMonth() - value + 1, 1).getTime()
            };
        });

        self.getCreditCardsData = getCreditCardsData;
        self.getCreditCardsTransactionData = getCreditCardsTransactionData;
        self.getCategoriesTransactionData = getCategoriesTransactionData;
        self.getCategoriesData = getCategoriesData;

        function getCreditCardsData(cards) {
            var data = _.map(cards, function(key){
                return {
                    budget: key.budget,
                    name: key.name,
                    used: key.amountDue,
                    barColor: getColor(_.get(key, 'amountDue', 0), key.budget, 25, 75)
                }
            });

            return _.sortBy(data, function (d) {
                return (d.budget / d.used)
            });

        }

        function getCreditCardsTransactionData(name, transaction) {
            var data = _
                .chain(transaction)
                .groupBy('card.name')
                .value();

            return data[name];
        }

        function getCategoriesTransactionData(name, transaction, month) {
            var data = _
                .chain(transaction)
                .filter(function(d) {
                    return _.inRange(d.date, monthArray[month||0].firstDay, monthArray[month||0].lastDay);
                })
                .groupBy('category.name')
                .value();

            return data[name];
        }

        function getCategoriesData(categories) {
            var transMonth = MONTH_NAMES[(new Date()).getMonth()];
            var transYear = (new Date()).getYear();
            var transKey = transMonth + transYear;
            var data = _.map(categories, function(key){
                return {
                    budget: key.budget,
                    name: key.name,
                    used: _.get(key, ['totals', transKey], 0),
                    barColor: getColor(_.get(key, ['totals', transKey], 0), key.budget, 25, 75)
                }
            });

            return _.sortBy(data, function (d) {
                return (d.budget / d.used)
            });
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
