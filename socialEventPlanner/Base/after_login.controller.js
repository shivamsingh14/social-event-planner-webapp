angular.module('socialEventPlanner')
  .controller('AfterLoginController', ['$state', '$scope', 'afterLoginService', '$cookies', function AfterLoginController($state, $scope, afterLoginService, $cookies) {
    $scope.logout = function logout() {
      afterLoginService.logoutUser().then(function success() {
        if ($cookies.get('token')) {
          $cookies.remove('token');
        }
        $state.go('beforeLogin.login');
      }, function error() {
        if ($cookies.get('token')) {
          $cookies.remove('token');
        }
        $state.go('beforeLogin.login');
      });
    };

    $scope.goToEventList = function goToEventList() {
      $state.go('afterLogin.eventList');
    };
  }]);
