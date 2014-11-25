'use strict';

angular
  .module('nasty.user.states')
  .classy
  .controller({

    name: 'UserResetPasswordRequestCtrl',

    inject: ['userModel'],

    methods: {
      resetRequested: function() {
        this.requested = true;
      }
    }

  });
