'use strict';

module.exports = function(app, actions) {

  app.get('/fetch', actions.fetch);

};
