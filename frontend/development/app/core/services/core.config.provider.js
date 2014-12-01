'use strict';

angular
  .module('nasty.core.services')
  .provider('config', function() {

    var config = {
      redirectStates: {
        logout: 'user.login', //where to redirect on logout
        login: 'user.home' //where to redirect on login
      }
    };

    var self = this;
    angular.forEach(config, function(value, key) {
      self[key] = value;
    });

    this.$get = function() {
      return config;
    };

  });
