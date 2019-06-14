angular.module('socialEventPlanner.user')
  .controller('User.ProfileController', ['userService', '$scope', '$state', '$filter', 'toastr', function ProfileController(userService, $scope, $state, $filter, toastr) {
    $scope.user = {
      id: '',
      firstName: '',
      lastName: '',
      email: '',
      gender: '',
      profile_picture: '',
      date_of_birth: ''
    };

    $scope.error = {
      firstName: '',
      lastName: '',
      email: '',
      gender: '',
      date_of_birth: '',
      profile_picture: ''
    };

    $scope.maxDob = new Date().toISOString().split('T')[0];

    $scope.$on('fileSelected', function (event, args) {
      $scope.$apply(function () {
        $scope.user.profile_picture = args.file;
        $scope.userProfileForm.$setDirty();
      });
    });

    $scope.requestInProcess = false;

    var responseUser;

    userService.getUser().then(function success(response) {
      $scope.user.id = response.id;
      $scope.user.firstName = response.first_name;
      $scope.user.lastName = response.last_name;
      $scope.user.email = response.email;
      $scope.user.gender = response.gender;
      if (response.profile_picture === null) {
        response.profile_picture = '/Assets/Images/default.png';
      }
      $scope.user.profile_picture = response.profile_picture;
      $scope.user.date_of_birth = new Date(response.date_of_birth);
      responseUser = response;
    }, function error(response) {
      if (response.status === 401 || response.status === 403) {
        $state.go('beforeLogin.login');
      }
    });

    $scope.resetForm = function resetForm() {
      $scope.user.firstName = responseUser.first_name;
      $scope.user.lastName = responseUser.last_name;
      $scope.user.email = responseUser.email;
      $scope.user.gender = responseUser.gender;
      $scope.user.profile_picture = responseUser.profile_picture;
      $scope.user.date_of_birth = new Date(responseUser.date_of_birth);
      $scope.userProfileForm.$setPristine();
    };

    $scope.updateUser = function updateUser() {
      var formData = new FormData();
      if ($scope.user.profile_picture !== responseUser.profile_picture) {
        formData.append('profile_picture', $scope.user.profile_picture);
      }
      formData.append('id', $scope.user.id);
      formData.append('first_name', $scope.user.firstName);
      formData.append('last_name', $scope.user.lastName);
      formData.append('email', $scope.user.email);
      formData.append('gender', $scope.user.gender);
      formData.append('date_of_birth',  $filter('date')($scope.user.date_of_birth, 'yyyy-MM-dd'));
      userService.updateUser(formData).then(function success(response) {
        toastr.success('Profile Updated !');
        responseUser = response;
        if (response.profile_picture === null) {
          response.profile_picture = '/Assets/Images/default.png';
        }
        $scope.userProfileForm.$setPristine();
      }, function error(updationError) {
        if (updationError.data.profile_picture) {
          $scope.error.profile_picture = updationError.data.profile_picture[0].split('. ')[0];
        }
        toastr.error('Error in Updation');
      });
    };

    $scope.passwordChange = function passwordChange() {
      $state.go('afterLogin.changePassword');
    };
  }]);
