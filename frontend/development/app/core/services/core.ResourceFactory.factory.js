'use strict';

angular
  .module('<%= _.slugify(angularAppName) %>.core.services')
  .factory('ResourceFactory', function($rootScope, $state, DS, DSHttpAdapter, promiseTracker, prompt, HTTPFactory) {

    return function(resourceConfig, paginationLimit) {

      paginationLimit = paginationLimit || 20;

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
          if (this._id) {
            return model.save(this._id, options);
          } else {
            return model.create(this, options);
          }
        },
        update: function(attrs, options) {
          return model.update(this._id, attrs, options);
        },
        destroy: function(options) {
          return model.destroy(this._id, options);
        },
        refresh: function(options) {
          return model.refresh(this._id, options);
        },
        hasChanges: function() {
          return model.hasChanges(this._id);
        },
        revertChanges: function() {
          var self = this;
          angular.forEach(model.previous(this._id), function(value, key) {
            self[key] = value;
          });
        },
        watchForUnsavedChanges: function() {
          var self = this;

          function cancelListeners() {
            deregisterStart();
            deregisterEnd();
          }

          var deregisterStart = $rootScope.$on('$stateChangeStart', function(event, toState, toParams) {

            if (self.hasChanges()) {
              event.preventDefault();
              prompt({
                title: 'You have unsaved changes!',
                message: 'Are you sure you want to navigate away from the page?'
              }).then(function() {
                self.revertChanges();
                cancelListeners();
                $state.go(toState, toParams);
              });
            } else {
              cancelListeners();
            }

          });

          var deregisterEnd = $rootScope.$on('$stateChangeSuccess', cancelListeners);
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

      model.loadPage = function(page, options) {
        options = options || {};
        options.limit = paginationLimit;
        options.skip = paginationLimit * (page - 1);
        return model.findAll(options);
      };

      model.findOne = function(params, options) {
        return model.findAll(params, options).then(function(results) {

          if (angular.isArray(results)) {
            return results[0];
          } else {
            return results; //if the server returned a single object then return that
          }

        });
      };

      return model;

    };

  });
