angular
  .module('app.sideCategories')
  .controller('SideCategoriesCtrl', SideCategoriesCtrl);

function SideCategoriesCtrl($scope, $ionicHistory) {
  $scope.clearHistory = function () {
    $ionicHistory.clearHistory();
  };
}
