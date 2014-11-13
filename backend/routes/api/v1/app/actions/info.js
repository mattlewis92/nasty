'use strict';

/**
 * @api {get} /app/info Returns info about the app used for configuring the frontend
 * @apiName AppInfo
 * @apiGroup App
 *
 */
module.exports = function(req, res, next, config) {

  var languages = config.get('i18n:locales'), langArray = [];
  for (var key in languages) {
    langArray.push({
      key: key,
      label: languages[key]
    });
  }

  res.json({
    i18n: {
      languages: langArray,
      default: config.get('i18n:defaultLocale')
    }
  });

};
