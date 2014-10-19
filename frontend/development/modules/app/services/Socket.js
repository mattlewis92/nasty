'use strict';

angular
  .module('nasty.app.services')
  .factory('Socket', function(socketFactory) {
    return socketFactory();
  });
