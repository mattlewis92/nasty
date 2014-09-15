'use strict';

angular
  .module('mean.app.services')
  .factory('ResourceFactory', function(DS, promiseTracker) {

    return {
      create: function(config) {

        var model;

        config.methods = config.methods || {};

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
          if (!config.methods[key]) {
            config.methods[key] = value;
          }
        });

        config.meta = config.meta || {};
        config.meta.loadingTracker = promiseTracker();

        model = DS.defineResource(config);

        return model;

      }
    };

  });
