'use strict';

module.exports = function(worker, services, debug) {

  worker
    .action(function(job) {
      debug('HELLO WORLD!', job.attrs.data);
    });

};