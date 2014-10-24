'use strict';

module.exports = function(program, services, suggestedName) {

  program
    .command(suggestedName)
    .description('Tests the email inbox')
    .action(function() {

      var logger = services.get('logger').get('console'), client;

      services.get('inbox')('gmail').then(function(_client) {

        logger.log('CONNECTED');
        client = _client;

        return client.processNewMessages('Inbox', function(message) {
          logger.log(message.text);
        }, 'Test');

      }).then(function(result) {

        logger.log(result);

        client.close();
        process.exit();

      }).catch(function(err) {

        logger.error(err.message);

      });

    });

};
