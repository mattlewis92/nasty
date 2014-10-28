'use strict';

var fs = require('fs');

module.exports = function(program, services, suggestedName) {

  program
    .command(suggestedName + ' <text>')
    .description('Adds a new translation key.')
    .action(function(text) {

      var defaultLocale = services.get('config').get('i18n:defaultLocale'),
          i18n = services.get('i18n')(defaultLocale),
          path = i18n.locateFile(defaultLocale),
          translationKey = text.toUpperCase().replace(/ /g, '_').replace(/[^a-zA-Z0-9_]/g, ''),
          file = JSON.parse(fs.readFileSync(path).toString()),
          logger = services.get('logger').get('console');

      file[translationKey] = text;
      fs.writeFileSync(path, JSON.stringify(file, null, '\t'), 'utf8');
      logger.info(translationKey);
      process.exit();
    });

};
