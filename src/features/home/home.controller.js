(function (angular) {
    'use strict';
    angular
        .module('app.home')
        .controller('HomeController', HomeController);

    function HomeController ($ionicLoading, Auth) {
        var vm = this;
        vm.logout = logout;

        function logout() {
            console.log("Logging out from the app");
            $ionicLoading.show({
                template: 'Logging Out...'
            });
            Auth.$signOut();
        }
    }
} (angular));
