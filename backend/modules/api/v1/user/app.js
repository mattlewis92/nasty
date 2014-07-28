'use strict';

module.exports = function(app, actions, middleware) {

  app.get('/test', middleware.user.authenticate, actions.test);
  app.post('/register', actions.register);
  app.post('/token', actions.token);

  return app;

};