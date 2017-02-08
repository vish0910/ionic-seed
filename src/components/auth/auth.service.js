    (function (angular) {
        'use strict';

        angular.module('app.auth')
            .service('AuthService', AuthService);

        function AuthService($http, $q, $window, $state,
                               AuthTokenService, $cordovaPushV5, $ionicSideMenuDelegate) {
            var self = this;
            var needsRegister = false;

            self.authenticate = authenticate;
            self.isAuthenticated = isAuthenticated;
            self.changePassword = changePassword;
            self.registerForPush = registerForPush;
            self.needsPushRegister = needsPushRegister;
            self.signUpUser = signUpUser;


            function signUpUser(username, password) {
                var authRequest = {
                    url: '/api/users/signup',
                    method: 'PUT',
                    data: {
                        email: username,
                        password: password
                    }
                };

                return $http(authRequest)
                    .then(authSuccess)
                    .then(setActiveUser)
                    .catch(error);
            }

            function authenticate(username, password) {
                var authRequest = {
                    url: '/api/auth',
                    method: 'POST',
                    data: {
                        email: username,
                        password: password
                    }
                };

                return $http(authRequest)
                    .then(authSuccess)
                    .then(setActiveUser)
                    .catch(error);
            }

            function authSuccess(response) {
                AuthTokenService.setToken(response.data.token);
                return $http.get('/api/users/current');
            }

            function setActiveUser(resp) {
                return resp.data;
            }

            function error(response) {
                var errorDescription = _.get(response, ['data', 'message'], 'COMMON.SERVICE_ERROR');

                AuthTokenService.removeToken();

                return $q.reject(errorDescription);
            }

            function isAuthenticated() {
                return !!AuthTokenService.getToken();
            }

            function changePassword(email) {
                return $http.put('/api/users/forgot-password/'+email)
                    .then(success)
                    .catch(error);

                function success(response) {
                    return response.data;
                }
            }

            function handlePushRegisterCallback(res, user, goHome) {

                // todo: save user._id (this is the ionic id) here to your user object


                // var push = new $window.Ionic.Push();
                // push.saveToken(res.toString());
                // var webUser = gsUsersService.getCurrentWebUser();
                // webUser.details = webUser.details || {};
                // webUser.details.ionicId = user._id;

                // gsUsersService.saveCurrentWebUser(webUser)
                //     .then(function() {
                //         $window.Ionic.User.load(user._id).then(function(user) {
                //             user.save();
                //             localStorage.removeItem('gs_ionic_user');
                //             localStorage.setItem('gs_ionic_user', JSON.stringify(user));
                //             if(goHome) $state.go('summit.menu.home');
                //         }, function() {

                //         });
                //     }, function(err) {

                //     });
            }

            function registerForPush(user, goHome) {
                var options = {
                    android: {
                        senderID: "id here"
                    },
                    ios: {
                        alert: true,
                        badge: true,
                        sound: true
                    },
                    windows: {}
                };

                $cordovaPushV5.initialize(options).then(function() {
                    $cordovaPushV5.onNotification();
                    $cordovaPushV5.onError();
                    $cordovaPushV5.register().then(function(result) {
                        $cordovaPushV5.finish().then(function() {
                            handlePushRegisterCallback(result, user, goHome);
                        }, function(err) {
                            
                        });
                    }, function(err) {
                        $cordovaPushV5.finish();
                    });
                }, function(err) {
                    $cordovaPushV5.finish();
                });
            }

            function needsPushRegister(val) {
                if(angular.isUndefined(val)) return needsRegister;
                else needsRegister = val;
            }
        }
    }(angular));
