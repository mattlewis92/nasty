'use strict';

var TwitterStrategy = require('passport-twitter').Strategy;

module.exports = function(passport, services) {

  passport.use('twitter-authenticate', new TwitterStrategy({
      consumerKey: 'nCzbAEgVjoqA90zWcTK9w',
      consumerSecret: '9Uyoh8rzh12yxgwINsL4UhFtshyX6WxAezEamygJ7A',
      passReqToCallback: true
    },
    function(req, token, tokenSecret, profile, done) {

      var UserModel = services.get('models').user;

      UserModel.find({
        'social_network_accounts.provider': 'twitter',
        'social_network_accounts.account_id': profile.id
      }).select('+token_salt').findOneAsync().then(function(user) {

        if (!user) { //The user hasn't created an account yet
          user = new UserModel({});
        }

        user.addSocialNetworkAccount(profile, {token: token, token_secret: tokenSecret});
        user.save(function(err, user) {
          req.session.token = user.createAccessToken(req.session.fingerprint);
          done(err, user);
        });

      }).catch(done);

    }
  ));

  passport.use('twitter-authorize', new TwitterStrategy({
      consumerKey: 'nCzbAEgVjoqA90zWcTK9w',
      consumerSecret: '9Uyoh8rzh12yxgwINsL4UhFtshyX6WxAezEamygJ7A',
      passReqToCallback: true
    },
    function(req, token, tokenSecret, profile, done) {

      var UserModel = services.get('models').user;

      if (req.session.user) {

        UserModel.findByIdAsync(req.session.user._id).then(function(user) {

          user.addSocialNetworkAccount(profile, {token: token, token_secret: tokenSecret});
          user.save(done);

        }).catch(done);

      } else {

        done(new Error('Could not find the authorized user in the session!'));

      }

    }
  ));

};
