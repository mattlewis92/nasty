'use strict';

module.exports = function(worker, services, debug) {

  worker
    .frequency('0 * * * * *')
    .action(function(job, done) {
      debug('HELLO WORLD! lol');
      done();
    });

};
