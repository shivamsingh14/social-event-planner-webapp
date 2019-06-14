angular.module('socialEventPlanner.group')
  .controller('Group.GroupCreateController', ['$scope', 'userService', 'groupService', 'constant', 'toastr', '$state',
    function GroupCreateController($scope, userService, groupService, constant, toastr, $state) {
      $scope.userEmail = '';
      $scope.adminEmail = '';
      $scope.addedUserEmails = '';
      $scope.addedAdminEmails = '';
      $scope.usersArray = [];
      $scope.usersArrayUser = [];
      $scope.usersArrayAdmin = [];
      $scope.createGroupButton = 'Create Group';
      $scope.requestInProcess = false;

      $scope.error = {
        groupName: '',
        shortDescription: '',
        addUsers: '',
        addAdmins: ''
      };

      function addUserType(array, userType) {
        for (var i = 0; i < array.length; i++) {
          array[i].user_type = userType;
        }
        return array;
      }

      var addedUser;
      function excludeUsers(value) {
        $scope.usersArray = $scope.usersArrayUser.concat($scope.usersArrayAdmin);
        for (addedUser in $scope.usersArray) {
          if ((value.id === $scope.usersArray[addedUser].id)) {
            return false;
          }
        }
        return true;
      }

      function clearGroupNameError() {
        $scope.error.groupName = '';
      }

      function clearShortDesciptionError() {
        $scope.error.shortDescription = '';
      }

      function clearAddUsersError() {
        $scope.error.addUsers = '';
        $scope.error.addAdmins = '';
      }

      function loadTags(query) {
        return userService.getUserList().then(function (response) {
          $scope.users = response;
          $scope.users = $scope.users.filter(excludeUsers);

          // filtering will be done on server end.
          query = query.toLowerCase();
          return _.filter($scope.users, function (user) {
            return user.email.startsWith(query);
          });
        });
      }

      function createGroup() {
        if ($scope.createGroupForm.$invalid || (!($scope.usersArrayUser.length || $scope.usersArrayAdmin.length))) {
          if ($scope.createGroupForm.groupName.$error.required) {
            $scope.error.groupName = constant.REQUIRED_FIELD_ERROR;
          } else if ($scope.createGroupForm.groupName.$error.minlength) {
            $scope.error.groupName = constant.MIN_LENGTH_ERROR;
          } else if ($scope.createGroupForm.groupName.$error.maxlength) {
            $scope.error.groupName = constant.MAX_LENGTH_ERROR;
          }
          if ($scope.createGroupForm.shortDescription.$error.required) {
            $scope.error.shortDescription = constant.REQUIRED_FIELD_ERROR;
          } else if ($scope.createGroupForm.shortDescription.$error.minlength) {
            $scope.error.shortDescription = constant.MIN_LENGTH_ERROR;
          } else if ($scope.createGroupForm.shortDescription.$error.maxlength) {
            $scope.error.shortDescription = constant.MAX_LENGTH_ERROR;
          }
          if (!($scope.usersArrayUser.length && $scope.usersArrayAdmin.length)) {
            $scope.error.addUsers = constant.REQUIRED_FIELD_ERROR;
            $scope.error.addAdmins = constant.REQUIRED_FIELD_ERROR;
          }
        } else {
          $scope.requestInProcess = true;
          $scope.createGroupButton = 'Creating...';
          $scope.usersArrayUser = addUserType($scope.usersArrayUser, constant.GROUP_USER_TYPE.USER);
          $scope.usersArrayAdmin = addUserType($scope.usersArrayAdmin, constant.GROUP_USER_TYPE.ADMIN);
          $scope.usersArray = $scope.usersArrayUser.concat($scope.usersArrayAdmin);
          groupService.createGroup($scope.groupName, $scope.shortDescription, $scope.usersArray).then(function success(response) {
            $scope.createGroupButton = 'Create Group';
            $scope.requestInProcess = false;
            toastr.success('Successfully Created Group ', $scope.groupName);
            $state.go('afterLogin.groupDetail', {'id': response.id});
          }, function error() {
            $scope.createGroupButton = 'Create Group';
            $scope.requestInProcess = false;
          });
        }
      }

      angular.extend($scope, {
        createGroup: createGroup,
        loadTags: loadTags,
        clearAddUsersError: clearAddUsersError,
        clearShortDesciptionError: clearShortDesciptionError,
        clearGroupNameError: clearGroupNameError
      });
    }]);
