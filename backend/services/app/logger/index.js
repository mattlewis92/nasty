'use strict';

var winston = require('winston');

module.exports = function() {

  return function(config) {

    function getDefaultTransportOptions(filename) {

      var transportOptions = {
        console: {
          colorize: true,
          timestamp: true,
          prettyPrint: true
        }
      };

      if (filename) {
        transportOptions.file = {
          filename: config.get('logPath') + filename + '.' + config.get('NODE_ENV') + '.log',
          colorize: true,
          timestamp: true
        };
      }

      return transportOptions;

    }

    winston.loggers.add('app', getDefaultTransportOptions('app'));

    if ('development' === config.get('NODE_ENV')) {
      winston.loggers.add('error', getDefaultTransportOptions());
    } else {
      winston.loggers.add('error', getDefaultTransportOptions('errors'));
    }

    winston.loggers.add('request', getDefaultTransportOptions());

    winston.loggers.add('frontend', getDefaultTransportOptions('frontend.errors'));

    winston.loggers.add('console', getDefaultTransportOptions());

    return winston.loggers;

  };

};
