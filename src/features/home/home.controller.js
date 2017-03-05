(function (angular) {
    'use strict';
    angular
        .module('app.home')
        .controller('HomeController', HomeController);

    function HomeController($ionicLoading, Auth, $state, $timeout, $ionicSideMenuDelegate, UserInfo) {
        var vm = this;
        vm.logout = logout;
        $timeout(function () {
            vm.userInfo = UserInfo;
        });
        vm.gotToUserProfile = gotToUserProfile;

        function logout() {
            console.log("Logging out from the app");
            $ionicLoading.show({
                template: 'Logging Out...'
            });
            Auth.$signOut();
        }

        function gotToUserProfile() {
            $ionicSideMenuDelegate.toggleLeft();
            $state.go('app.home.user')
        }
    }
}(angular));
