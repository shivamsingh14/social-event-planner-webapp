/* eslint-disable no-unused-vars */
angular.module('socialEventPlanner.group')
  .controller('Group.GroupDetailController', ['$scope', 'groupService', 'constant', 'toastr', '$stateParams', '$state', 'userService',
    function GroupDetailController($scope, groupService, constant, toastr, $stateParams, $state, userService) {
      $scope.group = {
        id: '',
        name: '',
        shortDescription: '',
        owner: 0,
        groupDetails: []
      };

      $scope.error = {
        groupName: '',
        shortDescription: '',
        usersArrayUser: '',
        usersArrayAdmin: ''
      };

      $scope.user = {
        id: 0
      };

      $scope.displayMessage = 0;

      $scope.liveUsers = 0;
      $scope.isNotOwner = true;
      $scope.loading = true;

      $scope.group.id = $stateParams.id;

      groupService.getGroup($stateParams.id).then(function success(response) {
        $scope.group.id = response.id;
        $scope.group.name = response.name;
        $scope.group.shortDescription = response.short_desc;
        $scope.group.owner = response.owner;
        $scope.group.groupDetails = response.group_details;

        userService.getUser().then(function getUserSuccess(getUserResponse) {
          $scope.user.id = getUserResponse.id;
          if ($scope.user.id === $scope.group.owner) {
            $scope.isNotOwner = false;
          }
          for (var i = 0; i < $scope.group.groupDetails.length; i++) {
            if ($scope.user.id === $scope.group.groupDetails[i].user.id && $scope.group.groupDetails[i].user_type === constant.GROUP_USER_TYPE.OWNER) {
              $scope.isOwner = true;
            } else if ($scope.user.id === $scope.group.groupDetails[i].user.id && $scope.group.groupDetails[i].user_type === constant.GROUP_USER_TYPE.ADMIN) {
              $scope.isAdmin = true;
            }
          }
        }, function error() {
          $scope.loading = false;
          $state.go('afterLogin.eventList');
        });
        $scope.loading = false;
      }, function error() {
        $scope.loading = false;
        $state.go('afterLogin.eventList');
      });

      function updateGroup() {
        $state.go('afterLogin.updateGroup', { 'id': $scope.group.id });
      }

      function leaveGroup() {
        $scope.loading = true;
        groupService.leaveGroup($scope.group.id).then(function success() {
          $scope.loading = false;
          toastr.success('Left Group');
          $state.go('afterLogin.eventList');
        }, function  error() {
          $scope.loading = false;
          $state.go('afterLogin.eventList');
        });
      }

      angular.extend($scope, {
        updateGroup: updateGroup,
        leaveGroup: leaveGroup
      });
    }]);
