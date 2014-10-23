'use strict';

module.exports = function(schema) {

  schema.options.toObject.transform = function(doc, ret) {
    delete ret.password;
    delete ret.token_salt;
  };

};
