angular.module('socialEventPlanner')
  .service('afterLoginService', ['Restangular', 'constant', function (Restangular, constant) {
    this.logoutUser = function logoutUser() {
      return Restangular.one(constant.URL.USER_LOGOUT).remove();
    };
  }]);
