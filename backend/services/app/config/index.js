'use strict';

var nconf = require('nconf'),
    bluebird = require('bluebird');

module.exports = function(app) {

  return function(rootPath) {

    nconf
      .overrides({
        NODE_ENV: process.env.NODE_ENV || 'development',
        rootPath: rootPath,
        logPath: rootPath + '/logs/'
      })
      .env()
      .file('all', __dirname + '/all.json')
      .file('other', __dirname + '/' + nconf.get('NODE_ENV') + '.json');

    //Longer stack traces for non production environments
    if ('production' !== nconf.get('NODE_ENV')) {
      require('longjohn');
      bluebird.longStackTraces();
    }

    var packageJson = require(nconf.get('rootPath') + 'package.json');
    if (packageJson.promisify) {
      packageJson.promisify.forEach(function(libraryName) {
        var library = require(libraryName);
        bluebird.promisifyAll(library);
      });
    }

    bluebird.onPossiblyUnhandledRejection(function(error) {
      app.get('services').get('logger').get('error').error(error);
    });

    return nconf;

  };

};
