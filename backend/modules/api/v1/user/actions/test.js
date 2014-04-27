'use strict';

module.exports = function(errors, next, logger) {

  logger.error('HELLO WORLD');

  return next(new errors.user('This is an example user error!'));

};