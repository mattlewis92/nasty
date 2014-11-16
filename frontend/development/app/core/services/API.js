'use strict';

angular
  .module('nasty.core.services')
  .factory('API', function(HTTPFactory) {

    return new HTTPFactory();

  });
