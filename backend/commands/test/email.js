'use strict';

module.exports = function(program, services, suggestedName) {

  program
    .command(suggestedName)
    .description('Sends a test email')
    .action(function() {

      var logger = services.get('logger').get('console');

      services.get('mailer').sendMail({
        from: 'matt@iwaz.at',
        to: 'matt.lewis.private@gmail.com',
        subject: 'Hello there',
        template: {
          name: 'general',
          locals: {
            title: 'Welcome!',
            content: 'We\'re excited you\'re here! Learn more about Awesome Co by clicking the link below!\n\nNew line test',
            button: {
              text: 'Click me!',
              link: 'http://google.com/'
            }
          }
        }
      }).then(logger.info).catch(logger.error).finally(process.exit);

    });

};
