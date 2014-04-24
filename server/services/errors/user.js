module.exports = function(message, statusCode) {
  Error.call(this);
  this.message = message;
  this.statusCode = statusCode || 500;
}