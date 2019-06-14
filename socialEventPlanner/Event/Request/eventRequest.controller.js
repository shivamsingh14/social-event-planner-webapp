angular.module('socialEventPlanner.event')
  .controller('EventRequestListController', ['$scope', 'eventService', '$stateParams', 'toastr', '$state', function ($scope, eventService, $stateParams, toastr, $state) {
    var requestStatus = {
      Pending: 0,
      Yes: 1,
      No: 2
    };

    var eventUserListExist = false;
    var eventUsers = [];
    var error = '';

    function getRequestList() {
      $scope.eventUsers = [];
      eventService.getRequestList($stateParams.id).then(function requestListSuccess(requestListResponse) {
        var i;
        $scope.eventUserListExist = false;
        if (requestListResponse.length > 0) {
          $scope.eventUserListExist = true;
        }
        for (i = 0; i < requestListResponse.length; i++) {
          requestListResponse[i].response_status = $scope.requestStatus.Pending;
          $scope.eventUsers.push(requestListResponse[i]);
        }
      }, function requestListErrror() {
      });
    }

    function backToEventDetail() {
      $state.go('afterLogin.eventDetail', { 'id': $stateParams.id });
    }

    function submitRequestsResponse() {
      var i;
      var responseList = [];
      for (i = 0; i < $scope.eventUsers.length; i++) {
        if ($scope.eventUsers[i].response_status !== $scope.requestStatus.Pending) {
          var user = {
            'id': $scope.eventUsers[i].id,
            'invite_status': $scope.eventUsers[i].response_status
          };
          responseList.push(user);
        }
      }
      eventService.sendRequestResponse(responseList, $stateParams.id).then(function requestResponseSuccess() {
        getRequestList();
        toastr.success('Requests Updated!');
      }, function requestResponseError(errorResponse) {
        $scope.error = '';
        $scope.error = errorResponse.data.non_field_errors;
      });
    }

    getRequestList();

    angular.extend($scope, {
      sendRequestResponse: submitRequestsResponse,
      backToEventDetail: backToEventDetail,
      eventUserListExist: eventUserListExist,
      requestStatus: requestStatus,
      eventUsers: eventUsers,
      error: error
    });
  }]);
