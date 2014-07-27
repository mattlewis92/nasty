'use strict';

var winston = require('winston');
var bluebird = require('bluebird');
bluebird.promisifyAll(winston);

module.exports = function() {

  return function(config) {

    var logPath = config.get('logPath');

    var logger = new (winston.Logger)({
      transports: [
        new (winston.transports.Console)({
          colorize: true
        }),
        new (winston.transports.File)({ filename: logPath + 'app.' + config.get('NODE_ENV') + '.log' })
      ]
    });

    return logger;

  };

};