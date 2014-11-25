'use strict';

angular
  .module('<%= _.slugify(angularAppName) %>.core.directives')
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
