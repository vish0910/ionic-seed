angular
  .module('app.sideCards')
  .controller('SideCardsCtrl', SideCardsCtrl);

function SideCardsCtrl($scope, $ionicHistory) {
  $scope.clearHistory = function () {
    $ionicHistory.clearHistory();
  };
}
