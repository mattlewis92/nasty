'use strict';

module.exports = function(worker, services, debug) {

  worker
    .action(function(job, done) {
      debug('HELLO WORLD!', job.data);
      done();
    });

};
