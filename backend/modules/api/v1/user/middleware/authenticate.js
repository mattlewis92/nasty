'use strict';

/**
 * @apiDefineHeaderStructure AuthenticationHeader
 * @apiHeader {String} x-access-token The JWT issued when the user authenticated with their username and password.
 * @apiHeader {String} x-finger-print The users browser fingerprint. Can be any value.
 */
module.exports = function(services) {

  return function(req, res, next) {

    services
      .get('models')
      .user
      .findFromToken(req.headers['x-access-token'], req.headers['x-finger-print'])
      .then(function(user) {

        req.user = user;
        next(null, user);

      }).catch(next);

  };

};
