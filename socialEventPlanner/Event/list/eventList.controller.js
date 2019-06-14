angular.module('socialEventPlanner.event')
  .controller('EventListController', ['$scope', '$state', 'eventService', '$location', 'userService', '$filter', '$stateParams',
    function EventListController($scope, $state, eventService, $location, userService, $filter) {
      userService.getUser().then(function success(response) {
        $scope.owner = response.id;
      });
      $scope.search = $location.search().search;
      $scope.item = $location.search().visibility ? parseInt($location.search().visibility, 10) : $location.search().visibility;
      $scope.user = $location.search().role ? parseInt($location.search().role, 10) : $location.search().role;
      $scope.order = $location.search().SortBy;
      $scope.eventStatus = $location.search().eventStatus ? parseInt($location.search().eventStatus, 10) : $location.search().eventStatus;

      $scope.emptyEventList = false;
      $scope.loading = true;

      $location.search('search', $scope.search);
      $location.search('visibility', $scope.item);
      $location.search('role', $scope.user);
      $location.search('SortBy', $scope.order);
      $location.search('eventStatus', $scope.eventStatus);

      $scope.total_count = 1;
      $scope.itemsPerPage = 2;

      $scope.viewDetails = function viewDetails(id) {
        $state.go('afterLogin.eventDetail', {'id': id});
      };

      $scope.viewEvents = function viewEvents(page) {
        $scope.pagination = {
          current: page
        };
        if ( $scope.order === 0) {
          $scope.order = 'name';
        } else if ($scope.order === 1) {
          $scope.order = 'start';
        }

        if ( $scope.eventStatus === 1) {
          var end =  $filter('date')(new Date(), 'yyyy-MM-dd');
        } else if ( $scope.eventStatus === 1) {
          var start = $filter('date')(new Date(), 'yyyy-MM-dd');
        }

        if (!page) {
          $location.search('page', 1);
        }

        $location.search('page', page);
        $location.search('search', $scope.search);
        $location.search('visibility', $scope.item);
        $location.search('role', $scope.user);
        $location.search('SortBy', $scope.order);
        $location.search('eventStatus', $scope.eventStatus);

        eventService.getEvents($scope.itemsPerPage, page, $scope.search, $scope.item, $scope.user, $scope.order, start, end).then(function (response) {
          $scope.total_count = response.count;
          if (response.count === 0) {
            $scope.emptyEventList = true;
          } else {
            $scope.emptyEventList = false;
          }
          if ($scope.order === 'name') {
            $scope.order = 0;
          } else if ($scope.order === 'start') {
            $scope.order = 1;
          }
          $scope.list = response.results;
          $scope.loading = false;
        }, function error() {
          $scope.loading = false;
        });
      };
      if ( !$location.search().page ) {
        $scope.viewEvents(1);
      }
      $scope.viewEvents($location.search().page);
    }]);
