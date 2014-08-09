'use strict';

module.exports = function(app, actions) {

  app.get('/test', actions.test);
  app.post('/register', actions.register);
  app.post('/authenticate', actions.authenticate);

  return app;

};
