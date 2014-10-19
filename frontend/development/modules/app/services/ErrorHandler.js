'use strict';

angular
  .module('mean.app.services')
  .factory('ErrorHandler', function($log, Flash) {

    var service = {};

    service.http = function(error) {
      Flash.error(error.data.message, 'http', true);
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
