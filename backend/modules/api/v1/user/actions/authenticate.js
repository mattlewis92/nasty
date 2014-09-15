'use strict';

var jwt = require('jsonwebtoken');

module.exports = function(req, res, next, errors, passport, config) {

  req.checkBody('email', 'Required').notEmpty();
  req.checkBody('email', 'Valid email required').isEmail();
  req.checkBody('password', 'Required').notEmpty();
  req.checkHeader('x-finger-print', 'Required').notEmpty();

  if (req.validationErrors()) {
    return next(new errors.validation(req.validationErrors(true)));
  }

  passport.authenticate('local', function(err, user, info) {

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
        expiresInMinutes: config.get('app:tokenExpiryTimeInMinutes'),
        audience: req.headers['x-finger-print']
      }
    );

    res.json({ token : token, user: {_id: user._id} });

  }, { session: false })(req, res, next);

};
