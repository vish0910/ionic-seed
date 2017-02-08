(function(angular) {
    'use strict';

    angular.module('app')
        .run(runConfig);

    // @ngInject
    function runConfig($ionicAnalytics, $ionicPlatform,
                       $timeout, $cordovaStatusbar, $window, $rootScope, $stateParams,
                       ionicMaterialInk, CONFIG, $cordovaPushV5, $state, $cordovaDevice, $ionicHistory) {
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

            $rootScope.$on('$cordovaPushV5:notificationReceived', function(event, data) {
               

            });

            $rootScope.$on('$cordovaPushV5:errorOccurred', function(event, error) {
               
            });

        });

        $window.addEventListener('native.keyboardshow', function(){
            $window.document.body.classList.add('keyboard-open');
        });
    }
}(angular));
