var util = require('util');

function childError(message, statusCode) {
  Error.call(this);
  this.message = message;
  this.statusCode = statusCode;
}

util.inherits(childError, Error);

module.exports = childError;