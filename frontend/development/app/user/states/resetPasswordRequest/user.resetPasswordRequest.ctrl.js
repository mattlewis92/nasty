'use strict';

angular
  .module('nasty.user.states')
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
