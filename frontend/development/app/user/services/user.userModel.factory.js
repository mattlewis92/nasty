'use strict';

angular
  .module('<%= _.slugify(angularAppName) %>.user.services')
  .factory('userModel', function($state, $translate, DSHttpAdapter, FileUploader, ResourceFactory, authentication, flash, config) {

    function changeLanguage(lang) {
      $translate.use(lang);
      DSHttpAdapter.defaults.$httpConfig.headers['Accept-Language'] = lang;
    }

    var userModel = new ResourceFactory({
      name: 'user',
      methods: {
        changePassword: function(password) {

          return userModel.doPUT('password', {password: password}).then(function(result) {

            flash.confirm('PASSWORD_CHANGED', 'passwordSaved');

            return result;
          });

        },
        getSocialNetwork: function(type) {

          var accounts = this.social_network_accounts.filter(function(account) {
            return account.provider === type;
          });

          if (accounts.length === 0) {
            return null;
          } else {
            return accounts[0];
          }

        }
      },
      afterUpdate: function(resourceName, attrs, cb) {

        flash.confirm('PROFILE_UPDATED', 'userSaved');

        changeLanguage(attrs.language);

        cb(null, attrs);
      }
    });

    userModel.resetPasswordRequest = function(email) {

      return userModel.doPOST('password/reset/request', {email: email}).then(function(result) {

        flash.confirm('PASSWORD_RESET_REQUESTED', 'passwordResetRequested');

        return result;
      });

    };

    userModel.resetPassword = function(userId, token, password) {

      return userModel.doPUT('password/reset/' + userId + '/' + token, {password: password}).then(function(result) {

        $state.go('user.login').then(function() {
          flash.confirm('PASSWORD_RESET_COMPLETED', 'passwordResetCompleted');
        });

        return result;
      });

    };

    userModel.login = function(user) {

      return userModel.doPOST('authenticate', user).then(function(result) {
        authentication.store(result.data);
        $state.go(config.redirectStates.login);
        return result;
      });

    };

    userModel.logout = function() {

      authentication.clear();
      $state.go(config.redirectStates.logout);

    };

    userModel.register = function(user) {

      return userModel.doPOST('register', user).then(function() {
        return userModel.login(user);
      });

    };

    userModel.getAuthUser = function() {
      var userId = authentication.isAuthenticated() ? authentication.retrieve().user._id : 'current';
      return userModel.find(userId).then(function(user) {
        changeLanguage(user.language);
        return user;
      });
    };

    return userModel;

  });
