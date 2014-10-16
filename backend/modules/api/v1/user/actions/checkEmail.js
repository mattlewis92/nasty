'use strict';

module.exports = function(req, res, models, errors, next) {

  req.checkQuery('email', 'Required').notEmpty();
  req.checkQuery('email', 'Valid email required').isEmail();

  if (req.validationErrors()) {
    return next(new errors.validation(req.validationErrors(true)));
  }

  models.user.countAsync({email: req.query.email}).then(function(count) {

    if (count === 0) {
      res.json({exists: false});
    } else {
      res.status(412).json({exists: true});
    }

  }).catch(next);

};
