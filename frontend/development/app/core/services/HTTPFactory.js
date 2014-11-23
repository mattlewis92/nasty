'use strict';

angular
  .module('<%= _.slugify(angularAppName) %>.core.services')
  .factory('HTTPFactory', function($q, $timeout, DS, DSHttpAdapter, DSCacheFactory) {

    return function(HTTPConfig) {

      HTTPConfig = HTTPConfig || {};

      var instance = {}, cacheBuffer = {};

      instance.HTTP = function(config) {

        var deferred = $q.defer(),
            httpCallbacks = {},
            requestCache = null,
            cacheKey = null;

        config.url = DS.defaults.baseURL + config.url;

        var requestConfig = angular.extend(config, HTTPConfig);

        //Handle caching options
        if (requestConfig.method === 'GET' && requestConfig.cache) {

          //Create the cache if it doesnt exist
          requestCache = DSCacheFactory.get(requestConfig.cache);
          if (!requestCache) {
            requestCache = new DSCacheFactory(requestConfig.cache);
          }

          //The cache key is the URL (as this is a GET request)
          cacheKey = config.url;

        }

        delete requestConfig.cache;

        //First lookup to see if the object exists in the cache
        if (requestCache && requestCache.get(cacheKey)) {

          //Resolve the promise on the next digest as it can cause lag issues in the UI
          $timeout(function() {
            deferred.resolve(requestCache.get(cacheKey));
          });

        } else if (cacheKey && cacheBuffer[cacheKey]) {

          //If we want to cache the request and another request has already
          //been instantiated but not yet resolved, then add this request to a buffer
          //that will be resolved when the original request completed
          cacheBuffer[cacheKey].push({
            deferred: deferred,
            httpCallbacks: httpCallbacks
          });

        } else {

          //Start the request buffer if this is the first request
          if (cacheKey && !cacheBuffer[cacheKey])  {
            cacheBuffer[cacheKey] = [];
          }

          DSHttpAdapter.HTTP(requestConfig).then(function(result) {

            //Store in the cache if cache option is set
            if (requestCache) {
              requestCache.put(cacheKey, result);
            }

            //Resolve the original request promise
            deferred.resolve(result);

            if (httpCallbacks.success) {
              httpCallbacks.success.call(null, result.data, result.status, result.headers, result.config);
            }

            //Resolve all subsequent requests for this data that happened in the mean time
            if (cacheBuffer[cacheKey]) {
              cacheBuffer[cacheKey].forEach(function(bufferItem) {

                bufferItem.deferred.resolve(angular.copy(result));

                if (bufferItem.httpCallbacks.success) {
                  bufferItem.httpCallbacks.success.call(null, result.data, result.status, result.headers, result.config);
                }

              });
              delete cacheBuffer[cacheKey];
            }

          }).catch(function(result) {

            //Reject the original request promise
            deferred.reject(result);

            if (httpCallbacks.error) {
              httpCallbacks.error.call(null, result.data, result.status, result.headers, result.config);
            }

            //Reject all requests in the buffer
            if (cacheBuffer[cacheKey]) {
              cacheBuffer[cacheKey].forEach(function(bufferItem) {

                bufferItem.deferred.reject(angular.copy(result));

                if (bufferItem.httpCallbacks.error) {
                  bufferItem.httpCallbacks.error.call(null, result.data, result.status, result.headers, result.config);
                }

              });
              delete cacheBuffer[cacheKey];
            }

          });

        }

        //Add these 2 methods to mimic the behaviour of $http
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

      //Add all methods from the original DSHttpAdapter
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
