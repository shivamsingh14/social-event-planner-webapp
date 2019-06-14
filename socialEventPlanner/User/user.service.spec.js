/* eslint-disable no-unused-vars */
/* eslint-disable func-names */
describe('users factory', function userFactoryDescribe() {
  var userService;
  var constant;
  var $httpBackend;
  var $q;

  var loginSuccessResponse = {
    'token': '3fb525ccb2372edd2008d91b4d439bb7ee59b4c8'
  };

  beforeEach(angular.mock.module('socialEventPlanner.user'));

  beforeEach(function () {
    module('socialEventPlanner.user', function ($provide) {
      $provide.constant('constant', {
        REQUIRED_FIELD_ERROR: 'This Field is Required',
        URL: {
          BASE_URL: 'http://localhost:8000/api',
          EVENTS: '/events/',
          USERS: '/users/',
          USER_PROFILE: '/users/profile/',
          USER_UPDATE: '/users/',
          USER_PASSWORD_CHANGE: '/users/change/password/',
          USER_LOGIN: '/users/login/',
          USER_LOGOUT: '/users/logout/',
          USER_RESET_PASSWORD: '/users/resetpassword/',
          USER_CONFIRM: '/users/confirm/id/token/',
          USER_SET_PASSWORD: '/users/setpassword/id/token/'
        }
      });
    });
  });

  beforeEach(inject(function (_userService_, _constant_, _$httpBackend_, _$q_) {
    userService = _userService_;
    constant = _constant_;
    $httpBackend = _$httpBackend_;
    $q = _$q_;
  }));

  it('should exist', function userServiceExistTest() {
    expect(userService).toBeDefined();
  });

  describe('loginUser()', function loginUserDescribe() {
    var self = this;

    beforeEach(function () {
      self.result = {};

      spyOn(userService, 'loginUser').and.callThrough();
    });

    it('should exist', function loginUserExistTest() {
      expect(userService.loginUser).toBeDefined();
    });

    it('should return a token when provided with valid credentials', function loginUserWorkingTest() {
      var email = 'sarthak@josh.com';
      var password = 'sarthak';

      $httpBackend.whenPOST('', {
        'username': email,
        'password': password
      }).respond($q.when(loginSuccessResponse));

      expect(userService.loginUser).not.toHaveBeenCalled();
      expect(self.result).toEqual({});

      userService.loginUser(email, password)
        .then(function success(response) {
          self.result = response;
        });

      $httpBackend.flush();
      expect(userService.loginUser).toHaveBeenCalled();
      expect(self.result.token).toEqual('3fb525ccb2372edd2008d91b4d439bb7ee59b4c8');
    });
  });

  describe('signupUser()', function signupUserDescribe() {
    it('should exist', function signupUserExistTest() {
      expect(userService.signupUser).toBeDefined();
    });
  });
});
