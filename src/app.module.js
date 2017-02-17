(function (angular) {
    'use strict';

    angular.module('app', [
        // 3rd party
        'ionic',
        'ionic.cloud',
        'ionic.service.core', // needed for ionic analytics
        'ionic.service.analytics',
        'ngCordova',
        'tmh.dynamicLocale',
        'pascalprecht.translate',
        'ngIOS9UIWebViewPatch',
        'ui.router',
        'ui.bootstrap',

        // services
        'app.auth',

        //features
        'app.login',
        'app.home',
        'app.addTransaction',
        'app.categories',
        'app.creditcards',
        'app.reminders',
        'app.settings',
        'app.transactions',
        'app.sideUtilities',
        'app.sideUser',
        'app.sideCategories',
        'app.sideCards',
        // components
        'svs.svsGrid',
        'svs.svsInfoCard',
        'svs.svsGetData'

    ])
        .constant('AvailableLanguages', ['en-US', 'ru-RU', 'el-GR'])
        .constant('DefaultLanguage', 'en-US')
        .config(translateConfig)
        .config(appConfig)
        .config(ionicConfig)
        .config(pushConfig);

    function pushConfig($ionicCloudProvider) {
        $ionicCloudProvider.init({
            "core": {
                "app_id": "921ca1ff"
            },
            "push": {
                "sender_id": "864803585298",
                "pluginConfig": {
                    "ios": {
                        "badge": true,
                        "sound": true
                    },
                    "android": {
                        "iconColor": "#343434"
                    }
                }
            }
        });
    }
    // @ngInject
    function translateConfig($translateProvider, DefaultLanguage) {
        $translateProvider.useStaticFilesLoader({
            'prefix': 'i18n/',
            'suffix': '.json'
        });
        $translateProvider.preferredLanguage(DefaultLanguage);
    }
    // @ngInject
    function appConfig($stateProvider, $urlRouterProvider) {
        $stateProvider
            .state('app', {
                url: '/app',
                abstract: true,
                template: '<ion-nav-view class="app" name="appView"></ion-nav-view>'
            });

        $urlRouterProvider.otherwise(function ($injector, $location) {
            var user = true;
            var state = $injector.get('$state');
            if (user) {
                // go to home
                console.log('heres');
                state.go('app.home.categories');
            } else {
                console.log('login here');
                state.go('app.login');
            }
            return $location.path();
        });
    }

    // @ngInject
    function ionicConfig($ionicConfigProvider, $provide, $ionicAutoTrackProvider,
                         CONFIG, $cordovaInAppBrowserProvider) {
        $provide.decorator('$exceptionHandler', ['$delegate', '$window', function ($delegate, $window) {
            return function (exception, cause) {
                // Decorating standard exception handling behaviour by sending exception to crashlytics plugin
                var message = exception.toString();
                var stacktrace = ($window.printStackTrace) ? $window.printStackTrace({e: exception}) : 'Stack Trace Not Available';
                $delegate(exception, cause);
                if ($window.navigator.crashlytics) $window.navigator.crashlytics.logException('ERROR: ' + message + ', stacktrace: ' + stacktrace);
            };
        }]);

        $ionicConfigProvider.backButton.previousTitleText(false);
        $ionicConfigProvider.backButton.text(' ');
        $ionicConfigProvider.views.swipeBackEnabled(false);
        $ionicConfigProvider.tabs.position('bottom');

        if (CONFIG.devMode) {
            console.info('Analytics tracking is disabled in dev mode, update package.json to enable tracking');
            $ionicAutoTrackProvider.disableTracking();
        }

        $cordovaInAppBrowserProvider.setDefaultOptions({
            location: 'no',
            clearcache: 'no',
            toolbar: 'yes'
        })

    }
}(angular));

