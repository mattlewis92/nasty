'use strict';

module.exports = function(errors, statusCode) {

  var message = {message: 'There were errors with your request', errors: errors};

  Error.call(this);
  this.message = message;
  this.statusCode = statusCode || 500;
  this.stack = (new Error()).stack;
  this.displayToUser = true;

};