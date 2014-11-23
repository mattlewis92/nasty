'use strict';

angular
  .module('<%= _.slugify(angularAppName) %>.core.services')
  .factory('config', function($timeout, $translate, API) {

    var config = {};

    API.get('app/info').success(function(result) {
      for (var key in result) {
        config[key] = result[key];
      }
      $translate.fallbackLanguage(config.i18n.default);
    });

    return config;

  });
