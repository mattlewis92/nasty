'use strict';

var bcrypt = require('bcrypt'),
    uuid = require('node-uuid'),
    SALT_WORK_FACTOR = 10;

module.exports = function(schema) {

  schema.pre('save', function(next) {
    var user = this;

    // only hash the password if it has been modified (or is new)
    if (!user.isModified('password')) {
      return next();
    }

    bcrypt
      .genSaltAsync(SALT_WORK_FACTOR)
      .then(function(salt) {
        return bcrypt.hashAsync(user.password, salt);
      })
      .then(function(hash) {
        user.password = hash;
        next();
      })
      .catch(next);
  });

  schema.pre('save', function(next) {

    if (this.isNew && !this.token_salt) {
      this.token_salt = uuid.v4();
    }
    next();

  });

};
