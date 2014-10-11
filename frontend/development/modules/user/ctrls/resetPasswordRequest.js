'use strict';

angular
  .module('mean.user.ctrls')
  .classy
  .controller({

    name: 'UserResetPasswordRequestCtrl',

    inject: ['User'],

    init: function() {
      var self = this;
      this.resetRequested = function() {
        self.requested = true;
      };
    }

  });
