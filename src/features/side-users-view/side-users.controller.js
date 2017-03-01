angular
    .module('app.sideUser')
    .controller('SideUsersCtrl', SideUsersCtrl);

function SideUsersCtrl(UserInfo, $scope, $ionicPopup, rootRef, Auth) {
    var vm = this;
    vm.userInfo = {
        displayName: UserInfo[0].$value,
        email: UserInfo[1].$value
    };
    vm.showNamePopup = showNamePopup;
    vm.showEmailPopup = showEmailPopup;

    function showNamePopup() {
        $scope.data = {
            displayName: vm.userInfo.displayName
        };

        // An elaborate, custom popup
        var myPopup = $ionicPopup.show({
            template: '<input type="text" ng-model="data.displayName">',
            title: 'Change Display Name',
            scope: $scope,
            buttons: [
                { text: 'Cancel' },
                {
                    text: '<b>Save</b>',
                    type: 'button-positive',
                    onTap: function (e) {
                        if (!$scope.data.displayName) {
                            //don't allow the user to close unless he enters displayName
                            e.preventDefault();
                        } else {
                            return $scope.data.displayName;
                        }
                    }
                }
            ]
        });
        myPopup.then(function (displayName) {
            if (displayName && vm.userInfo.displayName !== displayName) {
                //set in firebase and change it on vm
                rootRef.child('users').child(Auth.$getAuth().uid).child('userInfo').child('displayName').set(displayName);
                vm.userInfo.displayName = displayName;
            }
        });
    }

    function showEmailPopup() {
        $scope.data = {
            email: vm.userInfo.email
        };

        // An elaborate, custom popup
        var myPopup = $ionicPopup.show({
            template: '<input type="email" ng-model="data.email">',
            title: 'Change Email Address',
            scope: $scope,
            buttons: [
                { text: 'Cancel' },
                {
                    text: '<b>Save</b>',
                    type: 'button-positive',
                    onTap: function (e) {
                        if (!$scope.data.email) {
                            //don't allow the user to close unless he enters displayName
                            e.preventDefault();
                        } else {
                            return $scope.data.email;
                        }
                    }
                }
            ]
        });
        myPopup.then(function (email) {
            if (email && vm.userInfo.email !== email) {
                //set in firebase and change it on vm
                rootRef.child('users').child(Auth.$getAuth().uid).child('userInfo').child('email').set(email);
                vm.userInfo.email = email;
            }
        });
    }
}
