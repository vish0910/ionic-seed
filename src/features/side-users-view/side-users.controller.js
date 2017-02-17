angular
  .module('app.sideUser')
  .controller('SideUsersCtrl', SideUsersCtrl);

function SideUsersCtrl($scope, $ionicHistory) {
  $scope.clearHistory = function () {
    $ionicHistory.clearHistory();
  };
}
