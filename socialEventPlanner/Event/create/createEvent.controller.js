angular.module('socialEventPlanner.event')
  .controller('CreateEventController', ['$scope', '$state', 'eventService', 'toastr', 'groupService', 'constant',
    function CreateEventController($scope, $state, eventService, toastr, groupService, constant) {
      $scope.publicForGroup = false;
      $scope.requestInProcess = false;
      $scope.createEventButton = 'Create Event';
      $scope.item = 0;

      var GoogleAuth;
      var authToken = null;
      $scope.item = 0;
      $scope.items =[];

      $scope.error = {
        eventName: '',
        shortDescription: '',
        longDescription: '',
        availableSeats: '',
        startDate: '',
        endDate: ''
      };

      $scope.group;

      $scope.eventObject = {
        name: '',
        short_description: '',
        group: '',
        start: '',
        end: '',
        location: '',
        long_description: '',
        visibility: 0,
        available_seats: '',
        cost_per_seat: ''
      };

      $scope.currentDate = new Date().toISOString();

      function clearError(fieldName) {
        $scope.error[fieldName] = '';
      }

      // TODO: Use new api after code merge for fetching groups
      groupService.getAllGroups().then(function (response) {
        var i;
        for(i = 0; i < response.length; i++) {
          $scope.items.push(response[i]);
        }
      });

      function createEvent() {
        if ($scope.createEventForm.$invalid) {
          if ($scope.createEventForm.name.$error.required) {
            $scope.error.eventName = constant.REQUIRED_FIELD_ERROR;
          }
          if ($scope.createEventForm.shortDescription.$error.required) {
            $scope.error.shortDescription = constant.REQUIRED_FIELD_ERROR;
          }
          if ($scope.createEventForm.longDescription.$error.required) {
            $scope.error.longDescription = constant.REQUIRED_FIELD_ERROR;
          }
          if ($scope.createEventForm.location.$error.required) {
            $scope.error.location = constant.REQUIRED_FIELD_ERROR;
          }
          if ($scope.createEventForm.availableSeats.$error.required) {
            $scope.error.availableSeats = constant.REQUIRED_FIELD_ERROR;
          }
          if ($scope.createEventForm.cost.$error.required) {
            $scope.error.cost = constant.REQUIRED_FIELD_ERROR;
          }
          if ($scope.createEventForm.startDate.$invalid) {
            $scope.error.startDate = constant.INVALID_ERROR;
          }
          if ($scope.createEventForm.endDate.$invalid) {
            $scope.error.endDate = constant.INVALID_ERROR;
          }
        } else if ($scope.eventObject.start >= $scope.eventObject.end) {
          $scope.error.endDate = constant.INVALID_DATE_INPUT;
        } else {
          $scope.requestInProcess = true;
          $scope.createEventButton = 'Creating...';
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
                  $scope.eventObject['o_auth_token'] = authToken
                  eventService.createEventForm($scope.eventObject).then(function (eventResponse) {
                    $scope.requestInProcess = false;
                    $scope.createEventButton = 'Create';
                    toastr.success($scope.name, 'created successfully');
                    $state.go('afterLogin.eventDetail', {'id': eventResponse.id});
                  }, function error() {
                    $scope.createEventButton = 'Create';
                    $scope.requestInProcess = false;
                  });
                });
              });
            },
            onerror: function() {
              // Failed to load libraries
            }
          });
        }
      };

      function visibility(item) {
        if ($scope.eventObject.visibility === 1) {
          console.log($scope.items);
          $scope.publicForGroup = true;
        } else {
          $scope.publicForGroup = false;
        }
      }

      function selectGroup() {
        $scope.eventObject.group = $scope.group.group.id;
      }

      angular.extend($scope, {
        selectGroup: selectGroup,
        visibility: visibility,
        createEvent: createEvent,
        clearError: clearError
      });
    }]);
