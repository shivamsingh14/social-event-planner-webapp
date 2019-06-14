angular
  .module('socialEventPlanner')
  .constant('constant', {
    REQUIRED_FIELD_ERROR: 'This Field is Required',
    MIN_LENGTH_ERROR: 'Should be atleast 2 characters!',
    MAX_LENGTH_ERROR: 'Should be less than 100 characters!',
    INVALID_ERROR: 'The input type is invalid',
    INVALID_DATE_INPUT: 'End date should be greater than start date',
    URL: {
      BASE_URL: 'http://localhost:8000/api',
      EVENTS: '/events/',
      EVENT_DETAIL: '/events/id/',
      EVENT_UPDATE: '/events/id/',
      EVENT_MEMBER_UPDATE: '/events/update/id/users/',
      EVENT_ADMIN_UPDATE: '/events/update/eventUserId/admin/',
      EVENT_REQUEST_LIST: '/events/view-request/eventId/',
      EVENT_REQUEST_RESPONSE: '/events/admin/request/eventId/',
      EVENT_STATUS_UPDATE: '/events/update/status/eventId/',
      GROUPS: '/groups/',
      GROUPS_ALL: '/groups/all/',
      USERS: '/users/',
      USER_PROFILE: '/users/profile/',
      USER_UPDATE: '/users/',
      USER_LIST: '/users/',
      USER_PASSWORD_CHANGE: '/users/change/password/',
      USER_LOGIN: '/users/login/',
      USER_LOGOUT: '/users/logout/',
      USER_RESET_PASSWORD: '/users/reset-password/',
      USER_CONFIRM: '/users/confirm/id/token/',
      USER_SET_PASSWORD: '/users/set-password/id/token/',
      CREATE_GROUP: '/groups/',
      GROUP_DETAIL: '/groups/id/',
      GROUP_DETAIL_UPDATE: '/groups/id/',
      GROUP_MEMBER_UPDATE: '/groups/id/update/members/',
      GROUP_ADMIN_UPDATE: '/groups/group-user-id/update/admin/',
      LEAVE_GROUP: '/groups/id/leave/',
      INVITE_ACTION: '/events/update/invite/status/id/',
      REQUEST_ACTION: '/events/request/id/',
      GROUP_LIST: '/groups/'
    },
    GROUP_USER_TYPE: {
      USER: 0,
      ADMIN: 1,
      OWNER: 2
    },
    EVENT_STATUS: {
      UNPUBLISHED: 0,
      PUBLISHED: 1,
      CANCELED: 2
    },
    EVENT_STATUS_STRING: {
      UNPUBLISHED: 'Unpublished',
      PUBLISHED: 'Published',
      CANCELED: 'Cancelled'
    },
    EVENT_VISIBILITY: {
      PUBLIC: 0,
      PUBLIC_FOR_A_GROUP: 1,
      PRIVATE: 2
    },
    EVENT_VISIBILITY_STRING: {
      PUBLIC: 'Public Event',
      PUBLIC_FOR_A_GROUP: 'Group Event',
      PRIVATE: 'Private Event'
    },
    EVENT_USER_TYPE: {
      USER: 0,
      ADMIN: 1,
      OWNER: 2
    },
    EVENT_INVITE_STATUS: {
      PENDING: 0,
      YES: 1,
      NO: 2,
      MAYBE: 3
    },
    EVENT_INVITE_STATUS_STRING: {
      PENDING: 'Pending',
      YES: 'Yes',
      NO: 'No',
      MAYBE: 'Maybe'
    },
    EVENT_INVITE_TYPE: {
      REQUESTED: 0,
      INVITED: 1,
      ADDED: 2
    }
  });
