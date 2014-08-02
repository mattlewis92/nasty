'use strict';

module.exports = function(mongoose) {

  return {
    name: {
      first: {type: String, required: true, trim: true},
      last: {type: String, required: true, trim: true}
    },
    email: {type: mongoose.SchemaTypes.Email, required: true, unique: true, lowercase: true, trim: true},
    password: {type: String, required: true, select: false}
  };

};