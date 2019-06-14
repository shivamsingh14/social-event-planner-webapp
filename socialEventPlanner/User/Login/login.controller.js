angular.module('socialEventPlanner.user')
  .controller('LoginController', ['userService', '$scope', '$cookies', '$state', 'constant',
    function LoginController(userService, $scope, $cookies, $state, constant) {
      $scope.requestInProcess = false;
      $scope.loginError = '';

      $scope.error = {
        email: '',
        password: ''
      };

      $scope.clearEmailError = function clearEmailError() {
        $scope.error.email = '';
      };

      $scope.clearPasswordError = function clearPasswordError() {
        $scope.error.password = '';
      };

      $scope.loginUser = function loginUser() {
        if ($scope.loginForm.$invalid) {
          if ($scope.loginForm.email.$error.required) {
            $scope.error.email = constant.REQUIRED_FIELD_ERROR;
          }
          if ($scope.loginForm.password.$error.required) {
            $scope.error.password = constant.REQUIRED_FIELD_ERROR;
          }
        } else {
          $scope.requestInProcess = true;
          userService.loginUser($scope.email, $scope.password).then(function success(response) {
            $scope.requestInProcess = false;
            $scope.loginError = '';
            $cookies.put('token', response.token);
            $state.go('afterLogin.eventList');
          }, function error() {
            $scope.requestInProcess = false;
            $scope.loginError = 'Cannot login with provided credentials';
          });
        }
      };
      $scope.forgotPassword = function forgotPassword() {
        $state.go('beforeLogin.requestToken');
      };
    }]);
