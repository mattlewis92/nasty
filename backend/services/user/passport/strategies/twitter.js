'use strict';

var TwitterStrategy = require('passport-twitter').Strategy;

module.exports = function(passport, services) {

  passport.use(new TwitterStrategy({
      consumerKey: 'TODO',
      consumerSecret: 'TODO',
      callbackURL: 'http://www.example.com/auth/twitter/callback',
      passReqToCallback: true
    },
    function(req, token, tokenSecret, profile, done) {

      services
        .get('models')
        .user.findOneAsync({
          'social_network_accounts.type': 'Twitter', //TODO - set up the model schema
          'social_network_accounts.account_id': profile.id_str
        }).then(function(user) {

          if (user) {
            //TODO - update the user object with the obtained profile
            done(null, user);
          } else {
            //TODO - create a new user and set the twitter profile
          }
          //TODO - authenticate the user
          //TODO - update the users profile fields from the SNA

        }).catch(done);
    }
  ));

};
