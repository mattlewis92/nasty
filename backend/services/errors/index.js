'use strict';

var requireAll = require('require-all');
var util = require('util');

module.exports = function() {

  var errors = requireAll(__dirname);

  delete errors.index; //remove this file

  for (var error in errors) {
    util.inherits(errors[error], Error);
  }

  return errors;

};