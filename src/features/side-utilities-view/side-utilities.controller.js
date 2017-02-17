angular
  .module('app.sideUtilities')
  .controller('SideUtilitiesCtrl', SideUtilitiesCtrl);

function SideUtilitiesCtrl($scope, $ionicHistory) {
  $scope.clearHistory = function () {
    $ionicHistory.clearHistory();
  };
}
