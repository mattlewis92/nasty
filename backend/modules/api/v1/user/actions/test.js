'use strict';

module.exports = function(req, errors, next, logger) {

  req.assert('email', 'required').notEmpty();
  if (req.validationErrors()) {
    //return next(new errors.validation(req.validationErrors(true)));
  }

  logger.error('HELLO WORLD');

  return next(new errors.user('This is an example user error!'));

};