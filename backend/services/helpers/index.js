'use strict';

var helpers = require('require-all')(__dirname);

delete helpers.index; //remove this file

module.exports = function() {

  return function() {
    return helpers;
  };

};
