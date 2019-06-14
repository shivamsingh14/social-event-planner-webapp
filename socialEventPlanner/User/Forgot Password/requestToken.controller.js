angular.module('socialEventPlanner.user')
  .controller('User.requestTokenController', ['$scope', 'userService', '$state', 'toastr',
    function requestTokenController($scope, userService, $state, toastr) {
      $scope.requestInProcess = false;
      this.email = $scope.email;
      $scope.requestToken = function requestToken() {
        $scope.requestInProcess = true;
        $state.go('beforeLogin.login');
        toastr.success('Check your email for reset link');
        userService.requestToken(this.email).then(function success() {
          $scope.requestInProcess = false;
          $scope.resetflag = true;
        }, function error() {
          $state.go('beforeLogin.login');
          $scope.requestInProcess = false;
        });
      };
    }]);

