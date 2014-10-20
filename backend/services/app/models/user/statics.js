'use strict';

var jwt = require('jsonwebtoken');

module.exports = function(schema, services) {

  schema.statics.findFromToken = function(accessToken, fingerPrint) {

    var jwtKey = services.get('config').get('jwtKey'),
        userError = services.get('errors').user,
        self = this;

    return jwt
      .verifyAsync(accessToken, jwtKey, { audience: fingerPrint })
      .then(function(decoded) {
        return [decoded, self.findByIdAsync(decoded.user._id, {token_salt: true})];
      })
      .spread(function(decoded, dbUser) {
        if (dbUser.token_salt !== decoded.token_salt) {
          throw new Error('Token salt has expired!');
        }
        return decoded.user;
      })
      .catch(function() {
        throw new userError('Your session token has expired. You will need to login again.', 401);
      });

  };

};
