'use strict';

/**
 * @api {put} /user/:userId Update a user
 * @apiName UpdateUser
 * @apiGroup User
 *
 * @apiHeaderStructure AuthenticationHeader
 *
 * @apiParam {Email} email The users email
 * @apiParam {Object} name An object containing the fields first and last containing the users first and last names
 * @apiParam {String} language The users preferred language
 *
 * @apiSuccess {Object} user An object containing the updated user fields.
 * @apiSuccessExample Example response:
 * {
 *    "_id": "530490471d7b6a025ca54f70",
 *    "email": "hello@google.com",
 *    "name": {
 *      "first": "John",
 *      "last": "Smith"
 *    },
 *    "language": "en"
 * }
 *
 * @apiErrorStructure UserError
 * @apiErrorStructure ValidationError
 *
 */
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

      user = user.extend(req.body, ['name.first', 'name.last', 'email', 'language', 'avatar.file']);

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
