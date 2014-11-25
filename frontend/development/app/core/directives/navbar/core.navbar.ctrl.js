'use strict';

angular
  .module('nasty.core.directives')
  .classy
  .controller({

    name: 'CoreNavbarCtrl',

    inject: ['$scope', 'authentication', 'userModel'],

    data: {
      authentication: 'authentication'
    },

    watch: {
      'authentication.isAuthenticated()': function(isAuthenticated) {
        this.isLoggedIn = isAuthenticated;
      }
    }

  });
