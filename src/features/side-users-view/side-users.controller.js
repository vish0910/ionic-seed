angular
    .module('app.sideUser')
    .controller('SideUsersCtrl', SideUsersCtrl);

function SideUsersCtrl(UserInfo,
                       $scope,
                       $ionicPopup,
                       $ionicLoading,
                       rootRef,
                       Auth,
                       ionicToast,
                       $ionicActionSheet,
                       $cordovaCamera) {
    var vm = this;
    vm.userInfo = {
        displayName: _.get(UserInfo, ['0', '$value']),
        email: _.get(UserInfo, ['1', '$value']),
        image: _.get(UserInfo, ['2', '$value']),
        password: '******'
    };
    vm.showNamePopup = showNamePopup;
    vm.showEmailPopup = showEmailPopup;
    vm.showPasswordPopup = showPasswordPopup;
    vm.addMedia = addMedia;

    function showNamePopup() {
        $scope.data = {
            displayName: vm.userInfo.displayName
        };

        // An elaborate, custom popup
        var myPopup = $ionicPopup.show({
            template: '<input type="text" ng-model="data.displayName">' +
            '<p ng-if="data.displayName.length < 6" style="color:red"> Display Name is minimum 6 letters</p>',
            title: 'Change Display Name',
            scope: $scope,
            buttons: [
                { text: 'Cancel' },
                {
                    text: '<b>Save</b>',
                    type: 'button-dark',
                    onTap: function (e) {
                        if ($scope.data.displayName.length < 6) {
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
                    type: 'button-dark',
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
                Auth.$updateEmail(email).then(function() {
                    rootRef.child('users').child(Auth.$getAuth().uid).child('userInfo').child('email').set(email);
                    vm.userInfo.email = email;
                    ionicToast.show('Email Address changed successfully', 'bottom', false, 2500);
                }, function(err){
                    ionicToast.show(err.message, 'bottom', false, 2500, 'rgb(255, 0, 0)');
                });
            }
        });
    }

    function showPasswordPopup() {
        $scope.data = {
            password: '******'
        };

        // An elaborate, custom popup
        var myPopup = $ionicPopup.show({
            template: '<input type="password" ng-model="data.password">' +
            '<p ng-if="data.password.length < 6" style="color:red"> Password should be minimum 6 letters</p>',
            title: 'Change Password',
            scope: $scope,
            buttons: [
                { text: 'Cancel' },
                {
                    text: '<b>Save</b>',
                    type: 'button-dark',
                    onTap: function (e) {
                        if ($scope.data.password.length < 6) {
                            //don't allow the user to close unless he enters displayName
                            e.preventDefault();
                        } else {
                            return $scope.data.password;
                        }
                    }
                }
            ]
        });
        myPopup.then(function (password) {
            if (password) {
                //set in firebase and change it on vm
                Auth.$updatePassword(password).then(function() {
                    ionicToast.show('Password changed successfully', 'bottom', false, 2500);
                }, function(err){
                    ionicToast.show(err.message, 'bottom', false, 2500, 'rgb(255, 0, 0)');
                });
            }
        });
    }

    function addMedia() {
        $scope.hideSheet = $ionicActionSheet.show({
            buttons: [
                { text: 'Camera' },
                { text: 'Gallery' }
            ],
            titleText: 'Add Photo',
            cancelText: 'Cancel',
            buttonClicked: function(index) {
                addImage(index);
            }
        });
    }

    function addImage(type) {
        $scope.hideSheet();
        var options = optionsForType(type);
        $cordovaCamera.getPicture(options).then(function(imageData) {
            $ionicLoading.show({
                template: '<ion-spinner icon="spiral"></ion-spinner>'
            });
            rootRef.child('users').child(Auth.$getAuth().uid).child('userInfo').child('image').set(imageData).then(function(){
                vm.userInfo.image = UserInfo[2].$value;
                $ionicLoading.hide();
            });
        }, function(err) {
            ionicToast.show(err.message, 'bottom', false, 2500, 'rgb(255, 0, 0)');
        });
    }

    function optionsForType(type) {
        var source;
        switch (type) {
            case 0:
                source = Camera.PictureSourceType.CAMERA;
                break;
            case 1:
                source = Camera.PictureSourceType.PHOTOLIBRARY;
                break;
        }
        return {
            quality : 75,
            targetWidth: 100,
            targetHeight: 100,
            destinationType: Camera.DestinationType.DATA_URL,
            sourceType: source,
            allowEdit: true,
            encodingType: Camera.EncodingType.JPEG,
            popoverOptions: CameraPopoverOptions,
            saveToPhotoAlbum: false
        };
    }
}
