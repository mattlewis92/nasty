'use strict';

/**
 * @apiDefineErrorStructure UserError
 * @apiError (4xx - User Error) {String} message The error message to display to the user.
 * @apiErrorExample User error example:
 * {
 *    "message": "This is an example error message!"
 * }
 */

//Arguments format is: message, ...translation params..., statusCode, dontTranslate
module.exports = function() {

  var message = arguments[0],
      params = [],
      totalParams = message.match(/\%s/g);

  if (totalParams) {
    totalParams = totalParams.length;
  }

  for (var i = 1; i <= totalParams; i++) {
    params.push(arguments[i]);
  }

  var statusCode = arguments[i];
  i++;
  var dontTranslate = arguments[i];

  Error.call(this);
  this.message = message;
  this.statusCode = statusCode || 400;
  this.dontTranslate = !!dontTranslate;
  this.translationParams = params;
  this.stack = (new Error()).stack;
  this.displayToUser = true;
};
