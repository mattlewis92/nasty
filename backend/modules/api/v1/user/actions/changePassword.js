'use strict';

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
