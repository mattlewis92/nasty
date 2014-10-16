'use strict';

module.exports = function(errors, statusCode) {

  Error.call(this);
  this.message = 'There were errors with your request';
  this.details = errors;
  this.statusCode = statusCode || 412;
  this.stack = (new Error()).stack;
  this.displayToUser = true;

};
