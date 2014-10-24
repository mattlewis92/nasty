'use strict';

var imgur = require('imgur');

/**
 * @api {post} /app/report_error Logs an error from the frontend
 * @apiName ReportError
 * @apiGroup App
 *
 */
module.exports = function(req, res, logger) {

  var exception = JSON.parse(req.body.exception);
  delete exception.data.DOMDump;

  imgur.setClientId('de44c1f57f60e41');

  var base64Img = exception.data.screenshot.replace('data:image/png;base64,', '');
  imgur.uploadBase64(base64Img).then(function(result) {

    exception.data.screenshot = result.data.link;

  }).finally(function() {

    logger.get('frontend').error(exception);
    res.json({logged: true});

  });

};
