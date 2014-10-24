'use strict';

var fs = require('fs');

/**
 * @api {get} /translations/fetch Fetches all translations to be used in the frontend
 * @apiName FetchTranslations
 * @apiGroup Translations
 *
 * @apiParam {string} lang The language code to fetch the translation for
 *
 */
module.exports = function(req, res, next, i18n) {

  var lang = req.query.lang.split('_')[0],
      langPath = i18n(lang).locateFile(lang);

  fs.readFileAsync(langPath).then(function(data) {

    var translations = JSON.parse(data.toString());
    //Convert the node i18n translations to angular-translates format
    for (var key in translations) {
      var count = 0;
      while (translations[key].indexOf('%s') > -1) {
        translations[key] = translations[key].replace('%s', '{{ value' + count + ' }}');
        count++;
      }
    }

    res.json(translations);

  }).catch(next);

};
