'use strict';

module.exports = function(worker, services, debug) {

  worker
    .action(function(job, done) {

      debug('Sending email');

      services.get('mailer').sendMail(job.data).then(function(result) {
        done(null, result);
      }).catch(done);

    });

};
