'use strict';

angular
  .module('nasty.app.services')
  .factory('socket', function(socketFactory) {
    return socketFactory();
  });
