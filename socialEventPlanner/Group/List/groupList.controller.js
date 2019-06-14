angular.module('socialEventPlanner.group')
  .controller('groupListController', ['$scope', '$location', 'groupService', '$state',
    function groupListController($scope, $location, groupService, $state) {
      angular.extend($scope, {
        pageno: 3,
        total_count: 1,
        itemsPerPage: 2,
        item: $location.search().userType,
        search: $location.search().search
      });

      $scope.loading = true;
      $scope.emptyGroupList = false;

      $location.search('userType', $scope.item);
      $location.search('search', $scope.search);

      $scope.getGroups = function getGroups(page) {
        $scope.pagination = {
          current: page
        };
        $location.search('page', page);
        $location.search('userType', $scope.item);
        $location.search('search', $scope.search);

        groupService.getGroups($scope.itemsPerPage, page, $scope.item, $scope.search).then(function (response) {
          $scope.loading = false;
          $scope.total_count = response.count;
          if (response.count === 0) {
            $scope.emptyGroupList = true;
          } else {
            $scope.emptyGroupList = false;
          }
          $scope.list = response.results;
        }, function error() {
          $scope.loading = false;
        });
      };

      $scope.viewDetails = function viewDetails(id) {
        $state.go('afterLogin.groupDetail', {'id': id});
      };

      $scope.getGroups($location.search().page);
    }]);


