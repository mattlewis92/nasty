'use strict';

var TwitterStrategy = require('passport-twitter').Strategy;

module.exports = function(passport, services) {

  var strategyConfig = services.get('config').get('authenticationStrategies:twitter:auth');

  passport.use(new TwitterStrategy(strategyConfig, function(token, tokenSecret, profile, done) {

    profile.url = 'https://twitter.com/' + profile.username;

    done(null, profile, {token: token, token_secret: tokenSecret});

  }));

};
