'use strict';

angular
  .module('nasty.user.routes')
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
