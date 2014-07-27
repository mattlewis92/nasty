'use strict';

var requireAll = require('require-all');
var passport = require('passport');

module.exports = function() {

  var strategies = requireAll(__dirname + '/strategies');

  return function(models) {

    for (var key in strategies) {
      strategies[key](passport, models);
    }

    return passport;
  };

};