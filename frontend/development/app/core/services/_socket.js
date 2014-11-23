'use strict';

angular
  .module('<%= _.slugify(angularAppName) %>.core.services')
  .factory('socket', function(socketFactory) {
    return socketFactory();
  });
