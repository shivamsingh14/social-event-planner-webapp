angular.module('socialEventPlanner.user')
  .controller('User.ChangePasswordController', ['$scope', 'userService', '$state', 'toastr', 'constant', function ChangePasswordController($scope, userService, $state, toastr, constant) {
    $scope.user = {
      oldPassword: '',
      newPassword: '',
      confirmPassword: ''
    };

    $scope.error = {
      oldPassword: '',
      newPassword: '',
      confirmPassword: ''
    };

    $scope.updateClicked = false;

    $scope.clearNewPasswordError = function clearNewPasswordError() {
      $scope.error.newPassword = '';
    };

    $scope.clearOldPasswordError = function clearOldPasswordError() {
      $scope.error.oldPassword = '';
    };

    $scope.clearConfirmPasswordError = function clearConfirmPasswordError() {
      $scope.error.confirmPassword = '';
    };

    $scope.changePassword = function changePassword() {
      if ($scope.userPasswordForm.$invalid) {
        if ($scope.userPasswordForm.userOldPassword.$error.required) {
          $scope.error.oldPassword = constant.REQUIRED_FIELD_ERROR;
        } if ($scope.userPasswordForm.userConfirmPassword.$error.required) {
          $scope.error.confirmPassword = constant.REQUIRED_FIELD_ERROR;
        } if ($scope.userPasswordForm.userNewPassword.$error.required) {
          $scope.error.newPassword = constant.REQUIRED_FIELD_ERROR;
        }
      } else {
        $scope.updateClicked = true;
        var userpass = {
          password: $scope.user.oldPassword,
          new_password: $scope.user.newPassword
        };
        $scope.error.oldPassword = '';
        $scope.error.newPassword = '';

        userService.updatePassword(userpass).then(function () {
          toastr.success('Password Changed');
          $state.go('afterLogin.profile');
        }, function (error) {
          $scope.updateClicked = false;
          if (error.data.non_field_errors) {
            for (var i = 0; i < error.data.non_field_errors.length; i++) {
              $scope.error.oldPassword = $scope.error.oldPassword + error.data.non_field_errors[i];
            }
          }
          if (error.data.new_password) {
            for (i = 0; i < error.data.new_password.length; i++) {
              $scope.error.newPassword = $scope.error.newPassword + error.data.new_password[i];
            }
          }
        });
      }
    };

    $scope.resetForm = function resetForm() {
      $scope.user.oldPassword = '';
      $scope.user.newPassword = '';
      $scope.user.confirmPassword = '';
      $scope.userPasswordForm.$setPristine();
    };

    $scope.clearError = function () {
      $scope.error.oldPassword = '';
      $scope.error.newPassword = '';
    };
  }]);
