'use strict';

var jwt = require('jsonwebtoken');
var bluebird = require('bluebird');
bluebird.promisifyAll(jwt);

module.exports = function(services) {

  return function(req, res, next) {

    var jwtKey = services.get('config').get('jwtKey');
    var accessToken = req.headers['access-token'];
    var errors = services.get('errors');

    jwt
      .verifyAsync(accessToken, jwtKey + req.headers['finger-print'])
      .then(function(decoded) {
        req.user = decoded.user;
        next();
      })
      .catch(function(err) {
        next(new errors.user('Your session token has expired. You will need to login again.'));
      });

  };

};