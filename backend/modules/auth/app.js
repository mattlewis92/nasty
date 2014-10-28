'use strict';

module.exports = function(app, actions) {

  var session = app.get('services').get('session');

  app.post('/user/authorize', session, actions.authorizeUser);
  app.get('/user/token', session, actions.getUserToken);
  app.get('/:provider/authenticate', session, actions.linkSocialNetwork); //This route is when we are logging in / registering
  app.get('/:provider/authorize', session, actions.linkSocialNetwork); //This route is when we are linking to an existing user

};
