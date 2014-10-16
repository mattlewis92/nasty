'use strict';

angular
  .module('mean.user.ctrls')
  .classy
  .controller({

    name: 'UserResetPasswordRequestCtrl',

    inject: ['User'],

    methods: {
      resetRequested: function() {
        this.requested = true;
      }
    }

  });
