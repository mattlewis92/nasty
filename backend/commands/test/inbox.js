'use strict';

module.exports = function(program, services, suggestedName) {

  program
    .command(suggestedName)
    .description('Tests the email inbox')
    .action(function() {

      var client;

      services.get('inbox')('gmail').then(function(_client) {

        console.log('CONNECTED');
        client = _client;

        return client.processNewMessages('Inbox', function(message) {
          console.log(message.text);
        }, 'Test');

      }).then(function(result) {

        console.log(result);

        client.close();
        process.exit();

      }).catch(function(err) {

        console.log('ERROR', err.message);

      });

    });

};
