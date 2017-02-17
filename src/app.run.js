(function(angular) {
    'use strict';

    angular.module('app')
        .run(runConfig);

    // @ngInject
    function runConfig($ionicAnalytics, $ionicPlatform,
                       $timeout, $cordovaStatusbar, $window, $rootScope, $stateParams,
                       CONFIG, $cordovaPushV5, $state, $cordovaDevice, $ionicHistory) {
        $ionicPlatform.ready(function () {
            // register for analytics
            if(!CONFIG.devMode) $ionicAnalytics.register();

            // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
            // for form inputs)
            if ($window.navigator.splashscreen) $window.navigator.splashscreen.hide();


            if ($window.StatusBar) {
                // org.apache.cordova.statusbar required
                $cordovaStatusbar.style(1);
            }

            if ($window.cordova && $window.cordova.logger) {
                $window.cordova.logger.__onDeviceReady();
            }


            $rootScope.$on('cloud:push:notification', function(event, data) {
                var msg = data.message;
                alert(msg.title + ': ' + msg.text);
            });
        });

        $window.addEventListener('native.keyboardshow', function(){
            $window.document.body.classList.add('keyboard-open');
        });
    }
}(angular));
