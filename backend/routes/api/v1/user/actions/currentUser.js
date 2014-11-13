'use strict';

/**
 * @api {get} /user/current Gets the current users profile
 * @apiName CurrentUser
 * @apiGroup User
 *
 * @apiHeaderStructure AuthenticationHeader
 *
 * @apiSuccess {Object} user An object containing the current users profile
 *
 */
module.exports = function(res, next, userAuthenticate, models) {

  models
    .user
    .findByIdAsync(userAuthenticate._id)
    .then(function(user) {
      res.json(user.toObject());
    })
    .catch(next);

};
