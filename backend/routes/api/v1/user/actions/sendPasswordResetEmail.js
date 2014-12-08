'use strict';

var crypto = require('crypto');

/**
 * @api {post} /password/reset/request Requests a password reset email
 * @apiName ResetPasswordRequest
 * @apiGroup User
 *
 * @apiParam {Email} email The users email
 *
 * @apiSuccess {Boolean} success Set to true if the request succeeded.
 * @apiErrorStructure UserError
 * @apiErrorStructure ValidationError
 *
 */
module.exports = function(req, res, next, models, errors, config) {

  req.checkBody('email', 'Required').notEmpty();
  req.checkBody('email', 'Valid email required').isEmail();

  if (req.validationErrors()) {
    return next(new errors.validation(req.validationErrors(true)));
  }

  models.user.findOneAsync({email: req.body.email.toLowerCase().trim()}).then(function(user) {

    if (!user) {
      throw new errors.user('This user does not exist!');
    }

    return [user, crypto.randomBytesAsync(32)];

  }).spread(function(user, resetToken) {

    var expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 1);

    user.password_reset = {
      token: resetToken.toString('hex'),
      expires_at: expiresAt,
      ip_address: req.ip
    };

    return [user.password_reset.token, user.saveAsync().spread(function(user) {
      return user;
    })];

  }).spread(function(token, user) {

    var subject = 'Reset your password with ' + config.get('app:name');

    return user.sendEmail({
      subject: subject,
      template: {
        name: 'general',
        locals: {
          title: subject,
          content: 'To reset your password please click the link below.',
          button: {
            text: 'Reset',
            link:  req.protocol + '://' + req.get('host') + '/user/forgot/' + user._id + '/' + token
          }
        }
      }
    });

  }).then(function() {

    res.json({success: true});

  }).catch(next);

};
