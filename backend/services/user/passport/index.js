'use strict';

var requireAll = require('require-all'),
    passport = require('passport');

module.exports = function(app) {

  var strategies = requireAll(__dirname + '/strategies');

  return function() {

    for (var key in strategies) {
      strategies[key](passport, app.get('services'));
    }

    return passport;
  };

};
