'use strict';

angular
  .module('mean.app.services')
  .factory('HTTP', function(DS, DSHttpAdapter) {

    var HTTP = DSHttpAdapter.HTTP;

    DSHttpAdapter.createInstance = function(HTTPConfig) {

      HTTPConfig = HTTPConfig || {};

      var instance = DSHttpAdapter;

      instance.HTTP = function(config) {
        config.url = DS.defaults.baseURL + config.url;
        return HTTP.call(instance, angular.extend(config, HTTPConfig));
      };

      return instance;

    };

    return DSHttpAdapter.createInstance();

  });
