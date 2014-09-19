'use strict';

module.exports = function(req, res, next, userAuthenticate, models, errors) {

  req.checkBody('email', 'Required').notEmpty();
  req.checkBody('email', 'Valid email required').isEmail();
  req.checkBody('name.first', 'Required').notEmpty();
  req.checkBody('name.last', 'Required').notEmpty();

  if (req.validationErrors()) {
    return next(new errors.validation(req.validationErrors(true)));
  }

  models
    .user
    .findByIdAsync(userAuthenticate._id)
    .then(function(user) {

      user.name.first = req.body.name.first;
      user.name.last = req.body.name.last;
      user.email = req.body.email;

      if (req.body.language) {
        user.language = req.body.language;
      }

      return user.saveAsync();

    })
    .spread(function(user) {
      res.json(user.toObject());
    })
    .catch(function(err) {

      if (err.cause && 11000 === err.cause.code) {
        next(new errors.user('A user with this email address already exists.'));
      } else {
        next(err);
      }

    });

};
