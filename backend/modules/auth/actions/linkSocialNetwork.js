'use strict';

module.exports = function(req, res, next, passport) {

  if (req.query.redirect) {
    req.session.redirect = req.query.redirect;
  }

  passport.authorize(req.params.provider, { callbackURL: req.baseUrl + req.path }, function(err, user, info) {

    var redirect = req.session.redirect ? req.session.redirect : '/';
    if (err || !user) {
      redirect += (redirect.indexOf('?') === -1 ? '?' : '&') + 'errorAddingSocialNetwork=' + req.params.provider;
    } else {
      req.session.user = user;
    }

    console.log(err, user, info);

    res.redirect(redirect);

    delete req.session.redirect;

  })(req, res, next);

};
