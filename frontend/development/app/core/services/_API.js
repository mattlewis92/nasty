'use strict';

angular
  .module('<%= _.slugify(angularAppName) %>.core.services')
  .factory('API', function(HTTPFactory) {

    return new HTTPFactory();

  });
