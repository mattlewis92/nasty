'use strict';

var mongooseTimestamp = require('mongoose-timestamp')
  , bcrypt = require('bcrypt')
  , SALT_WORK_FACTOR = 10
  , bluebird = require('bluebird');

bluebird.promisifyAll(bcrypt);

module.exports = function(mongoose) {

  var schema = new mongoose.Schema({
    name: {type: String, required: true},
    email: {type: mongoose.SchemaTypes.Email, required: true, unique: true},
    password: {type: String, required: true, select: false}
  });

  schema.plugin(mongooseTimestamp, {
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  });

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

  schema.methods.comparePassword = function(candidatePassword) {
    if (!this.password) {
      throw new Error('You must select the password field in your query.');
    }
    return bcrypt.compareAsync(candidatePassword, this.password);
  };

  var user = mongoose.model('user', schema);

  return user;

};