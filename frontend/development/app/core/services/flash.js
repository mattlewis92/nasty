'use strict';

angular
  .module('<%= _.slugify(angularAppName) %>.core.services')
  .factory('flash', function($rootScope, $translate) {

    var service = {};

    service.messages = {};

    var addError = function(type, message, id, dontAutoTranslate) {
      if (dontAutoTranslate) {
        service.messages[id] = {
          type: type,
          value: message
        };
      } else {
        $translate(message).then(function(translatedValue) {
          addError(type, translatedValue, id, true);
        });
      }
    };

    service.error = function(message, id, dontAutoTranslate) {
      addError('danger', message, id, dontAutoTranslate);
    };

    service.confirm = function(message, id, dontAutoTranslate) {
      addError('success', message, id, dontAutoTranslate);
    };

    service.warning = function(message, id, dontAutoTranslate) {
      addError('warning', message, id, dontAutoTranslate);
    };

    service.info = function(message, id, dontAutoTranslate) {
      addError('info', message, id, dontAutoTranslate);
    };

    service.clearMessage = function(id) {
      delete service.messages[id];
    };

    $rootScope.$on('$stateChangeSuccess', function() {
      service.messages = {};
    });

    return service;

  });
