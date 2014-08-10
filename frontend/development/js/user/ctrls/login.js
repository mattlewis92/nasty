'use strict';

angular
  .module('mean.user.ctrls')
  .classy
  .controller({

    name: 'UserLoginCtrl',

    inject: ['$state', 'promiseTracker', 'User', 'Authentication'],

    init: function() {
      this.loadingTracker = this.promiseTracker();
      this.user = {};
      if (this.Authentication.getToken()) {
        this.$state.go('user.home');
      }
    },

    login: function() {
      this.User
        .one()
        .withHttpConfig({tracker: this.loadingTracker})
        .authenticate(this.user);
    }

  });
