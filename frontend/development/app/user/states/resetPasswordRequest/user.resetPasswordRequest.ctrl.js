'use strict';

angular
  .module('<%= _.slugify(angularAppName) %>.user.states')
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
