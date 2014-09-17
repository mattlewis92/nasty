'use strict';

module.exports = function(app, actions) {

  app.post('/report', actions.report);

};
