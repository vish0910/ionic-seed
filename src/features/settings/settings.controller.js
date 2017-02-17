(function (angular) {
    'use strict';
    angular
        .module('app.settings')
        .controller('SettingsController', SettingsController);

    function SettingsController () {
        var settingsVm = this;

        init();
        function init(){
            settingsVm.settingsOptions = [
                {
                    option: 'Categories',
                    url: 'app.settings.categories'
                }
            ]
        }
    }
} (angular));
