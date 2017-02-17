(function (angular) {
    'use strict';

    angular
        .module('svs.svsGetData')
        .service('svsGetDataService', svsGetDataService);

    function svsGetDataService() {
        var self = this;

        self.getData = getData;

        function getData(type) {
            return (type === 'CATEGORIES') ? [
                {
                    used: 160,
                    budget: 100,
                    type: 'Food',
                    barColor: getColor(160, 100)
                }, {
                    used: 30,
                    budget: 200,
                    type: 'Gas',
                    barColor: getColor(30, 200)
                }
            ] : [
                {
                    dueDate: Date.now(),
                    used: 625,
                    budget: 10000,
                    type: 'Bank Of America',
                    barColor: getColor(625, 10000)
                }, {
                    dueDate: Date.now(),
                    used: 12030,
                    budget: 20000,
                    type: 'Citibank',
                    barColor: getColor(12030, 20000)
                }
            ]
        }

        function getColor(used, budget) {
            console.log('here');
            var value = (used / budget) * 100;
            var type;

            if (value < 25) {
                type = 'success';
            } else if (value < 75) {
                type = 'warning';
            } else {
                type = 'danger';
            }

            console.log(type);
            return type;
        }
    }

}(angular));
