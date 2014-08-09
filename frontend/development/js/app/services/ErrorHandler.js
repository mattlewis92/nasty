'use strict';

angular
  .module('mean.app.services')
  .factory('ErrorHandler', function() {

    var service = {};

    service.errors = [];

    service.http = function(error) {

      var found = false;

      service.errors.forEach(function(err) {
        if (err.message === error.data.message) {
          found = true;
        }
      });

      if (!found) {
        service.errors.push(error.data);
      }

    };

    return service;

  });
