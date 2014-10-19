'use strict';

var expressSession = require('express-session');

module.exports = function(app, actions) {

  var session = expressSession({secret: 'keyboard cat'});
  app.get('/user/token', session, actions.getUserToken);
  app.get('/:provider', session, actions.linkSocialNetwork);

};
