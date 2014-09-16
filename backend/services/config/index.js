'use strict';

var nconf = require('nconf'),
    bluebird = require('bluebird'),
    fs = require('fs');

module.exports = function() {

  return function(rootPath) {

    var configPath = rootPath + '/backend/config';

    nconf
      .overrides({
        NODE_ENV: process.env.NODE_ENV || 'development',
        rootPath: rootPath,
        logPath: configPath + '/../../logs/'
      })
      .env()
      .file('all', configPath + '/all.json')
      .file('other', configPath + '/' + nconf.get('NODE_ENV') + '.json');

    //Longer stack traces for non production environments
    if ('production' !== nconf.get('NODE_ENV')) {
      require('longjohn');
      bluebird.longStackTraces();
    }

    var packageJson = JSON.parse(fs.readFileSync(nconf.get('rootPath') + 'package.json'));
    if (packageJson.promisify) {
      packageJson.promisify.forEach(function(libraryName) {
        var library = require(libraryName);
        bluebird.promisifyAll(library);
      });
    }

    return nconf;

  };

};
