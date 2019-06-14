angular.module('socialEventPlanner.event')
  .controller('Event.EventDetailController', ['$scope', 'eventService', '$stateParams', 'userService', 'constant', '$state', 'toastr', '$interval',
    function EventDetailController($scope, eventService, $stateParams, userService, constant, $state, toastr, $interval) {
      $scope.isOwner = false;
      $scope.isAdmin = false;

      $scope.event = {};

      $scope.user = {
        id: 0
      };

      $scope.eventAdmins = [];
      $scope.eventOwner = {};
      $scope.eventUsers = [];
      $scope.currentUser = {};

      $scope.longDescriptionExists = false;
      $scope.groupExists = false;
      $scope.ownerExists = false;
      $scope.adminsExist = false;
      $scope.usersExist = false;
      $scope.isPublished = false;
      $scope.isUnpublished = false;
      $scope.isCancelled = false;
      $scope.showInviteButton = false;
      $scope.showRequestButton = false;
      $scope.showRequestCancelButton = false;
      $scope.inviteStatusString = '';
      $scope.requestActionParameter = 0;
      $scope.inviteActionParameter = 0;

      var i;
      $scope.loading = true;

      userService.getUser().then(function getUserSuccess(getUserResponse) {
        $scope.user.id = getUserResponse.id;
        eventService.getEvent($stateParams.id).then(function getEventSuccess(getEventResponse) {
          angular.extend($scope.event, {
            id: getEventResponse.id,
            name: getEventResponse.name,
            owner: getEventResponse.owner,
            group: getEventResponse.group,
            start: getEventResponse.start,
            end: getEventResponse.end,
            location: getEventResponse.location,
            shortDescription: getEventResponse.short_description,
            longDescription: getEventResponse.long_description,
            visibility: getEventResponse.visibility,
            availableSeats: getEventResponse.available_seats,
            costPerSeat: getEventResponse.cost_per_seat,
            eventStatus: getEventResponse.event_status,
            eventDetails: getEventResponse.event_details
          });

          switch ($scope.event.eventStatus) {
          case constant.EVENT_STATUS.PUBLISHED:
            $scope.event.eventStatus = constant.EVENT_STATUS_STRING.PUBLISHED;
            $scope.isPublished = true;
            break;
          case constant.EVENT_STATUS.UNPUBLISHED:
            $scope.event.eventStatus = constant.EVENT_STATUS_STRING.UNPUBLISHED;
            $scope.isUnpublished = true;
            break;
          case constant.EVENT_STATUS.CANCELED:
            $scope.event.eventStatus = constant.EVENT_STATUS_STRING.CANCELED;
            $scope.isCancelled = true;
            break;
          default:
          }

          if ($scope.event.longDescription !== '') {
            $scope.longDescriptionExists = true;
          }

          for (i = 0; i < $scope.event.eventDetails.length; i++) {
            if ($scope.user.id === $scope.event.eventDetails[i].user.id) {
              $scope.currentUser = $scope.event.eventDetails[i];
            }
            if ($scope.event.eventDetails[i].user_type === constant.EVENT_USER_TYPE.OWNER) {
              $scope.eventOwner = $scope.event.eventDetails[i];
              $scope.ownerExists = true;
            } else if ($scope.event.eventDetails[i].user_type === constant.EVENT_USER_TYPE.ADMIN) {
              if ($scope.event.eventDetails[i].invite_status === constant.EVENT_INVITE_STATUS.YES) {
                $scope.eventAdmins.push($scope.event.eventDetails[i]);
                $scope.adminsExist = true;
              }
            } else if ($scope.event.eventDetails[i].invite_status === constant.EVENT_INVITE_STATUS.YES) {
              $scope.eventUsers.push($scope.event.eventDetails[i]);
              $scope.usersExist = true;
            }
          }

          if ($scope.event.group) {
            $scope.groupExists = true;
          }

          if ($scope.currentUser.user_type === constant.EVENT_USER_TYPE.OWNER) {
            $scope.showInviteButton = false;
            $scope.showRequestButton = false;
            $scope.showRequestCancelButton = false;
            $scope.isOwner = true;
          } else if ($scope.currentUser.user_type === constant.EVENT_USER_TYPE.ADMIN) {
            $scope.showInviteButton = true;
            $scope.showRequestButton = false;
            $scope.showRequestCancelButton = false;
            $scope.isAdmin = true;
          } else if ($scope.currentUser.user_type === constant.EVENT_USER_TYPE.USER) {
            if ($scope.currentUser.invite_type === constant.EVENT_INVITE_TYPE.INVITED) {
              $scope.showInviteButton = true;
              $scope.showRequestButton = false;
              $scope.showRequestCancelButton = false;
            } else if ($scope.currentUser.invite_type === constant.EVENT_INVITE_TYPE.REQUESTED) {
              if ($scope.currentUser.invite_status === constant.EVENT_INVITE_STATUS.PENDING) {
                $scope.showInviteButton = false;
                $scope.showRequestButton = false;
                $scope.showRequestCancelButton = true;
              } else {
                $scope.showInviteButton = false;
                $scope.showRequestButton = false;
                $scope.showRequestCancelButton = false;
              }
            }
          } else {
            $scope.showInviteButton = false;
            $scope.showRequestButton = true;
            $scope.showRequestCancelButton = false;
          }

          if ($scope.showInviteButton) {
            switch ($scope.currentUser.invite_status) {
            case constant.EVENT_INVITE_STATUS.PENDING:
              $scope.inviteStatusString = constant.EVENT_INVITE_STATUS_STRING.PENDING;
              break;
            case constant.EVENT_INVITE_STATUS.YES:
              $scope.inviteStatusString = constant.EVENT_INVITE_STATUS_STRING.YES;
              break;
            case constant.EVENT_INVITE_STATUS.NO:
              $scope.inviteStatusString = constant.EVENT_INVITE_STATUS_STRING.NO;
              break;
            default:
              $scope.inviteStatusString = constant.EVENT_INVITE_STATUS_STRING.MAYBE;
            }
          }
          $scope.loading = false;
        }, function getEventError() {
          $state.go('afterLogin.eventList');
        });
      }, function getUserError() {
        $state.go('afterLogin.eventList');
      });

      function updateEvent() {
        $state.go('afterLogin.eventDetailUpdate', { 'id': $scope.event.id });
      }

      function viewRequests() {
        $state.go('afterLogin.eventRequestList', { 'id': $scope.event.id });
      }

      function inviteAction(action) {
        $scope.loading = true;
        $scope.inviteActionParameter = action;
        eventService.inviteAction(action, $scope.currentUser.id).then(function success() {
          $scope.inviteStatusString = constant.EVENT_INVITE_STATUS_STRING[$scope.inviteActionParameter];
          toastr.success('Invite Status Updated');
          $scope.loading = false;
        }, function error() {
        });
      }

      function requestAction(action) {
        $scope.loading = true;
        $scope.requestActionParameter = action;
        eventService.requestAction(action, $scope.event.id).then(function success() {
          if ($scope.requestActionParameter === 1) {
            $scope.showRequestButton = false;
            $scope.showRequestCancelButton = true;
            toastr.success('Request Sent');
          } else {
            $scope.showRequestButton = true;
            $scope.showRequestCancelButton = false;
            toastr.success('Request Cancelled');
          }
          $scope.loading = false;
        }, function error() {
        });
      }

      $scope.wsData = {};

      var socket = new WebSocket('ws://' + 'localhost:8000' + '/' + $stateParams.id + '/');

      socket.onmessage = function onmessage(e) {
        $scope.wsData = JSON.parse(e.data);
      };

      $interval(function updateLiveUsers() {
        if ($scope.wsData.no_of_live_users) {
          $scope.displayMessage = $scope.wsData.no_of_live_users;
        }
        if ($scope.wsData.available_seats) {
          $scope.event.availableSeats = $scope.wsData.available_seats;
        }
      }, 100);

      angular.extend($scope, {
        updateEvent: updateEvent,
        viewRequests: viewRequests,
        inviteAction: inviteAction,
        requestAction: requestAction
      });
    }]);
