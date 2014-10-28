'use strict';

angular
  .module('nasty.app.services')
  .factory('config', function($timeout, $translate, API) {

    var config = {};

    API.GET('app/info').then(function(result) {
      for (var key in result.data) {
        config[key] = result.data[key];
      }
      $translate.fallbackLanguage(config.i18n.default);
    });

    return config;

  });
