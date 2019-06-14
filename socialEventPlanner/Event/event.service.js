angular.module('socialEventPlanner.event')
  .service('eventService', ['Restangular', 'constant',
    function eventService(Restangular, constant) {
      function createEventForm(eventObject) {
        return Restangular.all(constant.URL.EVENTS).post(eventObject);
      }

      function getEvents(limit, offset, search, inviteStatus, user, orderBy, start, end) {
        var baseUsers = Restangular.oneUrl(constant.URL.EVENTS);
        var params = { limit: limit, offset: (limit * (offset - 1)), name__icontains: search, users__invite_type: inviteStatus, users__user_type: user, order: orderBy, start__gte: start, end__lt: end };
        return baseUsers.get(params);
      }

      function getEvent(id) {
        return Restangular.oneUrl(constant.URL.EVENT_DETAIL.replace('id', id)).get();
      }

      function inviteAction(action, id) {
        return Restangular.one(constant.URL.INVITE_ACTION.replace('id', id)).patch(
          { invite_status: constant.EVENT_INVITE_STATUS[action] }
        );
      }

      function requestAction(action, id) {
        if (action === 1) {
          return Restangular.one(constant.URL.REQUEST_ACTION.replace('id', id)).post();
        }
        return Restangular.one(constant.URL.REQUEST_ACTION.replace('id', id)).remove();
      }

      function updateEvent(event) {
        return Restangular.one(constant.URL.EVENT_UPDATE.replace('id', event.id)).patch(event);
      }

      function addUsers(userList, id, authToken) {
        var toSend = {
          'users': userList,
          'o_auth_token': authToken
        };
        return Restangular.all(constant.URL.EVENT_MEMBER_UPDATE.replace('id', id)).post(toSend);
      }

      function deleteUsers(usersToDelete, id) {
        return Restangular.all(constant.URL.EVENT_MEMBER_UPDATE.replace('id', id)).customOperation(
          'remove', '', '', { 'content-type': 'application/json' }, {'users': usersToDelete }
        );
      }

      function addAdmin(eventUserId) {
        return Restangular.oneUrl(constant.URL.EVENT_ADMIN_UPDATE.replace('eventUserId', eventUserId)).patch(
          { 'user_type': constant.EVENT_USER_TYPE.ADMIN }
        );
      }

      function removeAdmin(eventUserId) {
        return Restangular.oneUrl(constant.URL.EVENT_ADMIN_UPDATE.replace('eventUserId', eventUserId)).patch(
          { 'user_type': constant.EVENT_USER_TYPE.USER }
        );
      }

      function getRequestList(eventId) {
        return Restangular.oneUrl(constant.URL.EVENT_REQUEST_LIST.replace('eventId', eventId)).get();
      }

      function sendRequestResponse(responseList, eventId) {
        return Restangular.oneUrl(constant.URL.EVENT_REQUEST_RESPONSE.replace('eventId', eventId)).patch(
          { 'users': responseList }
        );
      }

      function eventStatusUpdate(statusObject, eventId) {
        return Restangular.oneUrl(constant.URL.EVENT_STATUS_UPDATE.replace('eventId', eventId)).patch(statusObject);
      }

      angular.extend(this, {
        eventStatusUpdate: eventStatusUpdate,
        sendRequestResponse: sendRequestResponse,
        getRequestList: getRequestList,
        removeAdmin: removeAdmin,
        addAdmin: addAdmin,
        deleteUsers: deleteUsers,
        addUsers: addUsers,
        updateEvent: updateEvent,
        requestAction: requestAction,
        inviteAction: inviteAction,
        getEvent: getEvent,
        getEvents: getEvents,
        createEventForm: createEventForm
      });
    }
  ]);
