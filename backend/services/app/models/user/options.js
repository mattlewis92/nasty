'use strict';

module.exports = function(schema) {

  schema.options.toObject.transform = function(doc, ret, options) {
    delete ret.password;
    delete ret.token_salt;
  };

};
