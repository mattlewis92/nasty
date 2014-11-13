'use strict';

angular
  .module('nasty.core.ctrls')
  .classy
  .controller({

    name: 'CoreNavbarCtrl',

    inject: ['$scope', 'authentication', 'user'],

    data: {
      authentication: 'authentication'
    },

    watch: {
      'authentication.isAuthenticated()': function(isAuthenticated) {
        this.isLoggedIn = isAuthenticated;
      }
    }

  });
