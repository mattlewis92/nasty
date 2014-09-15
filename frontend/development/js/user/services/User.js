'use strict';

angular
  .module('mean.user.services')
  .factory('User', function($timeout, $state, ResourceFactory, DSHttpAdapter, ErrorHandler, Authentication, Flash) {

    var User = ResourceFactory.create({
      name: 'user',
      methods: {
        changePassword: function(password) {

          return DSHttpAdapter
            .PUT('/api/v1/user/password', {password: password}, {tracker: User.meta.loadingTracker})
            .then(function(result) {
              Flash.confirm('Your password was changed successfully.', 'passwordSaved');
              return result;
            })
            .catch(ErrorHandler.http);
        }
      },
      afterUpdate: function(resourceName, attrs, cb) {
        Flash.confirm('Your profile was updated successfully.', 'userSaved');
        cb(null, attrs);
      }
    });

    User.login = function(user) {

      return DSHttpAdapter
        .POST('/api/v1/user/authenticate', user, {tracker: User.meta.loadingTracker})
        .then(function(result) {
          Authentication.store(result.data);
          $state.go('user.home');
          return result;
        })
        .catch(ErrorHandler.http);

    };

    User.logout = function() {

      Authentication.clear();
      $state.go('user.login');

    };

    User.register = function(user) {

      return DSHttpAdapter
        .POST('/api/v1/user/register', user, {tracker: User.meta.loadingTracker})
        .then(function() {
          return User.login(user);
        })
        .catch(ErrorHandler.http);
    };

    User.getAuthUser = function() {
      return User.find(Authentication.retrieve().user._id);
    };

    return User;

  });
