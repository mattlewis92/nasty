'use strict';

module.exports = function(app, actions) {

  app.get('/current', actions.currentUser);
  app.put('/update', actions.update);
  app.put('/password', actions.changePassword);
  app.post('/register', actions.register);
  app.post('/authenticate', actions.authenticate);

  return app;

};
