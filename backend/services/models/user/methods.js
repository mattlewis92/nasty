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

  schema.methods.sendEmail = function(options) {

    if (!this.email) {
      throw new Error('You must select the email field in your query!');
    }

    options.to = this.email;
    return services.get('mailer').sendMail(options);

  };

};
