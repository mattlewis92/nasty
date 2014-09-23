'use strict';

var requireAll = require('require-all');

module.exports = function(app) {

  app.loadServices = function(servicesPath, rootPath) {

    var services = requireAll(servicesPath);

    this.get('services').register('rootPath', rootPath);

    for (var name in services) {

      if ('object' === typeof services[name] && services[name].index) {
        services[name] = services[name].index;
      }

      this.get('services').register(name, new services[name](this));
    }

    this.get('services').get('config'); //always make sure config is initialised

    return this.get('services');

  };

};
