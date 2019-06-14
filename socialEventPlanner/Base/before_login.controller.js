angular.module('socialEventPlanner')
  .controller('BeforeLoginController', ['$state', '$scope', function BeforeLoginController($state, $scope) {
    $scope.goToHome = function goToHome() {
      $state.go('beforeLogin.login');
    };
  }]);
