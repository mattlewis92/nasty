'use strict';

angular
  .module('<%= _.slugify(angularAppName) %>.user.states')
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
