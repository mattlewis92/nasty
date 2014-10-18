'use strict';

var nodemailer = require('nodemailer'),
    htmlToText = require('nodemailer-html-to-text').htmlToText,
    bluebird = require('bluebird'),
    emailTemplates = bluebird.promisify(require('email-templates')),
    templateBuilder = emailTemplates(__dirname + '/emailTemplates').then(bluebird.promisify);

module.exports = function() {

  return function(config, job) {

    var transporter = nodemailer.createTransport(config.get('mailer'));
    transporter.use('compile', htmlToText());
    bluebird.promisifyAll(transporter);
    var sandbox = config.get('mailer:sandbox'),
        defaultSender = config.get('mailer:defaultSender');

    function renderTemplate(name, locals) {

      locals = locals || {};
      for (var key in locals) {
        if ('string' === typeof locals[key]) {
          locals[key] = locals[key].replace(/\n/g, '<br>');
        }
      }

      return templateBuilder.then(function(builder) {
        return builder(name, locals);
      });

    }

    function sendMail(options) {
      if (sandbox) {
        options.to = sandbox;
        delete options.cc;
        delete options.bcc;
      }

      if (!options.from) {
        options.from = defaultSender;
      }

      options.template.locals.subject = options.template.locals.subject || options.subject;

      if (options.template) {

        return renderTemplate(options.template.name, options.template.locals).spread(function(html, text) {

          options.html = html;
          if (text) {
            options.text = text;
          }
          return transporter.sendMailAsync(options);

        });

      } else {

        return transporter.sendMailAsync(options);

      }

    }

    function queueMail(options, sendAt) {
      if (sandbox) { //Send the mail now if in sandbox / dev mode
        return sendMail(options);
      }

      if (sendAt) {
        return job.schedule('app:email', options, sendAt);
      } else {
        return job.queue('app:email', options);
      }
    }

    return {
      sendMail: sendMail,
      queueMail: queueMail,
      renderTemplate: renderTemplate
    };

  };

};
