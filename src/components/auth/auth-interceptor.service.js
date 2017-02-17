(function (angular) {
    'use strict';

    angular.module('app.auth')
        .factory('AuthInterceptor', AuthInterceptor);

    // @ngInject
    function AuthInterceptor(CONFIG, AuthTokenService, $location, $cordovaPushV5, $window, $q, $ionicPush) {

        function handleRequest(config) {
            var token = AuthTokenService.getToken();

            if(isExternalRequest(config.url)) {
                return config;
            }

            if (isApiRequest(config.url)) {
                config.url = CONFIG.API_END_POINT + config.url;
            }

            if (token) {
                config.headers = config.headers || {};
                config.headers.Authorization = getAuthHeader(token);
            }

            return config;
        }

        function isExternalRequest(url) {
            return url.indexOf('http') > -1;
        }

        function isApiRequest(path) {
            return path.indexOf('/api') === 0;
        }

        function getAuthHeader() {
            return 'Bearer ' + AuthTokenService.getToken();
        }

        return {
            request: handleRequest,
            responseError: function(response) {
                if(response.status === 404 || response.status === 401 || response.status === 403 || response.status === 419) {
                    //$location.url('/app/login');
                    $ionicPush.unregister();
                    localStorage.clear();
                    return $q.reject(response);
                }
            }
        };
    }
}(angular));
