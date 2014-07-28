'use strict';

module.exports = function(mongoose) {

  return {
    name: {type: String, required: true},
    email: {type: mongoose.SchemaTypes.Email, required: true, unique: true},
    password: {type: String, required: true, select: false}
  };

};