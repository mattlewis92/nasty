'use strict';

var jwt = require('jsonwebtoken');

module.exports = function(req, res, next, errors, passport, config) {

  req.checkBody('email', 'Required').notEmpty();
  req.checkBody('email', 'Valid email required').isEmail();
  req.checkBody('password', 'Required').notEmpty();
  req.checkBody('browser_fingerprint', 'Required').notEmpty();

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
      { user: {_id: user._id } },
      config.get('jwtKey'),
      {
        expiresInMinutes: config.get('app:tokenExpiryTimeInMinutes'),
        audience: req.body.browser_fingerprint
      }
    );
    res.json({ token : token });

  }, { session: false })(req, res, next);

};
