'use strict';

module.exports = function(req, res, next, passport) {

  if (req.query.redirect) {
    req.session.redirect = req.query.redirect;
  }

  if (req.query.fingerprint) {
    req.session.fingerprint = req.query.fingerprint;
  }

  var type = req.params.provider + '-' + (req.path.indexOf('/authenticate') > -1 ? 'authenticate' : 'authorize');

  passport.authorize(type, { callbackURL: req.baseUrl + req.path }, function(err, user) {

    var redirect = req.session.redirect ? req.session.redirect : '/';
    if (err || !user) {
      redirect += (redirect.indexOf('?') === -1 ? '?' : '&') + 'errorAddingSocialNetwork=' + req.params.provider;
    }

    res.redirect(redirect);

    delete req.session.redirect;
    delete req.session.fingerprint;

    if (err || !user) {
      req.session.destroy();
    }

  })(req, res, next);

};
