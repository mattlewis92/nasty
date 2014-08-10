'use strict';

angular
  .module('mean.user.ctrls')
  .classy
  .controller({

    name: 'UserRegisterCtrl',

    inject: ['$state', 'promiseTracker', 'User', 'ErrorHandler'],

    init: function() {
      this.loadingTracker = this.promiseTracker();
      this.user = {};
    },

    register: function() {
      var self = this;

      this.User
        .one()
        .withHttpConfig({tracker: this.loadingTracker})
        .register(this.user)
        .then(function() {
          return self.User.one()
            .withHttpConfig({tracker: self.loadingTracker})
            .authenticate({email: self.user.email, password: self.user.password});
        })
        .catch(this.ErrorHandler.http);
    }

  });
