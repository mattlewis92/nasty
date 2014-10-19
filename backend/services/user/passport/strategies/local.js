'use strict';

var LocalStrategy = require('passport-local').Strategy;

module.exports = function(passport, services) {

  passport.use(new LocalStrategy(
    {usernameField: 'email', passwordField: 'password'},
    function(email, password, done) {

      services
        .get('models')
        .user
        .findOneAsync({ email: email }, {password: true, token_salt: true})
        .then(function(user) {
          if (!user) {
            done(null, false, { message: 'This user does not exist.' });
          }
          return [user, user.comparePassword(password)];
        })
        .spread(function(user, isPasswordCorrect) {
          if (!isPasswordCorrect) {
            done(null, false, { message: 'The password you provided was incorrect.' });
          } else {
            done(null, user, {});
          }
        })
        .catch(done);
    }
  ));

};
