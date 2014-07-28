'use strict';

module.exports = function(req, res, userAuthenticate) {

  res.json({user: userAuthenticate});

  //logger.error('HELLO WORLD');

  //return next(new errors.user('This is an example user error!'));

};