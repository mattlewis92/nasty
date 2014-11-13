'use strict';

/**
 * @apiDefineHeaderStructure AuthenticationHeader
 * @apiHeader {String} Authorization The JWT issued when the user authenticated with their username and password.
 * @apiHeader {String} Client-Identifier A unique identifier for a client.
 */
module.exports = function(services) {

  return function(req, res, next) {

    services
      .get('models')
      .user
      .findFromToken(req.headers.authorization, req.headers['client-identifier'])
      .then(function(user) {

        req.user = user;
        next(null, user);

      }).catch(next);

  };

};
