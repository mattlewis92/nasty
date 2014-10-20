'use strict';

var TwitterStrategy = require('passport-twitter').Strategy;

module.exports = function(passport, services) {

  passport.use(new TwitterStrategy({
      consumerKey: 'nCzbAEgVjoqA90zWcTK9w',
      consumerSecret: '9Uyoh8rzh12yxgwINsL4UhFtshyX6WxAezEamygJ7A',
      passReqToCallback: true
    },
    function(req, token, tokenSecret, profile, done) {

      done(null, profile, {token: {value: token, secret: tokenSecret}});

      var userModel = services.get('models').user;

      //Lookup the user to see if they are authenticated
      //If they are then simply add the profile details to their account
      //If not then find or create the user using the logic below. Then also create an JWT and set it in the session

      /*services
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
          //TODO - generate a JWT and set it in the session
          //TODO - update the users profile fields from the SNA

        }).catch(done);*/
    }
  ));

};
