var nodemailer = require('nodemailer'),
    bluebird = require('bluebird');

module.exports = function() {

  return function(config, job) {

    var transporter = nodemailer.createTransport(config.get('mailer'));
    bluebird.promisifyAll(transporter);
    var sandbox = config.get('mailer').sandbox;

    function sendMail(options) {
      if (sandbox) {
        options.to = sandbox;
        delete options.cc;
        delete options.bcc;
      }
      return transporter.sendMailAsync(options);
    }

    function queueMail(options, sendAt) {
      if (sendAt) {
        job.schedule('app:email', options, sendAt);
      } else {
        job.queue('app:email', options);
      }
    }

    return {
      sendMail: sendMail,
      queueMail: queueMail
    }

  }

};
