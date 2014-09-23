'use strict';

process.env.TZ = 'Etc/UTC';

var express = require('express'),
    requireAll = require('require-all');

require('express-di');

var application = function() {

  var app = express();

  require('./di')(app);

  var appMethods = requireAll(__dirname + '/appMethods');
  for (var key in appMethods) {
    appMethods[key](app);
  }

  return app;

};

module.exports = application;
