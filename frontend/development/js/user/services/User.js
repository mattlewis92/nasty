'use strict';

angular
  .module('mean.user.services')
  .factory('User', function($timeout, $state, ResourceFactory, HTTP, Authentication, Flash) {

    var User = ResourceFactory.create({
      name: 'user',
      methods: {
        changePassword: function(password) {

          return User.doPUT('password', {password: password}).then(function(result) {
            Flash.confirm('Your password was changed successfully.', 'passwordSaved');
            return result;
          });

        }
      },
      afterUpdate: function(resourceName, attrs, cb) {
        Flash.confirm('Your profile was updated successfully.', 'userSaved');
        cb(null, attrs);
      }
    });

    User.login = function(user) {

      return User.doPOST('authenticate', user).then(function(result) {
        Authentication.store(result.data);
        $state.go('user.home');
        return result;
      });

    };

    User.logout = function() {

      Authentication.clear();
      $state.go('user.login');

    };

    User.register = function(user) {

      return User.doPOST('register', user).then(function() {
        return User.login(user);
      });

    };

    User.getAuthUser = function() {
      return User.find(Authentication.retrieve().user._id);
    };

    return User;

  });
