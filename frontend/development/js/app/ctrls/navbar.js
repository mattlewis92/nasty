'use strict';

angular
  .module('mean.app.ctrls')
  .classy
  .controller({

    name: 'AppNavbarCtrl',

    inject: ['$scope', '$state', 'Authentication'],

    init: function() {
      this.$.Authentication = this.Authentication;
    },

    watch: {
      'Authentication.getToken()': function(token) {
        this.isLoggedIn = !!token;
      }
    },

    logout: function() {
      this.Authentication.removeToken();
      this.$state.go('user.login');
    }

  });
