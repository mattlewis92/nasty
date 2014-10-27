'use strict';

var LinkedInStrategy = require('passport-linkedin').Strategy;

module.exports = function(passport, services) {

  var strategyConfig = services.get('config').get('authenticationStrategies:linkedin:auth');

  passport.use(new LinkedInStrategy(strategyConfig, function(token, tokenSecret, profile, done) {

    profile.url = profile._json.publicProfileUrl;
    profile.username = profile.displayName;

    done(null, profile, {token: token, token_secret: tokenSecret});

  }));

};
