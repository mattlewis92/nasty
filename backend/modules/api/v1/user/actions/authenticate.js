'use strict';

var jwt = require('jsonwebtoken');

/**
 * @api {post} /user/authenticate Authenticate a user and return a JSON web token used later for authentication.
 * @apiName AuthenticateUser
 * @apiGroup User
 *
 * @apiHeader {String} x-finger-print The users browser fingerprint. Can be any value.
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
module.exports = function(req, res, next, errors, passport, config) {

  req.checkBody('email', 'Required').notEmpty();
  req.checkBody('email', 'Valid email required').isEmail();
  req.checkBody('password', 'Required').notEmpty();
  req.checkHeader('x-finger-print', 'Required').notEmpty();

  if (req.validationErrors()) {
    return next(new errors.validation(req.validationErrors(true)));
  }

  passport.authenticate('local', { session: false }, function(err, user, info) {

    if (err) {
      return next(err);
    }

    if (!user) {
      return next(new errors.user(info.message || 'This user does not exist.', 401));
    }

    //User has authenticated correctly thus we create a JWT token
    /*jshint camelcase:false*/
    var token = jwt.sign(
      { user: {_id: user._id }, token_salt: user.token_salt },
      config.get('jwtKey'),
      {
        expiresInMinutes: config.get('app:tokenExpiryTimeInMinutes') / (1000 * 60),
        audience: req.headers['x-finger-print']
      }
    );

    res.json({ token : token, user: {_id: user._id} });

  })(req, res, next);

};
