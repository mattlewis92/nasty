'use strict';

module.exports = function(app, actions) {

  app.get('/:eventId/agenda/test', actions.test);

};
