'use strict';

module.exports = function(program, services, suggestedName) {

  program
    .command(suggestedName)
    .description('Sends a test notification to all users')
    .action(function() {

      services.get('notifications').emitToAll('test', {lol: true});

    });

};
