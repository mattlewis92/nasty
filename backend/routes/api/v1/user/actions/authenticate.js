'use strict';

/**
 * @api {post} /user/authenticate Authenticate a user and return a JSON web token used later for authentication.
 * @apiName AuthenticateUser
 * @apiGroup User
 *
 * @apiHeader {String} Client-Identifier The users browser fingerprint. Can be any value.
 *
 * @apiParam {Email} email The users email
 * @apiParam {String} password The users password
 *
 * @apiSuccess {String} token The JSON web token to use
 * @apiSuccess {Object} user  An object containing the authenticated users id
 * @apiSuccessExample Example response:
 * {
 *    "token": "12345678",
 *    "user": {
 *        "_id": "frjkgektgjrtj"
 *    }
 * }
 *
 * @apiErrorStructure UserError
 * @apiErrorStructure ValidationError
 *
 */
module.exports = function(req, res, next, errors, passport) {

  req.checkBody('email', 'Required').notEmpty();
  req.checkBody('email', 'Valid email required').isEmail();
  req.checkBody('password', 'Required').notEmpty();
  req.checkHeader('client-identifier', 'Required').notEmpty();

  if (req.validationErrors()) {
    return next(new errors.validation(req.validationErrors(true)));
  }

  passport.authenticate('local', { session: false }, function(err, user) {

    if (err) {
      return next(err);
    }

    var token = user.createAccessToken(req.headers['client-identifier']);

    res.json({ token : token, user: {_id: user._id} });

  })(req, res, next);

};
