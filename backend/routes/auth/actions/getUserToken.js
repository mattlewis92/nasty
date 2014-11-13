'use strict';

module.exports = function(req, res, next, errors) {

  if (req.session.auth) {
    res.json({auth: req.session.auth});
  } else {
    next(new errors.user('Something went wrong and we couldn\'t log you in. Please try again.'));
  }

  req.session.destroy();

};
