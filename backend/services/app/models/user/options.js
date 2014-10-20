'use strict';

module.exports = function(schema) {

  schema.options.toObject.transform = function(doc, ret, options) {
    //As this is called when saving the object to the database, make sure to not delete the password then.
    if (options._useSchemaOptions) {
      delete ret.password;
      delete ret.token_salt;
    }
  };

};
