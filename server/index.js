var locomotive = require('locomotive')
  , bootable = require('bootable')
  , application = require(__dirname + '/lib/application')
  , nconf = require('nconf')
  , di = require('dependable').container();

// Create a new application and initialize it with *required* support for
// controllers and views.  Move (or remove) these lines at your own peril.
var app = new application();
var modulePath = __dirname + '/modules';
app.phase(locomotive.boot.controllers(modulePath));
app.controllers.resolve.use(function(id) {
  var path = modulePath + '/' + id;
  if (require('fs').existsSync(path)) return path;
});
app.initControllers(modulePath);

// Add phases to configure environments, run initializers, draw routes, and
// start an HTTP server.  Additional phases can be inserted as needed, which
// is particularly useful if your application handles upgrades from HTTP to
// other protocols such as WebSocket.

nconf
  .overrides({
    'NODE_ENV': 'development',
    'rootPath': __dirname + '/../'
  })
  .env()
  .file('all', __dirname + '/config/environments/all.json')
  .file('other', __dirname + '/config/environments/' + nconf.get('NODE_ENV') + '.json');

di.register('config', nconf);

app.phase(function() {
  this._di = di;
});
app.phase(bootable.initializers(__dirname + '/config/initializers'));
app.phase(locomotive.boot.routes(__dirname + '/modules/api/v1/routes'));
app.phase(locomotive.boot.httpServer(nconf.get('server:port'), nconf.get('server:host')));

// Boot the application.  The phases registered above will be executed
// sequentially, resulting in a fully initialized server that is listening
// for requests.
app.boot(function(err) {
  if (err) {
    console.error(err.message);
    console.error(err.stack);
    return process.exit(-1);
  }
});
