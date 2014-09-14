'use strict';

module.exports = function(worker, services, debug) {

  worker
    .concurrency(1)
    .frequency('0 * * * * *')
    .action(function() {
      debug('HELLO WORLD!');
    });

};
