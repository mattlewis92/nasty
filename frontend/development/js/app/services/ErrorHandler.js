'use strict';

angular
  .module('mean.app.services')
  .factory('ErrorHandler', function(Flash) {

    var service = {};

    service.http = function(error) {
      Flash.error(error.data.message, 'http');
    };

    service.generic = function(error) {
      if (error.__isHttp) {
        service.http(error);
      } else {
        console.log('ERROR', error); //TODO log this server side
      }
    };

    return service;

  });
