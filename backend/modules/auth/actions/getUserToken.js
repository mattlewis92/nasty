'use strict';

module.exports = function(req, res, next, errors) {

  if (req.session.token) {
    res.json({token: req.session.token});
  } else {
    next(new errors.user('Something went wrong and we couldn\'t log you in. Please try again.'));
  }

  req.session.destroy();

};
