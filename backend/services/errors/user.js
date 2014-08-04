'use strict';

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

  var statusCode = arguments[i],
      dontTranslate = arguments[i+1];

  Error.call(this);
  this.message = message;
  this.statusCode = statusCode || 500;
  this.dontTranslate = !!dontTranslate;
  this.translationParams = params;
  this.stack = (new Error()).stack;
  this.displayToUser = true;
};