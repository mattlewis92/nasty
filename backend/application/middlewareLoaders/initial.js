'use strict';

var express = require('express'),
    expressWinston = require('express-winston'),
    expressValidator = require('express-validator');

module.exports = function(app, di, isRoot) {

  var config = di.get('config');

  app.set('env', config.get('NODE_ENV'));
  app.set('services', di);
  app.enable('trust proxy');
  app.disable('x-powered-by');

  app.use(require('express-domain-middleware'));
<% if (hasFrontend) { %>
  if (isRoot) {
    app.use(require('static-favicon')());

    if ('production' === config.get('NODE_ENV')) {
      app.use(require('compression')({
        filter: function(req, res) {
          return /json|text|javascript|css/.test(res.getHeader('Content-Type'));
        },
        level: 9
      }));
      app.use(express.static(config.get('rootPath') + config.get('frontendPath'), { maxAge: 86400000 * 365 }));
    } else {
      app.use(express.static(config.get('rootPath') + config.get('frontendPath')));
    }
  }
<% } %>
  app.use(require('body-parser').urlencoded({
    extended: true,
    limit: '10mb'
  }));
  app.use(require('body-parser').json({
    limit: '10mb'
  }));
  app.use(expressValidator());
  app.use(require('method-override')());
  app.use(require('connect-requestid'));
  app.use(require('helmet')());
  app.use(di.get('passport').initialize());

  if (true === config.get('app:logRequests')) {
    app.use(expressWinston.logger({
      winstonInstance: di.get('logger').get('request')
    }));
  }

  var i18n = di.get('i18n');
  app.use(function(req, res, next) {
    req.i18n = i18n(req.headers['accept-language'], req);
    next();
  });

};
