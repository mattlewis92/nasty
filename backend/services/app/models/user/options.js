'use strict';

module.exports = function(schema) {

  schema.options.toJSON.transform = function(doc, ret) {
    delete ret.password;
    delete ret.token_salt;
  };

};
