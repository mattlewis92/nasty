'use strict';

var bcrypt = require('bcrypt');

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

};
