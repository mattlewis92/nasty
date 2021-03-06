'use strict';

module.exports = function(req, res, next, passport, logger, models) {

  if (req.query.redirect) {
    req.session.redirect = req.query.redirect;
  }

  if (req.query.fingerprint) {
    req.session.fingerprint = req.query.fingerprint;
  }

  function authenticateUser(profile, authToken) {

    var UserModel = models.user;

    return UserModel.find({
      'social_network_accounts.provider': req.params.provider,
      'social_network_accounts.account_id': profile.id
    }).select('+token_salt').findOneAsync().then(function(user) {

      if (!user) { //The user hasn't created an account yet
        user = new UserModel({});
      }

      user.addSocialNetworkAccount(profile, authToken);

      return user.saveAsync();

    }).spread(function(user) {

      req.session.auth = { token : user.createAccessToken(req.session.fingerprint), user: {_id: user._id} };
      return user;

    });

  }

  function authorizeUser(profile, authToken) {

    return models.user.find({
      'social_network_accounts.provider': req.params.provider,
      'social_network_accounts.account_id': profile.id
    }).findOneAsync().then(function(user) {

      if (!user) { //If no user has this account linked, then add it to the session user
        return models.user.findByIdAsync(req.session.user._id).then(function(user) {
          user.addSocialNetworkAccount(profile, authToken);
          return user.saveAsync();
        });
      } else if (user._id.equals(req.session.user._id)) { //else if the session user already has this account linked
        user.addSocialNetworkAccount(profile, authToken);
        return user.saveAsync();
      } else { //otherwise this account is linked to another user
        throw new Error(
          'This account has already been linked to another user. ' +
          'Found user id: ' + user._id + ', session user id: ' + req.session.user._id
        );
      }

    });

  }

  passport.authorize(req.params.provider, { callbackURL: req.baseUrl + req.path }, function(err, profile, authToken) {

    var redirect = req.session.redirect ? req.session.redirect : '/';

    function handleError(err) {
      logger.get('error').error(err.message, profile);
      redirect += (redirect.indexOf('?') === -1 ? '?' : '&') + 'errorAddingSocialNetwork=' + req.params.provider;
      res.redirect(redirect);
      req.session.destroy();
    }

    if (err) {

      handleError(err);

    } else {

      var isAuthenticating = req.path.indexOf('/authenticate') > -1, promise;

      if (isAuthenticating) {
        promise = authenticateUser(profile, authToken);
      } else {
        if (!req.session.user) {
          return handleError(new Error('Could not find the authorized user in the session!'));
        }
        promise = authorizeUser(profile, authToken);
      }

      promise.then(function() {

        res.redirect(redirect);

        delete req.session.redirect;
        delete req.session.fingerprint;

      }).catch(handleError);

    }

  })(req, res, next);

};
