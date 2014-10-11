'use strict';

angular
  .module('mean.app.services')
  .factory('HTTP', function(DS, DSHttpAdapter) {

    var HTTP = DSHttpAdapter.HTTP,
        GET = DSHttpAdapter.GET,
        POST = DSHttpAdapter.POST,
        PUT = DSHttpAdapter.PUT,
        DEL = DSHttpAdapter.DEL;

    DSHttpAdapter.createInstance = function(HTTPConfig) {

      HTTPConfig = HTTPConfig || {};

      var instance = angular.copy(DSHttpAdapter);

      instance.HTTP = function(config) {
        config.url = DS.defaults.baseURL + config.url;
        return HTTP(angular.extend(config, HTTPConfig));
      };

      instance.GET = function(url, config) {
        config = config || {};
        return GET(DS.defaults.baseURL + url, angular.extend(config, HTTPConfig));
      };

      instance.POST = function(url, attrs, config) {
        config = config || {};
        return POST(DS.defaults.baseURL + url, attrs, angular.extend(config, HTTPConfig));
      };

      instance.PUT = function(url, attrs, config) {
        config = config || {};
        return PUT(DS.defaults.baseURL + url, attrs, angular.extend(config, HTTPConfig));
      };

      instance.DEL = function(url, attrs, config) {
        config = config || {};
        return DEL(DS.defaults.baseURL + url, attrs, angular.extend(config, HTTPConfig));
      };

      return instance;

    };

    return DSHttpAdapter.createInstance();

  });
