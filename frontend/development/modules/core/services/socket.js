'use strict';

angular
  .module('nasty.core.services')
  .factory('socket', function(socketFactory) {
    return socketFactory();
  });
