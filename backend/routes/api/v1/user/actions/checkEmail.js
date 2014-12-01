'use strict';

/**
 * @api {get} /user/email_check Changes to see if an email address has already been registered
 * @apiName CheckEmail
 * @apiGroup User
 *
 * @apiParam {Email} email The email to check
 *
 * @apiSuccess {Boolean} exists Whether an account with this email address already exists
 * @apiSuccessExample Example response:
 * {
 *    "exists": false
 * }
 *
 * @apiErrorStructure ValidationError
 *
 */
module.exports = function(req, res, models, errors, next) {

  req.checkQuery('email', 'Required').notEmpty();
  req.checkQuery('email', 'Valid email required').isEmail();

  if (req.validationErrors()) {
    return next(new errors.validation(req.validationErrors(true)));
  }

  var query = {email: req.query.email};
  if (req.query.current_user_id) {
    query._id = {
      $ne: req.query.current_user_id
    };
  }

  models.user.countAsync(query).then(function(count) {

    if (count === 0) {
      res.json({exists: false});
    } else {
      res.status(412).json({exists: true});
    }

  }).catch(next);

};
