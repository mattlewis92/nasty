'use strict';

angular
  .module('mean.app.services')
  .factory('Socket', function(socketFactory) {
    return socketFactory();
  });
