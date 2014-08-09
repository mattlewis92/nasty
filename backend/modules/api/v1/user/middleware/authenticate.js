'use strict';

var jwt = require('jsonwebtoken');

module.exports = function(services) {

  return function(req, res, next) {

    var jwtKey = services.get('config').get('jwtKey'),
        accessToken = req.headers['x-access-token'],
        errors = services.get('errors');

    jwt
      .verifyAsync(accessToken, jwtKey, { audience: req.headers['x-finger-print'] })
      .then(function(decoded) {
        return [decoded, services.get('models').user.findByIdAsync(decoded.user._id, {token_salt: true})];
      })
      .spread(function(decoded, dbUser) {
        if (dbUser.token_salt !== decoded.token_salt) {
          throw new Error('Token salt has expired!');
        }
        req.user = decoded.user;
        next(null, decoded.user);
      })
      .catch(function() {
        next(new errors.user('Your session token has expired. You will need to login again.', 401));
      });

  };

};
