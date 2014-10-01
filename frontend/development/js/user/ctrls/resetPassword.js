'use strict';

angular
  .module('mean.user.ctrls')
  .classy
  .controller({

    name: 'UserResetPasswordCtrl',

    inject: ['User'],

    init: function() {
      var self = this;
      this.resetRequested = function() {
        self.requested = true;
      }
    }

  });
