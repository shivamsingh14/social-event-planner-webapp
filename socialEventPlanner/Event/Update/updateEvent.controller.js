/* global loadTags _:true*/
/* eslint no-undef: "error"*/

angular.module('socialEventPlanner.event')
  .controller('EventUpdateController', ['eventService', '$stateParams', '$scope', 'constant', 'userService', '$state', 'toastr', '$uibModal', 'groupService', function (eventService, $stateParams, $scope, constant, userService, $state, toastr, $uibModal, groupService) {
    $scope.event = {
      id: 0,
      name: '',
      start: '',
      end: '',
      location: '',
      shortDescription: '',
      longDescription: '',
      visibility: '',
      available_seats: '',
      cost_per_seat: '',
      event_status: '',
      eventUsers: [],
      eventAdmins: [],
      group: null
    };

    var loading = true;

    $scope.error = {
      name: '',
      start: '',
      end: '',
      location: '',
      shortDescription: '',
      longDescription: '',
      visibility: '',
      available_seats: '',
      cost_per_seat: '',
      event_status: '',
      group: null,
      addUsers: []
    };

    $scope.eventAddUserList = [];
    $scope.eventAddAdminList = [];
    $scope.usersToDelete = [];

    $scope.non_field_errors = '';

    $scope.updateGroup = {
      groupId: 0
    };

    $scope.updateAdmin = {
      eventUserId: 0
    };

    $scope.updateUser = {
      eventUserId: 0
    };

    function cancel() {
      modalInstance.dismiss('');
    }

    $scope.groupVisible = false;

    $scope.user = {
      id: 0,
      groups: [],
      isOwner: false,
      isAdmin: false,
      list: []
    };


    $scope.errorAddUser = false;

    $scope.eventOwner;
    $scope.eventUserExist = false;
    $scope.eventAdminExist = false;

    var eventResponse;

    var modalInstance;

    function open() {
      modalInstance =  $uibModal.open({
        templateUrl: './commons/confirmBox.html',
        scope: $scope,
        size: '',
        windowClass: 'show'
      });
      modalInstance.result.then(function () {
      }, function () {
      });
    }

    function excludeUsers(value) {
      var usersInEvent = $scope.event.eventUsers.concat($scope.event.eventAdmins);
      var x;
      for (x in usersInEvent) {
        if (value.id === usersInEvent[x].user.id) {
          return false;
        }
      }
      var addedUserAdmins = $scope.eventAddUserList.concat($scope.eventAddAdminList);
      for (x in addedUserAdmins) {
        if (value.id === addedUserAdmins[x].id) {
          return false;
        }
      }
      if (value.id === $scope.eventOwner) {
        return false;
      }
      return true;
    }

    function updateEventUserAdminList() {
      eventService.getEvent($scope.event.id).then(function eventSucess(response) {
        var i;
        $scope.errorAddUser = false;
        $scope.event.eventUsers = [];
        $scope.event.eventAdmins = [];
        for (i = 0; i < response.event_details.length; i++) {
          if (response.event_details[i].user_type === constant.EVENT_USER_TYPE.USER) {
            $scope.event.eventUsers.push(response.event_details[i]);
          } else if (response.event_details[i].user_type === constant.EVENT_USER_TYPE.ADMIN) {
            $scope.event.eventAdmins.push(response.event_details[i]);
            if (response.event_details[i].user === $scope.user.id) {
              $scope.user.isAdmin = true;
            }
          }
        }
        if ($scope.event.eventUsers.length > 0) {
          $scope.eventUserExist = true;
        } else {
          $scope.eventUserExist = false;
        }
        if ($scope.event.eventAdmins.length > 0) {
          $scope.eventAdminExist = true;
        } else {
          $scope.eventAdminExist = false;
        }
      }, function eventError(errorResponse) {
        $scope.errorAddUser = true;
        $scope.error.eventUsers = [];
        $scope.error.eventUsers = errorResponse;
      });
    }

    function updateEvent() {
      $scope.loading = true;
      var event = {
        'id': $scope.event.id,
        'name': $scope.event.name,
        'location': $scope.event.location,
        'short_description': $scope.event.shortDescription,
        'long_description': $scope.event.longDescription,
        'available_seats': $scope.event.available_seats,
        'cost_per_seat': $scope.event.cost_per_seat,
        'start': $scope.event.start,
        'end': $scope.event.end
      };
      if ($scope.event.event_status === constant.EVENT_STATUS.UNPUBLISHED) {
        event.visibility = $scope.event.visibility;
        if ($scope.event.visibility === constant.EVENT_VISIBILITY.PUBLIC_FOR_A_GROUP) {
          event.group = $scope.updateGroup.groupId;
        } else {
          event.group = null;
        }
      }
      eventService.updateEvent(event).then(function success(response) {
        $scope.loading = false;
        toastr.success('Event Updated!');
        $scope.eventDetailForm.$setPristine();
        eventResponse = response;
      }, function error(response) {
        $scope.loading = false;
        if (!response.data.non_field_errors) {
          $scope.error.name = response.data.name;
          $scope.error.available_seats = response.data.available_seats;
          $scope.error.start = response.data.start;
          $scope.error.end = response.data.end;
          $scope.error.location = response.data.location;
          $scope.error.shortDescription = response.data.short_description;
          $scope.error.longDescription = response.data.long_description;
          $scope.error.visibility = response.data.visibility;
          $scope.error.cost_per_seat = response.data.cost_per_seat;
          $scope.error.event_status = response.data.event_status;
          $scope.error.group = response.data.group;
        } else {
          $scope.non_field_errors = '';
          for (var i = 0; i < response.data.non_field_errors.length; i++) {
            $scope.non_field_errors += response.data.non_field_errors[i];
          }
        }
      });
    }

    function resetEvent() {
      $scope.event.available_seats = eventResponse.available_seats;
      $scope.event.start = new Date(eventResponse.start);
      $scope.event.end = new Date(eventResponse.end);
      $scope.event.location = eventResponse.location;
      $scope.event.shortDescription = eventResponse.short_description;
      $scope.event.longDescription = eventResponse.long_description;
      $scope.event.visibility = eventResponse.visibility;
      $scope.event.cost_per_seat = eventResponse.cost_per_seat;
      $scope.event.event_status = eventResponse.event_status;
      $scope.updateGroup.groupId = eventResponse.group;
      $scope.eventDetailForm.$setPristine();
    }

    function addUsersAndAdmins() {
      gapi.load('client:auth2',  {
        callback: function() {
          gapi.client.init({
            'apiKey': 'AIzaSyAXaGev0JSslNVSUWX9qtBt0216setxymw',
            'clientId': '556641165876-29p1bsai998qjbali581le01dp8d8pnr.apps.googleusercontent.com',
            'scope': 'https://www.googleapis.com/auth/calendar',
            'discoveryDocs': ['https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest']
          }).then(function () {
            GoogleAuth = gapi.auth2.getAuthInstance();
            GoogleAuth.signIn().then(function success (response) {
              authToken = response.Zi.access_token;
              $scope.loading = true;
              var addList = [];
              var i;
              for (i = 0; i < $scope.eventAddUserList.length; i++) {
                addList.push({
                  'user': $scope.eventAddUserList[i].id,
                  'user_type': constant.EVENT_USER_TYPE.USER
                });
              }
              for (i = 0; i < $scope.eventAddAdminList.length; i++) {
                addList.push({
                  'user': $scope.eventAddAdminList[i].id,
                  'user_type': constant.EVENT_USER_TYPE.ADMIN
                });
              }

              eventService.addUsers(addList, $scope.event.id, authToken).then(function addSuccess(count) {
                $scope.loading = false;
                toastr.success(count + ' Users and Admins Added to Event');
                $scope.eventAddAdminList = [];
                $scope.eventAddUserList = [];
                $scope.addEventUsersForm.$setPristine();
                updateEventUserAdminList();
              }, function addError(addErrorResponse) {
                $scope.loading = false;
                updateEventUserAdminList();
                console.log(addErrorResponse);
              });
            })
          })
        }
      })
    }

    function removeUsers() {
      $scope.loading = true;
      modalInstance.close();
      var deleteList = [];
      var i;
      for (i = 0; i < $scope.usersToDelete.length; i++) {
        deleteList.push({
          'user': $scope.usersToDelete[i],
          'user_type': constant.EVENT_USER_TYPE.USER
        });
      }

      eventService.deleteUsers(deleteList, $scope.event.id).then(function deleteSuccess() {
        $scope.loading = false;
        toastr.success('Users Removed!');
        $scope.usersToDelete = [];
        $scope.deleteEventUsersForm.$setPristine();
        updateEventUserAdminList();
      }, function errorDelete() {
        updateEventUserAdminList();
        $scope.loading = false;
      });
    }

    function addAdmin() {
      if ($scope.updateAdmin.eventUserId !== 0) {
        $scope.loading = true;
        eventService.addAdmin($scope.updateAdmin.eventUserId).then(function adminAddSuccess() {
          toastr.success('Admin Successfully Added!');
          $scope.updateAdmin.eventUserId = 0;
          $scope.addAdminForm.$setPristine();
          updateEventUserAdminList();
          $scope.loading = false;
        }, function adminAddError() {
          updateEventUserAdminList();
          $scope.loading = false;
        });
      }
    }

    function removeAdmin() {
      if ($scope.updateUser.eventUserId !== 0) {
        $scope.loading = true;
        eventService.removeAdmin($scope.updateUser.eventUserId).then(function adminRemoveSuccess() {
          toastr.success('Admin Successfully Removed!');
          $scope.updateUser.eventUserId = 0;
          $scope.removeAdminForm.$setPristine();
          $scope.loading = false;
          updateEventUserAdminList();
        }, function adminRemoveFailure() {
          updateEventUserAdminList();
          $scope.loading = false;
        });
      }
    }

    function backToEventDetail() {
      $state.go('afterLogin.eventDetail', { 'id': $scope.event.id });
    }

    function changeEventStatus(status) {
      $scope.loading = true;
      gapi.load('client:auth2',  {
        callback: function() {
          gapi.client.init({
            'apiKey': 'AIzaSyAXaGev0JSslNVSUWX9qtBt0216setxymw',
            'clientId': '556641165876-29p1bsai998qjbali581le01dp8d8pnr.apps.googleusercontent.com',
            'scope': 'https://www.googleapis.com/auth/calendar',
            'discoveryDocs': ['https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest']
          }).then(function () {
            GoogleAuth = gapi.auth2.getAuthInstance();
            GoogleAuth.signIn().then(function sucessOauth(response) {
              var authToken = response.Zi.access_token;
              var toSendObject = {
                'event_status': status,
                'o_auth_token': authToken
              };
              eventService.eventStatusUpdate(toSendObject, $stateParams.id).then(function statusUpdateSuccess() {
                $scope.loading = false;
                if ($scope.event.event_status == constant.EVENT_STATUS.UNPUBLISHED) {
                  toastr.success('Event Published')
                  $scope.event.event_status=constant.EVENT_STATUS.PUBLISHED
                }
                else {
                  toastr.success('Event Canceled')
                  $scope.event.event_status=constant.EVENT_STATUS.CANCELED
                  $state.go('afterLogin.eventList');``
                }
              }, function updateStatusErorr() {
                updateEventUserAdminList();
                $scope.loading = false;
              })
          })
        }, function errorOauth(errorResponse) {
          toastr.error('Google Login Error', 'Try Again Later');
          $scope.loading = false;
        }
      )}
    })
  }

    function loadTags(query) {
      return userService.getUserList().then(function success(response) {
        $scope.user.list = [];
        for (var i = 0; i < response.length; i++) {
          $scope.user.list.push(response[i]);
        }
        $scope.user.list = $scope.user.list.filter(excludeUsers);
        var lowerQuery = query.toLowerCase();
        return _.filter($scope.user.list, function filter(user) {
          return user.email.startsWith(lowerQuery);
        });
      });
    };

    eventService.getEvent($stateParams.id).then(function success(response) {
      var i;
      eventResponse = response;
      userService.getUser().then(function userSuccess(responseUser) {
        $scope.loading = false;
        $scope.user.id = responseUser.id;
        $scope.event.id = response.id;
        $scope.event.name = response.name;
        $scope.event.start = new Date(response.start);
        $scope.event.end = new Date(response.end);
        $scope.event.location = response.location;
        $scope.event.shortDescription = response.short_description;
        $scope.event.longDescription = response.long_description;
        $scope.event.visibility = response.visibility;
        $scope.event.available_seats = response.available_seats;
        $scope.event.cost_per_seat = response.cost_per_seat;
        $scope.event.event_status = response.event_status;
        if (response.visibility == constant.EVENT_VISIBILITY.PUBLIC_FOR_A_GROUP) {
          $scope.event.group = response.group.id;
          $scope.updateGroup.groupId = response.group.id;
        } else {
          $scope.event.group = null;
          $scope.updateGroup.groupId = 0;
        }  
        for (i = 0; i < response.event_details.length; i++) {
          if (response.event_details[i].user_type === constant.EVENT_USER_TYPE.USER) {
            $scope.event.eventUsers.push(response.event_details[i]);
          } else if (response.event_details[i].user_type === constant.EVENT_USER_TYPE.ADMIN) {
            $scope.event.eventAdmins.push(response.event_details[i]);
            if (response.event_details[i].user.id === $scope.user.id) {
              $scope.user.isAdmin = true;
            }
          }
        }
        if ($scope.event.eventUsers.length > 0) {
          $scope.eventUserExist = true;
        }
        if ($scope.event.eventAdmins.length > 0) {
          $scope.eventAdminExist = true;
        }
        $scope.eventOwner = response.owner;
        if (response.owner === $scope.user.id) {
          $scope.user.isOwner = true;
        }
        if (!$scope.user.isAdmin && !$scope.user.isOwner) {
          $state.go('afterLogin.eventDetail', {'id': $scope.event.id});
        }
        groupService.getAllGroups().then(function groupSucess(groupResponse) {
          for (i = 0; i < groupResponse.length; i++) {
            $scope.user.groups.push(groupResponse[i].group);
          }
          $scope.loading = false;
        }, function groupError() {
          $scope.loading = false;
        });
      }, function userError() {
        $scope.loading = false;
      });
    }, function eventError(eventErrorResponse) {
      $scope.loading = false;
      if (eventErrorResponse.status === 404) {
        $state.go('afterLogin.eventList');
      }
    });

    angular.extend($scope, {
      cancel: cancel,
      open: open,
      updateEvent: updateEvent,
      resetEvent: resetEvent,
      removeUsers: removeUsers,
      addAdmin: addAdmin,
      removeAdmin: removeAdmin,
      changeEventStatus: changeEventStatus,
      backToEventDetail: backToEventDetail,
      addUsersAndAdmins: addUsersAndAdmins,
      loading: loading,
      loadTags: loadTags
    });
  }]);
