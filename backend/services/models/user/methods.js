'use strict';

var bcrypt = require('bcrypt');

module.exports = function(mongoose, schema) {

  schema.methods.comparePassword = function(candidatePassword) {
    if (!this.password) {
      throw new Error('You must select the password field in your query.');
    }
    return bcrypt.compareAsync(candidatePassword, this.password);
  };

};