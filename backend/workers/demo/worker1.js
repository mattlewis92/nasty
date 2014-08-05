'use strict';

module.exports = function(worker, services, debug) {

  worker
    .concurrency(1)
    .frequency('1 minute')
    .action(function() {
      debug('HELLO WORLD!');
    });

};