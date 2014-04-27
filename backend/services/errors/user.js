'use strict';

module.exports = function(message, statusCode) {
  Error.call(this);
  this.message = message;
  this.statusCode = statusCode || 500;
  this.stack = (new Error()).stack;
};