angular.module('socialEventPlanner.group')
  .service('groupService', ['Restangular', 'constant',
    function groupService(Restangular, constant) {
      function createGroup(name, shortDescription, users) {
        var data = {
          name: name,
          short_desc: shortDescription,
          users: users
        };
        return Restangular.all(constant.URL.CREATE_GROUP).post(data);
      }

      function getGroups(limit, offset, userType, search) {
        var baseUsers = Restangular.oneUrl(constant.URL.GROUPS);
        var params = { limit: limit, offset: (limit * (offset - 1)), user_type: userType, group__name__icontains: search };
        return baseUsers.get(params);
      }

      function getGroup(id) {
        return Restangular.one(constant.URL.GROUP_DETAIL.replace('id', id)).get();
      }

      function updateGroup(id, name, shortDescription) {
        var data = {
          name: name,
          short_desc: shortDescription
        };
        return Restangular.one(constant.URL.GROUP_DETAIL_UPDATE.replace('id', id)).patch(data);
      }

      function addUsers(id, usersToAdd) {
        return Restangular.all(constant.URL.GROUP_MEMBER_UPDATE.replace('id', id)).post(
          { user_ids: usersToAdd }
        );
      }

      function deleteUsers(id, usersToDelete) {
        return Restangular.all(constant.URL.GROUP_MEMBER_UPDATE.replace('id', id)).customOperation(
          'remove', '', '', {'content-type': 'application/json'}, { user_ids: usersToDelete }
        );
      }

      function getAllGroups() {
        return Restangular.oneUrl(constant.URL.GROUPS_ALL).get();
      }

      function addAdmin(groupUserID) {
        return Restangular.one(constant.URL.GROUP_ADMIN_UPDATE.replace('group-user-id', groupUserID)).patch(
          { user_type: constant.GROUP_USER_TYPE.ADMIN }
        );
      }

      function removeAdmin(groupUserID) {
        return Restangular.one(constant.URL.GROUP_ADMIN_UPDATE.replace('group-user-id', groupUserID)).patch(
          { user_type: constant.GROUP_USER_TYPE.USER }
        );
      }

      function leaveGroup(id) {
        return Restangular.one(constant.URL.LEAVE_GROUP.replace('id', id)).customOperation('remove', '', '', {'content-type': 'application/json'});
      }

      angular.extend(this, {
        createGroup: createGroup,
        getGroups: getGroups,
        getAllGroups: getAllGroups,
        getGroup: getGroup,
        updateGroup: updateGroup,
        addUsers: addUsers,
        deleteUsers: deleteUsers,
        addAdmin: addAdmin,
        removeAdmin: removeAdmin,
        leaveGroup: leaveGroup
      });
    }]
  );
