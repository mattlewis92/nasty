'use strict';

angular
  .module('nasty.user.ctrls')
  .classy
  .controller({

    name: 'UserResetPasswordRequestCtrl',

    inject: ['user'],

    methods: {
      resetRequested: function() {
        this.requested = true;
      }
    }

  });
