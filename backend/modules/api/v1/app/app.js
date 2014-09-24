'use strict';

module.exports = function(app, actions) {

  app.get('/info', actions.info);
  app.post('/report_error', actions.reportError);

};
