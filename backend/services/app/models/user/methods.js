'use strict';

var bcrypt = require('bcrypt'),
    jwt = require('jsonwebtoken');

module.exports = function(schema, services) {

  schema.methods.comparePassword = function(candidatePassword) {

    if (!this.password) {
      throw new Error('You must select the password field in your query.');
    }

    return bcrypt.compareAsync(candidatePassword, this.password);

  };

  schema.methods.sendNotification = function(event, data) {

    services.get('notifications').emitToUser(this.id, event, data);

  };

  schema.methods.isOnlineNow = function() {

    return services.get('notifications').isUserOnline(this.id);

  };

  schema.methods.sendEmail = function(options, sendQueued, sendAt) {

    if (!this.email) {
      throw new Error('You must select the email field in your query!');
    }

    options.to = this.email;

    if (sendQueued) {
      return services.get('mailer').queueMail(options, sendAt);
    } else {
      return services.get('mailer').sendMail(options);
    }

  };

  schema.methods.createAccessToken = function(browserFingerPrint) {

    if (!this.token_salt) {
      throw new Error('Token salt must be selected!');
    }

    var token = jwt.sign(
      { user: {_id: this._id }, token_salt: this.token_salt },
      services.get('config').get('jwtKey'),
      {
        expiresInMinutes: services.get('config').get('app:tokenExpiryTime') / (1000 * 60),
        audience: browserFingerPrint
      }
    );

    return token;

  };

};
