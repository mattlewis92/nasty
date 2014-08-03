'use strict';

var application = require(__dirname + '/components/application'),
    app = new application();

app.loadServices(__dirname + '/services', __dirname + '/../');
app.loadModules(__dirname + '/modules');

app.startServer(function(err) {
  if (err) {
    console.error(err.message);
    console.error(err.stack);
    return process.exit(-1);
  }
});
