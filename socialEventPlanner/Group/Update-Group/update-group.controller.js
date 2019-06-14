/* eslint-disable no-undef */
/* eslint-disable no-param-reassign */
angular.module('socialEventPlanner.group')
  .controller('Group.GroupUpdateController', ['$scope', 'groupService', '$stateParams', 'userService', 'constant', 'toastr', '$state',
    function GroupUpdateController($scope, groupService, $stateParams, userService, constant, toastr, $state) {
      $scope.group = {
        id: '',
        name: '',
        shortDescription: '',
        groupDetails: []
      };

      $scope.loading = true;

      $scope.requestInProcess = {
        updateGroupDetails: false,
        addUsers: false,
        deleteUsers: false,
        addAdmin: false,
        removeAdmin: false
      };

      $scope.error = {
        groupName: '',
        shortDescription: '',
        addUsers: '',
        deleteUsers: '',
        addAdmin: '',
        removeAdmin: ''
      };

      $scope.isOwner = false;
      $scope.isAdmin = false;

      $scope.deleteUsersExist = false;
      $scope.addAdminExists = false;
      $scope.removeAdminExists = false;
      $scope.usersInDeleteUsersArrayExist = false;

      $scope.user = {
        id: 0
      };

      $scope.usersInDeleteUsersArray = [];
      $scope.usersToDelete = [];
      $scope.usersToAdd = [];
      $scope.usersInTheGroupArray = [];
      $scope.users = [];
      $scope.usersToAddObjectArray = [];
      $scope.userLevelUsers = [];
      $scope.adminLevelUsers = [];

      $scope.updateAdmin = {
        groupUserID: 0
      };

      $scope.updateGroupDetailsButton = 'Update Details';
      $scope.addUsersButton = 'Add Users';
      $scope.deleteUsersButton = 'Delete Users';
      $scope.addAdminButton = 'Add Admin';
      $scope.removeAdminButton = 'Remove Admin';

      var x;
      var i;
      function excludeUsers(value) {
        for (x in $scope.usersInTheGroupArray) {
          if ((value.id === $scope.usersInTheGroupArray[x])) {
            return false;
          }
        }
        return true;
      }

      function updateDone() {
        $scope.usersInDeleteUsersArray = [];
        $scope.usersToDelete = [];
        $scope.usersToAdd = [];
        $scope.usersInTheGroupArray = [];
        $scope.users = [];
        $scope.usersToAddObjectArray = [];
        $scope.userLevelUsers = [];
        $scope.adminLevelUsers = [];
        groupService.getGroup($stateParams.id).then(function getGroupSuccess(response) {
          $scope.group.id = response.id;
          $scope.group.name = response.name;
          $scope.group.shortDescription = response.short_desc;
          $scope.group.groupDetails = response.group_details;
          for (i = 0; i < $scope.group.groupDetails.length; i++) {
            $scope.usersInTheGroupArray.push($scope.group.groupDetails[i].user.id);
            if ($scope.group.groupDetails[i].user_type === constant.GROUP_USER_TYPE.ADMIN) {
              $scope.adminLevelUsers.push($scope.group.groupDetails[i]);
              $scope.removeAdminExists = true;
            } else if ($scope.group.groupDetails[i].user_type === constant.GROUP_USER_TYPE.USER) {
              $scope.userLevelUsers.push($scope.group.groupDetails[i]);
              $scope.addAdminExists = true;
            }
          }
          for (i = 0; i < $scope.group.groupDetails.length; i++) {
            if ($scope.isOwner) {
              if ($scope.group.groupDetails[i].user_type !== constant.GROUP_USER_TYPE.OWNER) {
                $scope.usersInDeleteUsersArray.push($scope.group.groupDetails[i]);
              }
            }
            if ($scope.isAdmin) {
              if ($scope.group.groupDetails[i].user_type !== constant.GROUP_USER_TYPE.OWNER && $scope.group.groupDetails[i].user_type !== constant.GROUP_USER_TYPE.ADMIN) {
                $scope.usersInDeleteUsersArray.push($scope.group.groupDetails[i]);
              }
            }
          }
          $scope.usersInDeleteUsersArrayExist = $scope.usersInDeleteUsersArray.length;
        }, function error(response) {
          if (response.status === 404) {
            $state.go('afterLogin');
          }
        });
      }

      userService.getUser().then(function success(getUserResponse) {
        $scope.user.id = getUserResponse.id;
        groupService.getGroup($stateParams.id).then(function getGroupSuccess(response) {
          $scope.group.id = response.id;
          $scope.group.name = response.name;
          $scope.group.shortDescription = response.short_desc;
          $scope.group.groupDetails = response.group_details;
          for (i = 0; i < $scope.group.groupDetails.length; i++) {
            $scope.usersInTheGroupArray.push($scope.group.groupDetails[i].user.id);
            if ($scope.group.groupDetails[i].user_type === constant.GROUP_USER_TYPE.ADMIN) {
              $scope.adminLevelUsers.push($scope.group.groupDetails[i]);
              $scope.removeAdminExists = true;
            } else if ($scope.group.groupDetails[i].user_type === constant.GROUP_USER_TYPE.USER) {
              $scope.userLevelUsers.push($scope.group.groupDetails[i]);
              $scope.addAdminExists = true;
            }
            if ($scope.user.id === $scope.group.groupDetails[i].user.id && $scope.group.groupDetails[i].user_type === constant.GROUP_USER_TYPE.USER) {
              $state.go('afterLogin.groupDetail', {'id': $scope.group.id});
            } else if ($scope.user.id === $scope.group.groupDetails[i].user.id && $scope.group.groupDetails[i].user_type === constant.GROUP_USER_TYPE.OWNER) {
              $scope.isOwner = true;
            } else if ($scope.user.id === $scope.group.groupDetails[i].user.id && $scope.group.groupDetails[i].user_type === constant.GROUP_USER_TYPE.ADMIN) {
              $scope.isAdmin = true;
            }
          }
          for (i = 0; i < $scope.group.groupDetails.length; i++) {
            if ($scope.isOwner) {
              if ($scope.group.groupDetails[i].user_type !== constant.GROUP_USER_TYPE.OWNER) {
                $scope.usersInDeleteUsersArray.push($scope.group.groupDetails[i]);
              }
            }
            if ($scope.isAdmin) {
              if ($scope.group.groupDetails[i].user_type !== constant.GROUP_USER_TYPE.OWNER && $scope.group.groupDetails[i].user_type !== constant.GROUP_USER_TYPE.ADMIN) {
                $scope.usersInDeleteUsersArray.push($scope.group.groupDetails[i]);
              }
            }
          }
          $scope.usersInDeleteUsersArrayExist = $scope.usersInDeleteUsersArray.length;
          $scope.loading = false;
        }, function error(response) {
          if (response.status === 404) {
            $state.go('afterLogin');
            $scope.loading = false;
          }
        });
      });

      function clearGroupNameError() {
        $scope.error.groupName = '';
      }

      function clearShortDescriptionError() {
        $scope.error.shortDescription = '';
      }

      function clearAddUsersError() {
        $scope.error.addUsers = '';
      }

      function clearDeleteUsersError() {
        $scope.error.deleteUsers = '';
      }

      function loadTags(query) {
        return userService.getUserList().then(function success(response) {
          $scope.users = response;
          $scope.users = $scope.users.filter(excludeUsers);

          // filtering will be done on server end.
          query = query.toLowerCase();
          return _.filter($scope.users, function filter(user) {
            return user.email.startsWith(query);
          });
        });
      }

      function backToGroupDetail() {
        $state.go('afterLogin.groupDetail', {'id': $stateParams.id});
      }

      function updateGroup() {
        if ($scope.updateGroupDetailsForm.$invalid) {
          if ($scope.updateGroupDetailsForm.groupName.$error.required) {
            $scope.error.groupName = constant.REQUIRED_FIELD_ERROR;
          } else if ($scope.updateGroupDetailsForm.groupName.$error.minlength) {
            $scope.error.groupName = constant.MIN_LENGTH_ERROR;
          } else if ($scope.updateGroupDetailsForm.groupName.$error.maxlength) {
            $scope.error.groupName = constant.MAX_LENGTH_ERROR;
          }
          if ($scope.updateGroupDetailsForm.shortDescription.$error.required) {
            $scope.error.shortDescription = constant.REQUIRED_FIELD_ERROR;
          } else if ($scope.updateGroupDetailsForm.shortDescription.$error.minlength) {
            $scope.error.shortDescription = constant.MIN_LENGTH_ERROR;
          } else if ($scope.updateGroupDetailsForm.shortDescription.$error.maxlength) {
            $scope.error.shortDescription = constant.MAX_LENGTH_ERROR;
          }
        } else {
          $scope.loading = true;
          $scope.updateGroupDetailsButton = 'Updating...';
          $scope.requestInProcess.updateGroupDetails = true;
          groupService.updateGroup($scope.group.id, $scope.group.name, $scope.group.shortDescription).then(function success() {
            $scope.updateGroupDetailsButton = 'Update Details';
            $scope.requestInProcess.updateGroupDetails = false;
            toastr.success('Group Successfully Updated');
            $scope.updateGroupDetailsForm.$setPristine();
            $scope.loading = false;
          }, function error() {
            $scope.updateGroupDetailsButton = 'Update Details';
            $scope.requestInProcess.updateGroupDetails = false;
            toastr.error('Error in Updation');
            updateDone();
            $scope.loading = false;
          });
        }
      }

      function addUsers() {
        if (!($scope.usersToAddObjectArray.length)) {
          $scope.error.addUsers = constant.REQUIRED_FIELD_ERROR;
        } else {
          $scope.loading = true;
          $scope.requestInProcess.addUsers = true;
          $scope.addUsersButton = 'Adding...';
          for (i = 0; i < $scope.usersToAddObjectArray.length; i++) {
            $scope.usersToAdd.push($scope.usersToAddObjectArray[i].id);
          }
          groupService.addUsers($scope.group.id, $scope.usersToAdd).then(function success() {
            $scope.requestInProcess.addUsers = false;
            $scope.addUsersButton = 'Add Users';
            toastr.success('Users Added');
            updateDone();
            $scope.addUsersForm.$setPristine();
            $scope.loading = false;
          }, function error() {
            updateDone();
            $scope.requestInProcess.addUsers = false;
            $scope.addUsersButton = 'Add Users';
            toastr.error('Error in Updation');
            $scope.loading = false;
          });
        }
      }

      function deleteUsers() {
        if (!($scope.usersToDelete.length)) {
          $scope.error.deleteUsers = constant.REQUIRED_FIELD_ERROR;
        } else {
          $scope.loading = true;
          $scope.requestInProcess.deleteUsers = true;
          $scope.deleteUsersButton = 'Deleting...';
          groupService.deleteUsers($scope.group.id, $scope.usersToDelete).then(function success() {
            $scope.requestInProcess.deleteUsers = false;
            $scope.deleteUsersButton = 'Delete Users';
            toastr.success('Users Deleted');
            updateDone();
            $scope.deleteUsersForm.$setPristine();
            $scope.loading = false;
          }, function error() {
            updateDone();
            $scope.requestInProcess.deleteUsers = false;
            $scope.deleteUsersButton = 'Delete Users';
            toastr.error('Error in Updation');
            $scope.loading = false;
          });
        }
      }

      function addAdmin() {
        $scope.loading = true;
        $scope.requestInProcess.addAdmin = true;
        $scope.addAdminButton = 'Adding...';
        groupService.addAdmin($scope.updateAdmin.groupUserID).then(function success() {
          $scope.requestInProcess.addAdmin = false;
          toastr.success('Admin Added');
          $scope.addAdminButton = 'Add Admin';
          updateDone();
          $scope.updateAdmin.groupUserID = 0;
          $scope.addAdminForm.$setPristine();
          $scope.loading = false;
        }, function error() {
          updateDone();
          $scope.requestInProcess.addAdmin = false;
          $scope.addAdminButton = 'Add Admin';
          toastr.error('Error in Updation');
          $scope.loading = false;
        });
      }

      function removeAdmin() {
        $scope.loading = true;
        $scope.requestInProcess.removeAdmin = true;
        $scope.removeAdminButton = 'Removing...';
        groupService.removeAdmin($scope.updateAdmin.groupUserID).then(function success() {
          $scope.removeAdminForm.$setPristine();
          $scope.requestInProcess.removeAdmin = false;
          toastr.success('Admin Removed');
          $scope.removeAdminButton = 'Remove Admin';
          updateDone();
          $scope.updateAdmin.groupUserID = 0;
          $scope.loading = false;
        }, function error() {
          updateDone();
          $scope.requestInProcess.removeAdmin = false;
          $scope.removeAdminButton = 'Remove Admin';
          toastr.error('Error in Updation');
          $scope.loading = false;
        });
      }

      angular.extend($scope, {
        removeAdmin: removeAdmin,
        addAdmin: addAdmin,
        deleteUsers: deleteUsers,
        addUsers: addUsers,
        updateGroup: updateGroup,
        backToGroupDetail: backToGroupDetail,
        loadTags: loadTags,
        clearAddUsersError: clearAddUsersError,
        clearDeleteUsersError: clearDeleteUsersError,
        clearGroupNameError: clearGroupNameError,
        clearShortDescriptionError: clearShortDescriptionError
      });
    }]);
