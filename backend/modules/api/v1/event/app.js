'use strict';

module.exports = function(app, actions, middleware) {

  app.get('/test', middleware.user.something, actions.test);

  return app;

};