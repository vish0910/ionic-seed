(function (angular) {
    'use strict';
    angular
        .module('app.login')
        .controller('LoginController', LoginController);

    // @ngInject
    function LoginController($scope, Auth, $ionicModal, $ionicLoading, $rootScope, $state, rootRef, svsNotificationService) {
        var vm = this;

        $ionicModal.fromTemplateUrl('features/login/signup.html', {
            scope: $scope
        }).then(function (modal) {
            $scope.modal = modal;
        });

        vm.createUser = function (user) {
            if (user && user.email && user.password && user.displayname) {
                $ionicLoading.show({
                    template: 'Signing Up...'
                });

                Auth.$createUserWithEmailAndPassword(user.email, user.password)
                    .then(function (userData) {
                        rootRef.child("users").child(userData.uid).set({
                            userInfo: {
                                email: user.email,
                                displayName: user.displayname
                            }
                        });
                        $ionicLoading.hide();
                        $scope.modal.hide();
                        setAddTransactionReminder(user.displayname);
                        $state.go('app.home.categories');
                    }).catch(function (error) {
                    alert("Error: " + error);
                    $ionicLoading.hide();
                });
            }
        };

        vm.signIn = function (user) {

            if (user && user.email && user.pwdForLogin) {
                $ionicLoading.show({
                    template: 'Signing In...'
                });
                Auth.$signInWithEmailAndPassword(user.email, user.pwdForLogin)
                    .then(function (authData) {
                        console.log("Logged in as:" + authData.uid);
                        $ionicLoading.hide();
                        $state.go('app.home.categories');
                    }).catch(function (error) {
                    alert("Authentication failed:" + error.message);
                    $ionicLoading.hide();
                });
            } else
                alert("Please enter email and password both");
        };

        vm.reset = function (user) {
            if (user.email) {
                Auth.$sendPasswordResetEmail(user.email).then(function () {
                    console.log("reset email sent");
                    alert("reset email sent");
                }).catch(function (error) {
                    console.log(error);
                    alert("reset email failed:" + error.message);
                });
            } else
                alert("Please enter email");
        };

        function setAddTransactionReminder(displayname) {
            var config = {
                id: (new Date()).getMilliseconds(),
                title: 'Add Transaction Reminder',
                text: displayname + ', please add trasaction for today',
                every: 'minute',
                autoClear: true,
                at: new Date(new Date().getTime() + 60 * 1000)
            };

            return svsNotificationService.addNotification(config);
        }
    }
}(angular));
