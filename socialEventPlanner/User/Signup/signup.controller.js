angular.module('socialEventPlanner.user')
  .controller('SignupController', ['$scope', 'userService', '$cookies', '$state', '$filter', 'toastr', 'constant',
    function signupController($scope, userService, $cookies, $state, $filter, toastr, constant) {
      $scope.error = {
        firstName: '',
        email: '',
        password: '',
        confirmPassword: ''
      };

      $scope.submitButton = 'Submit';

      $scope.requestInProcess = false;
      $scope.signupError = '';
      $scope.passwordError = '';
      $scope.lastName = '';
      $scope.dob = new Date('2000-01-01');
      $scope.gender = 'M';
      $scope.maxDob = new Date().toISOString().split('T')[0];

      $scope.clearFirstNameError = function clearNameError() {
        $scope.error.firstName = '';
      };

      $scope.clearEmailError = function clearEmailError() {
        $scope.error.email = '';
      };

      $scope.clearPasswordError = function clearPasswordError() {
        $scope.error.password = '';
      };

      $scope.clearConfirmPasswordError = function clearConfirmPasswordError() {
        $scope.error.confirmPassword = '';
      };

      $scope.signupUser = function signupUser() {
        if ($scope.signup_form.$invalid) {
          if ($scope.signup_form.firstName.$error.required) {
            $scope.error.firstName = constant.REQUIRED_FIELD_ERROR;
          }
          if ($scope.signup_form.email.$error.required) {
            $scope.error.email = constant.REQUIRED_FIELD_ERROR;
          }
          if ($scope.signup_form.password.$error.required) {
            $scope.error.password = constant.REQUIRED_FIELD_ERROR;
          }
          if ($scope.signup_form.repeat_password.$error.required) {
            $scope.error.confirmPassword = constant.REQUIRED_FIELD_ERROR;
          }
        } else {
          $scope.submitButton = 'Submitting...';
          $scope.requestInProcess = true;
          var tempDob = $filter('date')($scope.dob, 'yyyy-MM-dd');
          userService.signupUser($scope.firstName, $scope.lastName, $scope.email, $scope.password, tempDob, $scope.gender).then(function success(response) {
            toastr.success($scope.firstName, 'Welcome');
            $scope.requestInProcess = false;
            $cookies.put('token', response.token);
            $scope.signupError = '';
            $state.go('afterLogin.eventList');
          }, function error(response) {
            $scope.submitButton = 'Submit';
            $scope.requestInProcess = false;
            if (response.data.non_field_errors) {
              for (var i = 0; i < response.data.non_field_errors.length; i++) {
                $scope.passwordError = $scope.passwordError + response.data.non_field_errors[i];
              }
            }
            if (response.data.email) {
              $scope.signupError = response.data.email[0];
            }
          });
        }
      };
    }]);
