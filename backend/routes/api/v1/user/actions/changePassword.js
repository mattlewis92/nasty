'use strict';

/**
 * @api {put} /user/password Changes the authenticated users password
 * @apiName ChangePassword
 * @apiGroup User
 *
 * @apiHeaderStructure AuthenticationHeader
 *
 * @apiParam {String} password The new password
 *
 * @apiSuccess {Boolean} success Set to true if the password was successfully saved
 * @apiSuccessExample Example response:
 * {
 *    "success": true
 * }
 *
 * @apiErrorStructure ValidationError
 *
 */
module.exports = function(req, res, next, userAuthenticate, models, errors) {

  req.checkBody('password', 'Required').notEmpty();
  req.checkBody('password', '8 to 20 characters required').len(8, 20);

  if (req.validationErrors()) {
    return next(new errors.validation(req.validationErrors(true)));
  }

  models
    .user
    .findByIdAsync(userAuthenticate._id)
    .then(function(user) {

      user.password = req.body.password;
      return user.saveAsync();

    })
    .spread(function() {
      res.json({success: true});
    })
    .catch(next);

};
