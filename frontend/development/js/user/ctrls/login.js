'use strict';

angular
  .module('mean.user.ctrls')
  .controller('UserLoginCtrl', function($state, promiseTracker, User, Authentication) {

    this.loadingTracker = promiseTracker();
    this.user = {};
    this.Authentication = Authentication;

    this.login = function() {
      User
        .one()
        .withHttpConfig({tracker: this.loadingTracker})
        .authenticate(this.user);
    };

    if (Authentication.getToken()) {
      $state.go('user.home');
    }

  });
