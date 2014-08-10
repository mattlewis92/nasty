'use strict';

angular
  .module('mean.user.ctrls')
  .classy
  .controller({

    name: 'UserHomeCtrl',

    inject: ['promiseTracker', 'AuthUser', 'ErrorHandler', 'User'],

    init: function() {
      this.loadingTracker = this.promiseTracker();
      this.user = this.AuthUser;
    },

    saveUser: function() {

      var self = this;
      this.userSaved = false;

      this.User
        .one()
        .withHttpConfig({tracker: this.loadingTracker})
        .update(this.user)
        .then(function(user) {
          self.user = user;
          self.userSaved = true;
        })
        .catch(this.ErrorHandler.http);

    },

    changePassword: function() {

      var self = this;
      this.passwordChanged = false;

      this.User
        .one()
        .withHttpConfig({tracker: this.loadingTracker})
        .changePassword(this.user)
        .then(function() {
          self.passwordChanged = true;
        })
        .catch(this.ErrorHandler.http);

    }

  });
