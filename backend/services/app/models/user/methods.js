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

  schema.methods.addSocialNetworkAccount = function(profile, authentication) {

    delete profile._raw; //We don't need this clogging up the database

    var existingAccounts = this.social_network_accounts.filter(function(sna) {
      return sna.provider === profile.provider && sna.account_id === profile.id;
    });

    var profileUrl;
    switch(profile.provider) {
      case 'twitter':
        profileUrl = 'https://twitter.com/' + profile.username;
        break;
    }

    if (existingAccounts.length > 0) {
      var existingAccount = existingAccounts[0];
      existingAccount.account_name = profile.username;
      existingAccount.profile_url = profileUrl;
      existingAccount.status = !!authentication ? 'authenticated' : 'unauthenticated';
      existingAccount.authentication = authentication;
      existingAccount.profile = profile;
    } else {
      this.social_network_accounts.push({
        provider: profile.provider,
        account_id: profile.id,
        account_name: profile.username,
        profile_url: profileUrl,
        status: !!authentication ? 'authenticated' : 'unauthenticated',
        authentication: authentication,
        profile: profile
      });
    }

    this.hydrateProfileFromSocialNetworkProfile(profile);

  };

  schema.methods.hydrateProfileFromSocialNetworkProfile = function(profile) {

  };

};
