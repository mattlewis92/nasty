var application = require(__dirname + '/components/application');

var app = new application();
app.loadConfig(__dirname + '/config');
app.loadServices(__dirname + '/services');
app.loadModules(__dirname + '/modules');

app.startServer(function(err) {
  if (err) {
    console.error(err.message);
    console.error(err.stack);
    return process.exit(-1);
  }
});
