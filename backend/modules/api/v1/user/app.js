'use strict';

module.exports = function(app, actions) {

  app.get('/current', actions.currentUser);
  app.get('/:userId', actions.currentUser);
  app.put('/password', actions.changePassword);
  app.post('/register', actions.register);
  app.post('/authenticate', actions.authenticate);
  app.put('/:userId', actions.update);

  return app;

};
