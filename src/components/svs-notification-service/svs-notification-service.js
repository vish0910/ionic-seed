(function (angular) {
    'use strict';

    angular
        .module('svs.svsNotificationService')
        .service('svsNotificationService', svsNotificationService);

    function svsNotificationService($q, $window) {
        var self = this;
        var notificationSound = 'file://resources/sound/solemn.mp3';

        self.addNotification = addNotification;
        self.removeNotification = removeNotification;
        self.getNotification = getNotification;
        self.removeAllNotifications = removeAllNotifications;
        self.updateNotification = updateNotification;
        self.getAllNotifications = getAllNotifications;
        self.getNotificationObj = getNotificationObj;

        function addNotification(config) {
            var defer = $q.defer();

            $window.cordova.plugins.notification.local.schedule({
                id: config.id,
                title: config.title,
                text: config.text,
                sound: notificationSound,
                every: config.every,
                autoClear: config.autoClear,
                at: config.at
            }, function (found) {
                console.log('incallback of schedule' + found);

                defer.resolve(found);
            });
            console.log("in add noti service");

            return defer.promise;

        }

        function removeNotification(id) {
            console.log("in remove notification");
            var defer = $q.defer();

            $window.cordova.plugins.notification.local.cancel(id, function (found) {
                defer.resolve(found);
            });
            return defer.promise;
        }

        function getNotification(id) {
            var defer = $q.defer();
            $window.cordova.plugins.notification.local.isPresent(id, function (found) {
                console.log("in get notification" + found);
                defer.resolve(found);
            });

            return defer.promise;
        }

        function getNotificationObj(id) {
            $window.cordova.plugins.notification.local.getAll(
                function (ids) {
                    console.log(JSON.stringify(ids));
                    alert(ids.join(', '));
                });
        }

        function removeAllNotifications() {
            $window.cordova.plugins.notification.local.cancelAll(
                function () {
                    alert('Ok, all notifications are canceled');
                }
            );
        }

        function updateNotification(config) {
            cordova.plugins.notification.local.update({
                id: config.id,
                title: config.title,
                text: config.text,
                sound: notificationSound,
                every: 'minute',
                autoClear: config.autoClear,
                at: config.at
            });
        }

        function getAllNotifications() {
            $window.cordova.plugins.notification.local.getAllIds(
                function (ids) {
                    console.log(ids);
                    alert(ids.join(', '));
                });
        }
    }
}(angular));
