'use strict';

angular
  .module('nasty.user.services')
  .factory('User', function($state, $translate, ResourceFactory, DSHttpAdapter, Authentication, Flash) {

    function changeLanguage(lang) {
      $translate.use(lang);
      DSHttpAdapter.defaults.$httpConfig.headers['Accept-Language'] = lang;
    }

    var User = ResourceFactory.create({
      name: 'user',
      methods: {
        changePassword: function(password) {

          return User.doPUT('password', {password: password}).then(function(result) {

            Flash.confirm('PASSWORD_CHANGED', 'passwordSaved');

            return result;
          });

        }
      },
      afterUpdate: function(resourceName, attrs, cb) {

        Flash.confirm('PROFILE_UPDATED', 'userSaved');

        changeLanguage(attrs.language);

        cb(null, attrs);
      }
    });

    User.resetPasswordRequest = function(email) {

      return User.doPOST('password/reset/request', {email: email}).then(function(result) {

        Flash.confirm('PASSWORD_RESET_REQUESTED', 'passwordResetRequested');

        return result;
      });

    };

    User.resetPassword = function(userId, token, password) {

      return User.doPUT('password/reset/' + userId + '/' + token, {password: password}).then(function(result) {

        $state.go('user.login').then(function() {
          Flash.confirm('PASSWORD_RESET_COMPLETED', 'passwordResetCompleted');
        });

        return result;
      });

    };

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
      var userId = Authentication.isAuthenticated() ? Authentication.retrieve().user._id : 'current';
      return User.find(userId).then(function(user) {
        changeLanguage(user.language);
        return user;
      });
    };

    return User;

  });
