'use strict';

var request = require('request');

module.exports = function(req, res, logger) {

  var exception = JSON.parse(req.body.exception);
  delete exception.data.DOMDump;

  request.post({
    url: 'https://api.imgur.com/3/image',
    headers: {
      Authorization: 'Client-ID ' + 'de44c1f57f60e41',
      Accept: 'application/json'
    },
    form: {
      image: exception.data.screenshot.replace('data:image/png;base64,', ''),
      type: 'base64'
    },
    json: true
  }, function(err, result, body) {

    if (!err) {
      exception.data.screenshot = body.data.link;
    }
    logger.get('frontend').error(exception);
    res.json({logged: true});

  });

};
