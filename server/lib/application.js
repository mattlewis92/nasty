var locomotive = require('locomotive')
  , debug = require('debug')('locomotive')
  , fs = require('fs');

function DispatchError(message) {
  Error.call(this);
  Error.captureStackTrace(this, arguments.callee);
  this.name = 'DispatchError';
  this.message = message;
}
DispatchError.prototype.__proto__ = Error.prototype;

locomotive.Application.prototype.initControllers = function(modulePath) {

  var modules = fs.readdirSync(modulePath + '/api/v1').filter(function(module) {
    return module.indexOf('.js') == -1;
  });

  var self = this;
  modules.forEach(function(module) {
    self._controller('api/v1/' + module, function() {});
  });

}


locomotive.Application.prototype._controller = function(id, cb) {

  var mod = this.__controllers[id]
    , mpath;

  if (!mod) {
    // No controller module was found in the cache.  Attempt auto-load.
    debug('autoload controller ' + id);
    try {
      mpath = this.__controllerResolver.resolve(id);
    } catch (_) {
      return cb(new DispatchError("Unable to resolve controller '" + id + "'"));
    }

    var Controller = locomotive.Controller;
    Controller.prototype.json = function(output) {
      this.__res.json(output);
    }

    var controllerInstance = new Controller();

    controllerInstance.before('*', function(next) {

      this._processed = {};
      next();

    });

    var actionPaths = fs.readdirSync(mpath + '/actions');
    actionPaths.forEach(function(actionFile) {

      var actionPath = mpath + '/actions/' + actionFile;

      try {
        var action = require(actionPath);
      } catch (ex) {
        if (ex instanceof SyntaxError) {
          // Helpful error with file name and line number
          var check = require('syntax-error');

          var src = fs.readFileSync(actionPath)
            , err = check(src, actionPath);
          if (err) { return cb(err); }
        }
        return cb(ex);
      }

      var actionName = actionFile.replace('.js', '');

      if ('object' === typeof action) {

        controllerInstance[actionName] = action.action;

        var resolveMiddleware = function(middleware) {

          if ('function' === typeof middleware) {

            return middleware;

          } else if ('string' === typeof middleware) {

            var middlewarePath;

            if (middleware.indexOf('#') == -1) {
              middlewarePath = mpath + '/middleware/' + middleware;
            } else {
              var parts = middleware.split('#');
              middlewarePath = mpath + '/../' + parts[0] + '/middleware/' + parts[1];
            }

            return require(middlewarePath);

          } else {

            cb(new Error('Invalid middleware type: ' + middleware));

          }

        }

        if (action.before && action.before.length > 0) {
          action.before.forEach(function(middleware) {
            controllerInstance.before(actionName, resolveMiddleware(middleware));
          });
        }

        if (action.after && action.after.length > 0) {
          action.after.forEach(function(middleware) {
            controllerInstance.after(actionName, resolveMiddleware(middleware));
          });
        }

      } else if ('function' === typeof action) {

        controllerInstance[actionName] = action;

      } else {

        cb(new Error('Invalid action for: ' + actionPath + ' (can only be function or object)'));

      }

    });

    // cache the controller module
    this.__controllers[id] = controllerInstance;
    mod = controllerInstance;
  }

  this.__controllerInstantiator.instantiate(mod, id, function(err, inst) {
    if (err) { return cb(err); }
    return cb(null, inst);
  });
};

module.exports = locomotive.Application;