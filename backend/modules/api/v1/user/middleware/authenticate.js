'use strict';

var jwt = require('jsonwebtoken');

module.exports = function(services) {

  return function(req, res, next) {

    var jwtKey = services.get('config').get('jwtKey');
    var accessToken = req.headers['x-access-token'];
    var errors = services.get('errors');

    jwt
      .verifyAsync(accessToken, jwtKey + req.headers['x-finger-print'])
      .then(function(decoded) {
        req.user = decoded.user;
        next(null, decoded.user);
      })
      .catch(function() {
        next(new errors.user('Your session token has expired. You will need to login again.'));
      });

  };

};