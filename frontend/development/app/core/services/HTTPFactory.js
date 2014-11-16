'use strict';

angular
  .module('nasty.core.services')
  .factory('HTTPFactory', function($q, DS, DSHttpAdapter) {

    return function(HTTPConfig) {

      HTTPConfig = HTTPConfig || {};

      var instance = {};

      instance.HTTP = function(config) {

        var deferred = $q.defer(), httpCallbacks = {};

        config.url = DS.defaults.baseURL + config.url;

        DSHttpAdapter.HTTP(angular.extend(config, HTTPConfig)).then(function(result) {

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
          return deferred.promise;
        };

        deferred.promise.error = function(callback) {
          httpCallbacks.error = callback;
          return deferred.promise;
        };

        return deferred.promise;
      };

      [
        'DEL',
        'GET',
        'POST',
        'PUT',
        'create',
        'destroy',
        'destroyAll',
        'find',
        'findAll',
        'update',
        'updateAll'
      ]
      .forEach(function(method) {

          instance[method] = function() {
            return DSHttpAdapter[method].apply(instance, arguments);
          };

      });

      //Add lower case methods as well
      instance.http = instance.HTTP;
      instance.get = instance.GET;
      instance.del = instance.DEL;
      instance.post = instance.POST;
      instance.put = instance.PUT;

      return instance;

    };

  });
