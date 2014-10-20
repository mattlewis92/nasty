'use strict';

var LocalStrategy = require('passport-local').Strategy;

module.exports = function(passport, services) {

  var userError = services.get('errors').user;

  passport.use(new LocalStrategy(
    {usernameField: 'email', passwordField: 'password'},
    function(email, password, done) {

      services
        .get('models')
        .user
        .findOneAsync({ email: email }, {password: true, token_salt: true})
        .then(function(user) {
          if (!user) {
            done(new userError('A user could not be found with the email address you provided.', 401));
          }
          return [user, user.comparePassword(password)];
        })
        .spread(function(user, isPasswordCorrect) {

          if (user) {
            if (!isPasswordCorrect) {
              done(new userError('The password you provided was incorrect.', 401));
            } else {
              done(null, user);
            }
          }

        })
        .catch(done);
    }
  ));

};
