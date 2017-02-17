(function (angular, _) {
    'use strict';

    angular
        .module('svs.svsGrid')
        .controller('svsGridController', svsGridController);

    function svsGridController() {
        //var svsGridVm = this;

        //console.log(svsGridVm.data);

        //svsGridVm.onItemHold = onItemHold;

        //init();

        // function init() {
        //     svsGridVm.data = filterTransactions(svsGridVm.requester, svsGridVm.type, svsGridVm.fromDate, svsGridVm.toDate);
        // }

        // function onItemHold(){
        //     //Show menu
        //     console.log('hold');
        // }

        // function filterTransactions(requester, type, fromDate, toDate) {
        //     var data = [];
        //
        //     for (var i = 0; i < 10; i++) {
        //         data.push({
        //             date: randomDate(new Date(2012, 0, 1), new Date()),
        //             description: 'Description',
        //             category: 'Food',
        //             card: 'BOFA',
        //             amount: 45
        //         });
        //     }
        //
        //     return data;
        // }
        //
        // function randomDate(start, end) {
        //     return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
        // }
    }
}(angular, _));
