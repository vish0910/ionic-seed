(function (angular) {
    'use strict';
    angular
        .module('app.categoryTransactions')
        .controller('CategoryTransactionsController', CategoryTransactionsController);

    function CategoryTransactionsController(svsGetDataService, $stateParams, $timeout) {
        var vm = this;
        var MONTH_NAMES = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        var currentMonth = new Date().getMonth();
        var currentYear = new Date().getYear();
        var categoryData = _.find($stateParams.categories, ['name', $stateParams.category]);

        init();

        function init() {
            vm.categoryName = $stateParams.category;
            vm.data = svsGetDataService.getCategoriesTransactionData($stateParams.category, $stateParams.transactions);
            vm.options = {
                chart: getChartOption()
            };
            vm.graphDate = [{
                values: [
                    {
                        "label": monthInSmallFormat(currentMonth - 2),
                        "value": totalForSelectedMonth(currentMonth - 2)
                    },
                    {
                        "label": monthInSmallFormat(currentMonth - 1),
                        "value": totalForSelectedMonth(currentMonth - 1)
                    },
                    {
                        "label": monthInSmallFormat(currentMonth),
                        "value": totalForSelectedMonth(currentMonth)
                    }
                ]
            }];
        }

        function getChartOption() {
            return {
                type: 'discreteBarChart',
                height: 250,
                margin: {
                    top: 20,
                    right: 20,
                    bottom: 40,
                    left: 20
                },
                x: function (d) {
                    return d.label;
                },
                y: function (d) {
                    return d.value;
                },
                showValues: true,
                valueFormat: function (d) {
                    return d3.format('$.2f')(d);
                },
                color: ['#AEC7E8', '#AEC7E8', '#145486'],
                duration: 500,
                discretebar: {
                    dispatch: {
                        elementClick: function (e) {
                            getBarData(e)
                        }
                    }
                }
            }
        }

        function getBarData(e) {
            d3.selectAll("rect").style("fill", function (d, i) {
                return i === e.index + 1 ? "#145486" : "#AEC7E8";
            });
            $timeout(function () {
                vm.data = svsGetDataService.getCategoriesTransactionData($stateParams.category, $stateParams.transactions, 2 - e.index);
            })
        }

        function monthInSmallFormat(n) {
            return _.nth(MONTH_NAMES, n);    // used lodash to handle array[-1] = last
        }

        function totalForSelectedMonth(month) {
            var monthYear = monthInSmallFormat(month) + (month < 0 ? currentYear - 1 : currentYear);
            return _.get(categoryData, ['totals', monthYear], 0)
        }
    }
}(angular));
