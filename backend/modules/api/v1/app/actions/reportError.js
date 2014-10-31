'use strict';

/**
 * @api {post} /app/report_error Logs an error from the frontend
 * @apiName ReportError
 * @apiGroup App
 *
 */
module.exports = function(req, res, logger, fileHandler) {

  var exception = JSON.parse(req.body.exception);
  delete exception.data.DOMDump;

  var base64Img = exception.data.screenshot.replace('data:image/png;base64,', '');
  fileHandler.saveFileFromBase64(base64Img, null, false).spread(function(file) {

    exception.data.screenshot = file.url;

  }).catch(function() {}).finally(function() {

    logger.get('frontend').error(exception);
    res.json({logged: true});

  });

};
