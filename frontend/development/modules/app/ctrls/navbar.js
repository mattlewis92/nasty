'use strict';

angular
  .module('mean.app.ctrls')
  .classy
  .controller({

    name: 'AppNavbarCtrl',

    inject: ['$scope', 'Authentication', 'User'],

    data: {
      Authentication: 'Authentication'
    },

    watch: {
      'Authentication.isAuthenticated()': function(isAuthenticated) {
        this.isLoggedIn = isAuthenticated;
      }
    }

  });
