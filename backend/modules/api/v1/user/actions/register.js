'use strict';

/**
 * @api {post} /user/register Registers a new user on the system
 * @apiName RegisterUser
 * @apiGroup User
 *
 * @apiParam {Email} email The users email
 * @apiParam {String} forename The users first name
 * @apiParam {String} surname The users last name
 * @apiParam {String} password The users password choice
 *
 * @apiSuccess {Object} user An object containing the newly created user.
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
module.exports = function(req, res, models, errors, next) {

  req.checkBody('email', 'Required').notEmpty();
  req.checkBody('email', 'Valid email required').isEmail();
  req.checkBody('forename', 'Required').notEmpty();
  req.checkBody('surname', 'Required').notEmpty();
  req.checkBody('password', 'Required').notEmpty();
  req.checkBody('password', '8 to 20 characters required').len(8, 20);

  if (req.validationErrors()) {
    return next(new errors.validation(req.validationErrors(true)));
  }

  var user = new models.user({
    name: {
      first: req.body.forename,
      last: req.body.surname
    },
    email: req.body.email,
    password: req.body.password
  });

  user.saveAsync().spread(function(savedUser) {

    res.json(savedUser.toObject());

  })
  .catch(function(err) {

    if (err.cause && 11000 === err.cause.code) {
      next(new errors.user('A user with this email address already exists.'));
    } else {
      next(err);
    }

  });

};
