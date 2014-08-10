'use strict';

angular
  .module('mean.user.ctrls')
  .controller('UserRegisterCtrl', function($state, promiseTracker, User, ErrorHandler) {

    var self = this;

    this.loadingTracker = promiseTracker();

    this.user = {};

    this.register = function() {

      User
        .one()
        .withHttpConfig({tracker: this.loadingTracker})
        .register(this.user)
        .then(function() {
          return User.one()
            .withHttpConfig({tracker: self.loadingTracker})
            .authenticate({email: self.user.email, password: self.user.password});
        })
        .catch(ErrorHandler.http);

    };

  });
