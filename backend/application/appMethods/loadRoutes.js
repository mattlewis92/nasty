'use strict';

var express = require('express'),
  requireAll = require('require-all'),
  path = require('path'),
  fs = require('fs'),
  initMiddleware = require('./../middlewareLoaders/initial'),
  addFinalMiddleware = require('./../middlewareLoaders/final');

/**
 * Initialises a given set of middlewares contructors passing in the di object to each
 * @param middleware
 * @param di
 * @returns {*}
 */
function loadMiddleware(middleware, di) {
  for (var key in middleware) {
    if (middleware[key].length !== 3) { //Make sure the middleware is only loaded once by checking the arguments length
      middleware[key] = middleware[key](di);
    }
  }
  return middleware;
}

/**
 * Gets a modules parent module middleware
 * @param path
 * @param loadedModules
 * @param di
 * @returns {{}}
 */
function getParentModuleMiddleware(path, loadedModules, di) {
  var parts = path.split('/');
  parts.pop(); //remove child module
  parts.splice(0, 1); //remove first empty string

  var tmp = loadedModules;
  parts.forEach(function(part) {
    tmp = tmp[part];
  });

  var result = {};
  for (var key in tmp) {
    result[key] = loadMiddleware(tmp[key].middleware || {}, di);
  }

  return result;
}

/**
 * Capialised the first letter of a string
 * @param string
 * @returns {string}
 */
function capitaliseFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

/**
 * Loads a modules sub modules
 * @param submoduleDirectory
 * @param parentModuleMiddleware
 * @param mountPrefix
 * @param parentModuleApp
 */
function loadSubmodule(submoduleDirectory, parentModuleMiddleware, mountPrefix, parentModuleApp) {

  var submodules = requireAll(submoduleDirectory),
    subModuleMiddleware = parentModuleMiddleware,
    parentModuleName = mountPrefix.split('/').pop(),
    fullMiddlewareName;

  for (var key in submodules) {
    if (submodules[key].middleware) {
      subModuleMiddleware[parentModuleName][key] = loadMiddleware(submodules[key].middleware, parentModuleApp.get('services'));

      for (var middlewareName in subModuleMiddleware[parentModuleName][key]) {
        fullMiddlewareName = key + capitaliseFirstLetter(middlewareName);
        parentModuleApp.factory(fullMiddlewareName, subModuleMiddleware[parentModuleName][key][middlewareName]);
      }
    }
  }

  for (key in submodules) {
    submodules[key].app(parentModuleApp, submodules[key].actions, subModuleMiddleware);
  }

}

/**
 * Does the heavy lifting of loading a modules files by adding middleware and routes
 * @param mainApp
 * @param mountPrefix
 * @param parentModuleMiddleware
 * @param appInitialiser
 * @param actions
 * @param submoduleDirectory
 */
function loadModule(mainApp, mountPrefix, parentModuleMiddleware, appInitialiser, actions, submoduleDirectory) {

  var subApp = express(),
      di = mainApp.get('services');

  initMiddleware(subApp, di);

  var middlewareName, fullMiddlewareName;

  for (var module in parentModuleMiddleware) {
    for (middlewareName in parentModuleMiddleware[module]) {
      fullMiddlewareName = module + capitaliseFirstLetter(middlewareName);
      subApp.factory(fullMiddlewareName, parentModuleMiddleware[module][middlewareName]);
    }
  }

  if (fs.existsSync(submoduleDirectory)) {

    loadSubmodule(submoduleDirectory, parentModuleMiddleware, mountPrefix, subApp);

  }

  appInitialiser(subApp, actions, parentModuleMiddleware);

  subApp.all('*', function(req, res) {
    res.status(404).json({message: 'This API method does not exist.'});
  });

  addFinalMiddleware(subApp, di);

  mainApp.use(mountPrefix, subApp);

}

/**
 * This adds a final catch all sub app for basically redirecting to angular
 * @param app
 */
function addCatchAllApp(app) {

  var di = app.get('services'),
      config = di.get('config'),
      indexFile = path.resolve(config.get('rootPath') + config.get('frontendPath') + '/index.html'),
      subApp = express();

  initMiddleware(subApp, di);

  //Now let's add some default routes (as it's own sub app otherwise they'll override every other route)
  subApp.get('*', function(req, res) {
    res.sendFile(indexFile);
  });

  subApp.all('*', function(req, res) {
    res.status(404).json({message: 'This API method does not exist.'});
  });

  addFinalMiddleware(subApp, di);

  app.use('/', subApp);

  addFinalMiddleware(app, di);

}

module.exports = function(app) {

  var di = app.get('services');

  app.loadRoutes = function(modulePath) {

    initMiddleware(this, di, true);

    var loadedModules = requireAll(modulePath),
      finder = require('findit')(modulePath),
      self = this;

    finder.on('file', function(file) {
      var filename = file.split('/').pop(),
          directory = file.replace('/' + filename, '');

      if ('app.js' === filename && directory.indexOf('submodules') === -1) {

        var mountPrefix = directory.replace(modulePath, '');

        loadModule(
          self,
          mountPrefix,
          getParentModuleMiddleware(mountPrefix, loadedModules, di),
          require(file),
          requireAll(directory + '/actions'),
          directory + '/submodules'
        );

      }

    });

    finder.on('end', function() {

      addCatchAllApp(self);

    });

  };

};
