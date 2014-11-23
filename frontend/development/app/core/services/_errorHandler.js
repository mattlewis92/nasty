'use strict';

angular
  .module('<%= _.slugify(angularAppName) %>.core.services')
  .factory('errorHandler', function($log, flash) {

    var service = {};

    service.http = function(error) {
      flash.error(error.data.message, 'http', true);
    };

    service.generic = function(error) {
      if (error.__isHttp) {
        service.http(error);
      } else {
        $log.error(error); //TODO log this server side
      }
    };

    return service;

  });
