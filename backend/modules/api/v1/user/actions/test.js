'use strict';

module.exports = function(req, res) {

  res.json({user: req.user});

  //logger.error('HELLO WORLD');

  //return next(new errors.user('This is an example user error!'));

};