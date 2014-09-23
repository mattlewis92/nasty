'use strict';

var dependable = require('dependable'),
    di = dependable.container(),
    originalRegisterFunction = di.register;

module.exports = function(app) {

  di.register = function(key, value) {

    app.factory(key, function(req, res, next) {
      next(null, di.get(key));
    });

    originalRegisterFunction(key, value);

  };

  app.set('services', di);

  return di;

};
