'use strict';

var chalk = require('chalk');

module.exports = function(program, services, suggestedName) {

  var logger = services.get('logger').get('console');

  program
    .command(suggestedName + ' <file>')
    .option('--example', 'Example option')
    .description('This is an example command')
    .action(function(file) {

      logger.info(chalk.red('Hello world!'), file);

    });

};
