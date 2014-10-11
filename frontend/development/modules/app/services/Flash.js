'use strict';

angular
  .module('mean.app.services')
  .factory('Flash', function($rootScope) {

    var service = {};

    service.messages = {};

    var addError = function(type, message, id) {
      service.messages[id] = {
        type: type,
        value: message
      };
    };

    service.error = function(message, id) {
      addError('danger', message, id);
    };

    service.confirm = function(message, id) {
      addError('success', message, id);
    };

    service.warning = function(message, id) {
      addError('warning', message, id);
    };

    service.info = function(message, id) {
      addError('info', message, id);
    };

    service.clearMessage = function(id) {
      delete service.messages[id];
    };

    $rootScope.$on('$stateChangeSuccess', function() {
      service.messages = {};
    });

    return service;

  });
