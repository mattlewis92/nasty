'use strict';

var requireAll = require('require-all');

module.exports = function(app) {

  app.loadServices = function(servicesPath, rootPath) {

    var modules = requireAll(servicesPath);

    this.get('services').register('rootPath', rootPath);

    for (var module in modules) {
      for (var service in modules[module]) {

        if ('object' === typeof modules[module][service] && modules[module][service].index) {
          modules[module][service] = modules[module][service].index;
        }

        this.get('services').register(service, new modules[module][service](this));
      }
    }

    this.get('services').get('config'); //always make sure config is initialised

    return this.get('services');

  };

};
