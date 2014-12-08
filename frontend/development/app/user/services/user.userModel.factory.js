'use strict';

angular
  .module('<%= _.slugify(angularAppName) %>.user.services')
  .factory('userModel', function($state, $translate, DSHttpAdapter, FileUploader, ResourceFactory, authentication, growl) {

    function changeLanguage(lang) {
      $translate.use(lang);
      DSHttpAdapter.defaults.$httpConfig.headers['Accept-Language'] = lang;
    }

    var userModel = new ResourceFactory({
      name: 'user',
      methods: {
        changePassword: function(password) {

          return userModel.doPUT('password', {password: password}).then(function(result) {

            growl.success('PASSWORD_CHANGED', {referenceId: 'passwordSaved'});

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

        growl.success('PROFILE_UPDATED', {referenceId: 'userSaved'});

        changeLanguage(attrs.language);

        cb(null, attrs);
      }
    });

    userModel.resetPasswordRequest = function(email) {

      return userModel.doPOST('password/reset/request', {email: email}).then(function(result) {

        growl.success('PASSWORD_RESET_REQUESTED', {referenceId: 'passwordResetRequested'});

        return result;
      });

    };

    userModel.resetPassword = function(userId, token, password) {

      return userModel.doPUT('password/reset/' + userId + '/' + token, {password: password}).then(function(result) {

        $state.go('user.login').then(function() {
          growl.success('PASSWORD_RESET_COMPLETED', {referenceId: 'passwordResetCompleted'});
        });

        return result;
      });

    };

    userModel.login = function(user) {

      return userModel.doPOST('authenticate', user).then(function(result) {
        authentication.store(result.data);
        userModel.loginRedirect();
        return result;
      });

    };

    userModel.loginRedirect = function() {
      return $state.go('user.home');
    };

    userModel.logout = function() {
      authentication.clear();
      return userModel.logoutRedirect();
    };

    userModel.logoutRedirect = function() {
      return $state.go('user.login');
    };

    userModel.register = function(user) {

      return userModel.doPOST('register', user).then(function() {
        return userModel.login(user);
      });

    };

    userModel.getAuthUser = function() {
      return userModel.findOne().then(function(user) {
        changeLanguage(user.language);
        return user;
      });
    };

    return userModel;

  });
