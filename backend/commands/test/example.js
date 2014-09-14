'use strict';

var chalk = require('chalk');

module.exports = function(program, services, suggestedName) {

  program
    .command(suggestedName + ' <file>')
    .option('--example', 'Example option')
    .description('This is an example command')
    .action(function(file) {
      console.log(chalk.red('Hello world!'), file, services.get('notifications'));
      services.get('job').queue('demo:worker2', {hello: 'World'});
    });

};
