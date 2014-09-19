'use strict';

module.exports = function(req, res, next, config) {

  res.json({
    i18n: {
      languages: config.get('i18n:locales'),
      default: config.get('i18n:defaultLocale')
    }
  });

};
