(function (angular, _) {
    'use strict';

    angular
        .module('app.auth')
        .run(run);

    // @ngInject
    function run($rootScope, $location, Auth, $ionicLoading) {
        //var firebaseUrl = "https://up-money-f4f75.firebaseio.com";
        //$rootScope.firebaseUrl = firebaseUrl;
        //$rootScope.displayName = null;
        //
        // $rootScope.logout = function () {
        //     console.log("Logging out from the app");
        //     $ionicLoading.show({
        //         template: 'Logging Out...'
        //     });
        //     Auth.$signOut();
        // };

        Auth.$onAuthStateChanged(function (authData) {
            if (authData) {
                console.log("Logged in as:", authData.uid);
            } else {
                console.log("Logged out");
                $ionicLoading.hide();
                $location.path('/app/login');
            }
        });

        $rootScope.$on('$stateChangeStart', function onStateChange(event, toState, toParams, fromState, fromParams, error) {
            // By default, every state requires authentication.
            // State must explicitly set authenticate to `false` to disable
            //var requiresAuthentication = _.get(toState, 'data.authenticate') !== false;
            // if (requiresAuthentication && !AuthService.isAuthenticated()) {
            //     event.preventDefault();
            //     $state.go('app.login');
            // }
            if (error === "AUTH_REQUIRED") {
                $location.path("/login");
            }
        });
    }
}(angular, _));
