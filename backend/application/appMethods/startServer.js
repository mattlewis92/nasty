'use strict';

module.exports = function(app) {

  app.startServer = function(done) {

    var config = this.get('services').get('config');

    this.listen(config.get('server:port'), config.get('server:address'), function() {

      var addr = this.address();

      app.get('services').get('logger').get('app').info('HTTP server listening on %s:%d', addr.address, addr.port);

      app.get('services').get('notifications').init(this);

      return done();

    });

  };

};
