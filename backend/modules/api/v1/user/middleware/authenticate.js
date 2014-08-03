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
        req.user = decoded.user;
        next(null, decoded.user);
      })
      .catch(function() {
        next(new errors.user(req.i18n.__('Your session token has expired. You will need to login again.')));
      });

  };

};