angular.module('socialEventPlanner.user')
  .controller('User.setPasswordController', ['$scope', 'userService', '$stateParams', '$state', 'toastr', 'constant',
    function setPasswordController($scope, userService, $stateParams, $state, toastr) {
      $scope.validUser = false;
      $scope.passwordError = '';
      userService.getValidToken($stateParams.id, $stateParams.token).then(function success() {
        $scope.validUser = true;
      });

      $scope.clearError = function clearError() {
        $scope.passwordError = '';
      };

      $scope.setPassword = function setPassword() {
        this.password = $scope.password;
        userService.setPassword($stateParams.id, $stateParams.token, this.password).then(function success() {
          toastr.success('Password set succesfully');
          $scope.requestInProcess = false;
          $state.go('beforeLogin.login');
        }, function error(passwordResetError) {
          if (passwordResetError.data.non_field_errors) {
            for (var i = 0; i < passwordResetError.data.non_field_errors.length; i++) {
              $scope.passwordError = $scope.passwordError + passwordResetError.data.non_field_errors[i];
            }
          }
          $scope.requestInProcess = false;
        });
      };
    }]);
