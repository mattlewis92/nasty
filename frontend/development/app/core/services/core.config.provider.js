'use strict';

angular
  .module('nasty.core.services')
  .provider('config', function() {

    var config = {};

    var self = this;
    angular.forEach(config, function(value, key) {
      self[key] = value;
    });

    this.$get = function() {
      return config;
    };

  });
