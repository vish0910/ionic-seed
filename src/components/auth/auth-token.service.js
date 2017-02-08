(function (angular) {
    'use strict';

    angular.module('app.auth')
        .service('AuthTokenService', AuthTokenService);

    function AuthTokenService() {
        var self = this;
        var key = 'app_web_token';

        self.getToken = getToken;
        self.setToken = setToken;
        self.removeToken = removeToken;

        function getToken() {
            return localStorage.getItem(key);
        }

        function setToken(token) {
            localStorage.setItem(key, token);
        }

        function removeToken() {
            localStorage.removeItem(key);
        }
    }
}(angular));
