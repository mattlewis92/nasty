'use strict';

var bcrypt = require('bcrypt'),
    uuid = require('node-uuid'),
    SALT_WORK_FACTOR = 10;

module.exports = function(schema, services) {

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

  schema.pre('save', function(next) {

    var self = this;

    if (!this.isModified('avatar.file') && !this.isModified('avatar.url')) {
      return next();
    }

    if (this.isModified('avatar.file')) {

      if (!this.avatar.file) {
        this.avatar = {};
        return next();
      }

      services.get('models').file.findByIdAsync(this.avatar.file).then(function(file) {

        if (!file) {
          next(new Error('The file with id ' + self.avatar.file + ' does not exist'));
        } else if (!file.isOfType('image')) {
          next(new Error('The file with id ' + self.avatar.file + ' is not an image'));
        } else {
          self.avatar.url = file.url;
          self.avatar.source = 'local';
          next();
        }

      }).catch(next);

    }

    if (this.isModified('avatar.url')) {

      if (!this.avatar.url) {
        this.avatar = {};
        return next();
      }

      services.get('fileHandler').saveFileFromUrl(this.avatar.url, this).spread(function(file) {

        self.avatar.url = file.url;
        self.avatar.file = file._id;
        next();

      }).catch(next);

    }

  });

};
