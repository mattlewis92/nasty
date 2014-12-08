'use strict';

angular
  .module('<%= _.slugify(angularAppName) %>.core.services')
  .factory('errorHandler', function($log, growl) {

    var service = {};

    service.http = function(error) {
      growl.error(error.data.message, {referenceId: 'http', translateMessage: false});
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
