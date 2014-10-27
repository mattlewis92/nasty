'use strict';

angular
  .module('nasty.app.services')
  .factory('Config', function($timeout, $translate, HTTP) {

    var config = {};

    HTTP.GET('app/info').then(function(result) {
      for (var key in result.data) {
        config[key] = result.data[key];
      }
      $translate.fallbackLanguage(config.i18n.default);
    });

    return config;

  });
