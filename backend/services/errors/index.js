'use strict';

var requireIndex = require('requireindex');
var util = require('util');

module.exports = function() {

  var errors = requireIndex(__dirname);

  delete errors.index; //remove this file

  for (var error in errors) {
    util.inherits(errors[error], Error);
  }

  return errors;

};