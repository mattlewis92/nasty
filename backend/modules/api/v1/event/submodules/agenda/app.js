'use strict';

module.exports = function(app, actions, middleware) {

  app.get('/:eventId/agenda/test', actions.test);

  return app;

};