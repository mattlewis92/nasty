'use strict';

angular
  .module('nasty.user.ctrls')
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
