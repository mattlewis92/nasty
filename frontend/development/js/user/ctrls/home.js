'use strict';

angular
  .module('mean.user.ctrls')
  .controller('UserHomeCtrl', function(promiseTracker, AuthUser, ErrorHandler, User) {
    var self = this;
    this.loadingTracker = promiseTracker();
    this.user = AuthUser;

    this.saveUser = function() {

      this.userSaved = false;

      User
        .one()
        .withHttpConfig({tracker: this.loadingTracker})
        .update(this.user)
        .then(function(user) {
          self.user = user;
          self.userSaved = true;
        })
        .catch(ErrorHandler.http);

    };

    this.changePassword = function() {

      this.passwordChanged = false;

      User
        .one()
        .withHttpConfig({tracker: this.loadingTracker})
        .changePassword(this.user)
        .then(function() {
          self.passwordChanged = true;
        })
        .catch(ErrorHandler.http);

    };

  });
