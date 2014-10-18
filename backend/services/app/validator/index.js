'use strict';

var expressValidator = require('express-validator');

module.exports = function() {

  expressValidator.validator.extend('isFinite', function(str) {
    return isFinite(str);
  });

  return expressValidator.validator;

};