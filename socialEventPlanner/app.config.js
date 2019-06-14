
var myApp = angular.module('socialEventPlanner');

myApp.config(['$stateProvider', '$urlRouterProvider', function socialEventPlannerConfig($stateProvider, $urlRouterProvider) {
  $urlRouterProvider.otherwise('/login');

  $stateProvider
    .state('beforeLogin', {
      url: '',
      abstract: true,
      templateUrl: 'Base/before_login.template.html',
      controller: 'BeforeLoginController',
      data: {
        loginRequired: false
      }
    })
    .state('beforeLogin.login', {
      url: '/login',
      templateUrl: 'User/Login/login.template.html',
      controller: 'LoginController',
      data: {
        loginRequired: false
      }
    })
    .state('beforeLogin.signup', {
      url: '/signup',
      templateUrl: 'User/Signup/signup.template.html',
      controller: 'SignupController',
      data: {
        loginRequired: false
      }
    })
    .state('afterLogin', {
      url: '',
      abstract: true,
      templateUrl: 'Base/after_login.template.html',
      controller: 'AfterLoginController',
      data: {
        loginRequired: false
      }
    })
    .state('afterLogin.profile', {
      url: '/profile',
      templateUrl: 'User/Profile/profile.template.html',
      controller: 'User.ProfileController',
      data: {
        loginRequired: true
      }
    })
    .state('afterLogin.changePassword', {
      url: '/change/password',
      templateUrl: 'User/Change Password/changePassword.template.html',
      controller: 'User.ChangePasswordController',
      data: {
        loginRequired: true
      }
    })
    .state('afterLogin.eventList', {
      url: '/events',
      templateUrl: 'Event/list/event_list.template.html',
      controller: 'EventListController',
      data: {
        loginRequired: true
      }
    })
    .state('afterLogin.eventDetail', {
      url: '/event-detail/{id}/',
      templateUrl: 'Event/Detail/event-detail.template.html',
      controller: 'Event.EventDetailController',
      data: {
        loginRequired: true
      },
      params: {
        'id': ''
      }
    })
    .state('afterLogin.groupList', {
      url: '/groups/',
      templateUrl: 'Group/List/group_list.template.html',
      controller: 'groupListController',
      data: {
        loginRequired: true
      }
    })
    .state('afterLogin.eventDetailUpdate', {
      url: '/event/{id}/detail/update',
      templateUrl: 'Event/Update/updateEvent.template.html',
      controller: 'EventUpdateController',
      data: {
        loginRequired: true
      },
      params: {
        'id': ''
      }
    })
    .state('afterLogin.eventRequestList', {
      url: '/event/{id}/requests',
      templateUrl: 'Event/Request/eventRequest.template.html',
      controller: 'EventRequestListController',
      data: {
        loginRequired: true
      },
      params: {
        'id': ''
      }
    })
    .state('afterLogin.createGroup', {
      url: '/create-group',
      templateUrl: 'Group/Create-Group/create-group.template.html',
      controller: 'Group.GroupCreateController',
      data: {
        loginRequired: true
      }
    })
    .state('afterLogin.groupDetail', {
      url: '/group-detail/{id}/',
      templateUrl: 'Group/Group-Detail/group-detail.template.html',
      controller: 'Group.GroupDetailController',
      data: {
        loginRequired: true
      },
      params: {
        'id': ''
      }
    })
    .state('afterLogin.updateGroup', {
      url: '/update-group/{id}/',
      templateUrl: 'Group/Update-Group/update-group.template.html',
      controller: 'Group.GroupUpdateController',
      data: {
        loginRequired: true
      },
      params: {
        'id': ''
      }
    })
    .state('beforeLogin.requestToken', {
      url: '/reset-password',
      templateUrl: 'User/Forgot Password/requesttoken.template.html',
      controller: 'User.requestTokenController',
      data: {
        loginRequired: false
      }
    })
    .state('beforeLogin.resetPassword', {
      url: '/confirm/{id}/{token}',
      templateUrl: 'User/Forgot Password/set_password.template.html',
      controller: 'User.setPasswordController',
      data: {
        loginRequired: false
      }
    })
    .state('afterLogin.createEvent', {
      url: '/create-event',
      templateUrl: 'Event/create/create_event.template.html',
      controller: 'CreateEventController',
      data: {
        loginRequired: true
      }
    });
}]);

myApp.run(['$transitions', '$cookies', 'Restangular', 'constant', '$state', 'toastr', function socialEventPlannerRun($transitions, $cookies, Restangular, constant, $state, toastr) {
  $transitions.onBefore({}, function transitionAuthorization(transition) {
    // check if the state should be protected
    if (transition.to().data.loginRequired && !($cookies.get('token'))) {
      // redirect to the 'login' state
      toastr.warning('Not Logged In !');
      return transition.router.stateService.target('beforeLogin.login');
    } else if (!transition.to().data.loginRequired && ($cookies.get('token'))) {
      // redirect to event list page
      // toastr.warning('Already Logged In !');
      return transition.router.stateService.target('afterLogin.eventList');
    }
    return true;
  });

  var baseURL = constant.URL.BASE_URL;
  Restangular.setBaseUrl(baseURL);

  Restangular.addFullRequestInterceptor(function requestInterceptor(element, operation, what, url, headers) {
    var myHeader;
    if ((operation === 'post' && (url === baseURL + constant.URL.USER_LOGIN || url === baseURL + constant.URL.USERS || url === baseURL + constant.URL.USER_PASSWORD_CHANGE)) || !$cookies.get('token')) {
      myHeader = headers;
    } else {
      headers.Authorization = 'Token ' + $cookies.get('token');
      myHeader = headers;
      if (operation === 'patch' && url === baseURL + constant.URL.USER_UPDATE) {
        myHeader['Content-Type'] = undefined;
      }
    }

    return {
      headers: myHeader
    };
  });
}]);
