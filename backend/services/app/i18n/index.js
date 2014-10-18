'use strict';

var i18n2 = require('i18n-2');

module.exports = function() {

  return function(config) {

    return function(locale) {

      var i18nConfig = config.get('i18n');
      i18nConfig.locales = Object.keys(i18nConfig.locales);

      var i18n = new i18n2(i18nConfig);

      if (locale) {
        if (locale.indexOf('-') > -1) {
          locale = locale.split('-')[0];
        }
        i18n.setLocale(locale);
      }

      return i18n;
    };

  };

};
