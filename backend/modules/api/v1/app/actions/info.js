'use strict';

/**
 * @api {get} /app/info Returns info about the app used for configuring the frontend
 * @apiName AppInfo
 * @apiGroup App
 *
 */
module.exports = function(req, res, next, config) {

  res.json({
    i18n: {
      languages: config.get('i18n:locales'),
      default: config.get('i18n:defaultLocale')
    }
  });

};
