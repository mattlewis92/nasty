'use strict';

/**
 * @api {put} /password/reset/:userId/:token Resets a given users password given the reset token
 * @apiName ResetPassword
 * @apiGroup User
 *
 * @apiParam {String} password The users new password
 *
 * @apiSuccess {Boolean} success Set to true if the request succeeded.
 * @apiErrorStructure UserError
 * @apiErrorStructure ValidationError
 *
 */
module.exports = function(req, res, next, models, errors) {

  req.checkBody('password', 'Required').notEmpty();
  req.checkBody('password', '8 to 20 characters required').len(8, 20);

  if (req.validationErrors()) {
    return next(new errors.validation(req.validationErrors(true)));
  }

  models.user.findOneAsync({
    _id: req.params.userId,
    'password_reset.token': req.params.token,
    'password_reset.expires_at': {
      $gt: new Date()
    },
    'password_reset.ip_address': req.ip
  }, {
    password: true
  }).then(function(user) {

    if (!user) {
      next(new errors.user('The reset link you clicked is invalid. Please request a new reset token.'));
    } else {
      user.password = req.body.password;
      user.password_reset.token = null;
      user.password_reset.expires_at = null;
      user.password_reset.ip_address = null;
      return user.saveAsync().then(function() {
        res.json({success: true});
      });
    }

  }).catch(next);

};
