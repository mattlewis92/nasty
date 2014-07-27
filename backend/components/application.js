'use strict';

var express = require('express')
  , nconf = require('nconf')
  , dependable = require('dependable')
  , http = require('http')
  , requireAll = require('require-all')
  , path = require('path')
  , winston = require('winston')
  , expressWinston = require('express-winston')
  , fs = require('fs');

require('express-di');

var application = function() {

  var app = express();

  var di = dependable.container();

  var originalRegisterFunction = di.register;
  di.register = function(key, value) {

    app.factory(key, function(req, res, next) {
      next(null, di.get(key));
    });

    originalRegisterFunction(key, value);

  };

  app.set('services', di);

  app.loadConfig = function(configPath) {

    nconf
      .overrides({
        'NODE_ENV': process.env.NODE_ENV || 'development',
        'rootPath': configPath + '/../../',
        'logPath': configPath + '/../../logs/'
      })
      .env()
      .file('all', configPath + '/all.json')
      .file('other', configPath + '/' + nconf.get('NODE_ENV') + '.json');

    this.get('services').register('config', nconf);

    //Longer stack traces for non production environments
    if ('production' !== nconf.get('NODE_ENV')) {
      require('longjohn');
    }

    initMiddleware(this);

  };

  app.loadServices = function(servicesPath) {

    var services = requireAll(servicesPath);

    for (var name in services) {

      if ('object' === typeof services[name] && services[name].index) {
        services[name] = services[name].index;
      }

      this.get('services').register(name, new services[name](this));
    }

  };

  app.loadModules = function(modulePath) {

    var loadedModules = requireAll(modulePath);

    var finder = require('findit')(modulePath);
    var self = this;

    function getParentModuleMiddleware(path) {
      var parts = path.split('/');
      parts.pop(); //remove child module
      parts.splice(0, 1); //remove first empty string

      var tmp = loadedModules;
      parts.forEach(function(part) {
        tmp = tmp[part];
      });

      var result = {};
      for (var key in tmp) {
        result[key] = tmp[key].middleware || {};
      }
      return result;
    }

    finder.on('file', function (file) {
      var filename = file.split('/').pop();
      var directory = file.replace('/' + filename, '');

      if ('app.js' === filename) {

        var subApp = express();
        initMiddleware(subApp);

        var mountPrefix = directory.replace(modulePath, '');
        var parentModuleMiddleware = getParentModuleMiddleware(mountPrefix);
        var actions = requireAll(directory + '/actions');

        if (fs.existsSync(directory + '/middleware')) {

          var middleware = requireAll(directory + '/middleware');

          for (var name in middleware) {
            //Make this middleware available locally to it can be automatically injected
            subApp.factory(name, middleware[name]);
          }

        }

        var subAppLoaded = require(file)(subApp, actions, parentModuleMiddleware);

        addFinalMiddleware(subApp);

        self.use(mountPrefix, subAppLoaded);

      }

    });

    //Now let's add some default routes (as it's own sub app otherwise they'll override every other route)
    finder.on('end', function () {

      var config = self.get('services').get('config');
      var indexFile = path.resolve(config.get('rootPath') + config.get('frontendPath') + '/index.html');

      var subApp = express();
      initMiddleware(subApp);

      subApp.get('*', function(req, res) {
        res.sendfile(indexFile);
      });

      subApp.all('*', function(req, res) {
        res.json(404, {error: 'This API method does not exist.'});
      });

      addFinalMiddleware(subApp);

      self.use('/', subApp);

      addFinalMiddleware(self);

    });

  };

  app.startServer = function(done) {

    var config = this.get('services').get('config');

    http.createServer(this).listen(config.get('server:port'), config.get('server:address'), function() {
      var addr = this.address();
      console.info('HTTP server listening on %s:%d', addr.address, addr.port);
      return done();
    });

  };

  var initMiddleware = function(app) {

    var config = di.get('config');

    app.set('env', config.get('NODE_ENV'));
    app.enable('trust proxy');
    app.disable('x-powered-by');

    app.use(require('static-favicon')());

    if ('production' === config.get('NODE_ENV')) {
      app.use(require('compression')({
        filter: function (req, res) { return /json|text|javascript|css/.test(res.getHeader('Content-Type')); },
        level: 9
      }));
      app.use(express.static(config.get('rootPath') + config.get('frontendPath'), { maxAge: 86400000 * 365 }));
    } else {
      app.use(express.static(config.get('rootPath') + config.get('frontendPath')));
    }

    app.use(require('body-parser').urlencoded({
      extended: true
    }));
    app.use(require('body-parser').json());
    app.use(require('method-override')());
    app.use(require('connect-requestid'));
    app.use(require('helmet')());

    if (true === config.get('app:logRequests')) {
      app.use(expressWinston.logger({
        transports: [
          new winston.transports.Console({
            colorize: true
          })
        ]
      }));
    }


  };

  var addFinalMiddleware = function(app) {

    var config = di.get('config');
    if ('development' === config.get('NODE_ENV')) {

      app.use(require('errorhandler')());

    } else {

      app.use(function(err, req, res, next) {

        if (err instanceof di.get('errors').user) {
          res.json(err.statusCode, {error: err.message});
        } else {
          next(err);
        }

      });

      app.use(expressWinston.errorLogger({
        transports: [
          new winston.transports.Console({
            colorize: true
          }),
          new (winston.transports.File)({ filename: config.get('logPath') + 'errors.' + config.get('NODE_ENV') + '.log' })
        ]
      }));

      app.use(function(err, req, res, next) {

        res.json(500, {error: 'An error occurred! Please try again or contact us if you believe this should have worked.'});

        next(err);

      });

    }

  };

  return app;

};

module.exports = application;