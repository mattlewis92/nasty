'use strict';

module.exports = function(app, actions) {

  app.get('/current', actions.currentUser);
  app.get('/email_check', actions.checkEmail);
  app.get('/:userId', actions.currentUser);
  app.put('/password', actions.changePassword);
  app.post('/password/reset/request', actions.sendPasswordResetEmail);
  app.put('/password/reset/:userId/:token', actions.resetPassword);
  app.post('/register', actions.register);
  app.post('/authenticate', actions.authenticate);
  app.put('/:userId', actions.update);

};
