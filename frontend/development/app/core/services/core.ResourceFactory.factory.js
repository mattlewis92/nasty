'use strict';

angular
  .module('<%= _.slugify(angularAppName) %>.core.services')
  .factory('ResourceFactory', function(DS, DSHttpAdapter, promiseTracker, HTTPFactory) {

    return function(resourceConfig) {

      var model;

      resourceConfig.meta = resourceConfig.meta || {};
      resourceConfig.meta.loadingTracker = promiseTracker();

      var resourceHTTPAdapter = new HTTPFactory({
        resource: resourceConfig.name,
        tracker: resourceConfig.meta.loadingTracker
      });

      DS.adapters[resourceConfig.name] = resourceHTTPAdapter;

      resourceConfig.defaultAdapter = resourceConfig.name;
      resourceConfig.methods = resourceConfig.methods || {};

      var extraMethods = {
        save: function(options) {
          return model.save(this._id, options);
        },
        update: function(attrs, options) {
          return model.update(this._id, attrs, options);
        },
        destroy: function(options) {
          return model.destroy(this._id, options);
        },
        refresh: function(options) {
          return model.refresh(this._id, options);
        }
      };

      angular.forEach(extraMethods, function(value, key) {
        if (!resourceConfig.methods[key]) {
          resourceConfig.methods[key] = value;
        }
      });

      model = DS.defineResource(resourceConfig);

      model.doGET = function(method, config) {
        config = config || {};
        if (!config.tracker) {
          config.tracker = resourceConfig.meta.tracker;
        }
        return resourceHTTPAdapter.GET(resourceConfig.name + '/' + method, config);
      };

      model.doPOST = function(method, data, config) {
        return resourceHTTPAdapter.POST(resourceConfig.name + '/' + method, data, config);
      };

      model.doPUT = function(method, data, config) {
        return resourceHTTPAdapter.PUT(resourceConfig.name + '/' + method, data, config);
      };

      model.doDELETE = function(method, data, config) {
        return resourceHTTPAdapter.DEL(resourceConfig.name + '/' + method, data, config);
      };

      return model;

    };

  });
