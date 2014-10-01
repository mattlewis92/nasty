'use strict';

angular
  .module('mean.user.services')
  .factory('User', function($timeout, $state, $translate, ResourceFactory, HTTP, DSHttpAdapter, Authentication, Flash) {

    function changeLanguage(lang) {
      $translate.use(lang);
      DSHttpAdapter.defaults.$httpConfig.headers['Accept-Language'] = lang;
    }

    var User = ResourceFactory.create({
      name: 'user',
      methods: {
        changePassword: function(password) {

          return User.doPUT('password', {password: password}).then(function(result) {

            $translate('PASSWORD_CHANGED').then(function(str) {
              Flash.confirm(str, 'passwordSaved');
            });

            return result;
          });

        }
      },
      afterUpdate: function(resourceName, attrs, cb) {

        $translate('PROFILE_UPDATED').then(function(str) {
          Flash.confirm(str, 'userSaved');
        });

        changeLanguage(attrs.language);

        cb(null, attrs);
      }
    });

    User.resetPasswordRequest = function(email) {

      return User.doPOST('password/reset/request', {email: email}).then(function(result) {

        $translate('PASSWORD_RESET_REQUESTED').then(function(str) {
          Flash.confirm(str, 'passwordResetRequested');
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
      return User.find(Authentication.retrieve().user._id).then(function(user) {
        changeLanguage(user.language);
        return user;
      });
    };

    return User;

  });
