'use strict';

angular
  .module('nasty.core.services')
  .factory('API', function($q, DS, DSHttpAdapter) {

    var HTTP = DSHttpAdapter.HTTP;

    DSHttpAdapter.createInstance = function(HTTPConfig) {

      HTTPConfig = HTTPConfig || {};

      var instance = DSHttpAdapter;

      instance.HTTP = function(config) {
        var deferred = $q.defer(), httpCallbacks = {};

        config.url = DS.defaults.baseURL + config.url;

        HTTP.call(instance, angular.extend(config, HTTPConfig)).then(function(result) {

          deferred.resolve(result);

          if (httpCallbacks.success) {
            httpCallbacks.success.call(null, result.data, result.status, result.headers, result.config);
          }

        }).catch(function(result) {

          deferred.reject(result);

          if (httpCallbacks.error) {
            httpCallbacks.error.call(null, result.data, result.status, result.headers, result.config);
          }

        });

        deferred.promise.success = function(callback) {
          httpCallbacks.success = callback;
        };

        deferred.promise.error = function(callback) {
          httpCallbacks.error = callback;
        };

        return deferred.promise;
      };

      //Add lower case methods as well
      instance.http = instance.HTTP;
      instance.get = instance.GET;
      instance.del = instance.DEL;
      instance.post = instance.POST;
      instance.put = instance.PUT;

      return instance;

    };

    return DSHttpAdapter.createInstance();

  });
