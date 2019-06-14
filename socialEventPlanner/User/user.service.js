'use strict';

angular.module('socialEventPlanner.user')
  .service('userService', ['Restangular', 'constant', function userService(Restangular, constant) {
    this.loginUser = function loginUser(email, password) {
      var parameter = {
        'username': email,
        'password': password
      };
      return Restangular.all(constant.URL.USER_LOGIN).post(parameter);
    };

    this.signupUser = function signupUser(firstName, lastName, email, password, dob, gender) {
      var parameter = {
        'first_name': firstName,
        'last_name': lastName,
        'email': email,
        'password': password,
        'date_of_birth': dob,
        'gender': gender
      };

      return Restangular.all(constant.URL.USERS).post(parameter);
    };

    this.getUser = function getUser() {
      return Restangular.one(constant.URL.USER_PROFILE).get();
    };

    this.updateUser = function updateUser(user) {
      return Restangular.one(constant.URL.USER_UPDATE.replace('userid', user.get('id'))).patch(user);
    };

    this.updatePassword = function updatePassword(data) {
      return Restangular.one(constant.URL.USER_PASSWORD_CHANGE).patch(data);
    };

    this.requestToken = function requestToken(email) {
      var parameter = {
        'email': email
      };
      return Restangular.all(constant.URL.USER_RESET_PASSWORD).post(parameter);
    };

    this.getValidToken = function getValidToken(id, token) {
      return Restangular.oneUrl(constant.URL.USER_CONFIRM.replace('id', id).replace('token', token)).get();
    };

    this.setPassword = function setPassword(id, token, password) {
      var parameter = {
        'password': password
      };
      return Restangular.all(constant.URL.USER_SET_PASSWORD.replace('id', id).replace('token', token)).patch(parameter);
    };

    this.getUserList = function getUserList() {
      return Restangular.oneUrl(constant.URL.USERS).get();
    };
  }]
  );
