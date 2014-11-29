'use strict';

angular
  .module('nasty.core.services')
  .factory('config', function($translate, API) {

    var config = {};

    API.get('app/info').success(function(result) {
      for (var key in result) {
        config[key] = result[key];
      }
      $translate.fallbackLanguage(config.i18n.default);
    });

    return config;

  });
