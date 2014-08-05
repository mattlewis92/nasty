'use strict';

module.exports = function(worker, services, debug) {

  worker
    .action(function(job, done) {
      debug('HELLO WORLD!', job.attrs.data);
      done('This is an error!');
    });

};