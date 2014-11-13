'use strict';

var multiparty = require('connect-multiparty');

module.exports = function(app, actions, middleware) {

  app.post('/upload', multiparty(), actions.upload, middleware.file.deleteMultipartFiles);

};
