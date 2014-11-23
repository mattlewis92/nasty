'use strict';

angular
  .module('<%= _.slugify(angularAppName) %>.user.services')
  .factory('user', function($state, $translate, DSHttpAdapter, FileUploader, ResourceFactory, authentication, flash) {

    function changeLanguage(lang) {
      $translate.use(lang);
      DSHttpAdapter.defaults.$httpConfig.headers['Accept-Language'] = lang;
    }

    var User = new ResourceFactory({
      name: 'user',
      methods: {
        changePassword: function(password) {

          return User.doPUT('password', {password: password}).then(function(result) {

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

    User.resetPasswordRequest = function(email) {

      return User.doPOST('password/reset/request', {email: email}).then(function(result) {

        flash.confirm('PASSWORD_RESET_REQUESTED', 'passwordResetRequested');

        return result;
      });

    };

    User.resetPassword = function(userId, token, password) {

      return User.doPUT('password/reset/' + userId + '/' + token, {password: password}).then(function(result) {

        $state.go('user.login').then(function() {
          flash.confirm('PASSWORD_RESET_COMPLETED', 'passwordResetCompleted');
        });

        return result;
      });

    };

    User.login = function(user) {

      return User.doPOST('authenticate', user).then(function(result) {
        authentication.store(result.data);
        $state.go('user.home');
        return result;
      });

    };

    User.logout = function() {

      authentication.clear();
      $state.go('user.login');

    };

    User.register = function(user) {

      return User.doPOST('register', user).then(function() {
        return User.login(user);
      });

    };

    User.getAuthUser = function() {
      var userId = authentication.isAuthenticated() ? authentication.retrieve().user._id : 'current';
      return User.find(userId).then(function(user) {
        changeLanguage(user.language);
        return user;
      });
    };

    return User;

  });
