'use strict';

var application = require(__dirname + '/application'),
    app = new application();

app.loadServices(__dirname + '/services', __dirname + '/../');
app.loadRoutes(__dirname + '/routes');

app.startServer(function(err) {

  if (err) {
    var logger = app.get('services').get('logger').get('console');
    logger.error(err.message);
    logger.error(err.stack);
    return process.exit(-1);
  }

});
