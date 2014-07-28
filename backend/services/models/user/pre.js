'use strict';

var bcrypt = require('bcrypt')
  , SALT_WORK_FACTOR = 10
  , bluebird = require('bluebird');

bluebird.promisifyAll(bcrypt);

module.exports = function(mongoose, schema) {

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
      .catch(function(err) {
        next(err);
      });
  });

};