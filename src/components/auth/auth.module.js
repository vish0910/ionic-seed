(function (angular) {
    'use strict';

    /**
     * @namespace summit.auth
     */
    angular
        .module('app.auth', [
            // 3rd Party Dependencies
            'ui.router'
        ])
        .config(config);

    // @ngInject
    function config($httpProvider) {
    }
}(angular));
