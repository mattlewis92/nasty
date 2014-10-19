'use strict';

var expressWinston = require('express-winston');

module.exports = function(app, di) {

  app.use(function(err, req, res, next) {

    if (true === err.displayToUser) {
      var message = err.message;
      if (!err.dontTranslate) {
        message = req.i18n.__.apply(req.i18n, [message].concat(err.translationParams));
      }

      var response = {message: message};
      if (err.details) {
        response.details = err.details;
        for (var key in response.details) {
          if (response.details[key].msg) {
            response.details[key].msg = req.i18n.__(response.details[key].msg);
          }
        }
      }

      res.status(err.statusCode || 400).json(response);
    } else {
      next(err);
    }

  });

  var transports = [];
  for (var key in di.get('logger').get('error').transports) {
    transports.push(di.get('logger').get('error').transports[key]);
  }

  app.use(expressWinston.errorLogger({
    transports: transports
  }));

  /*jshint unused:false*/
  app.use(function(err, req, res, next) {

    res.status(500).json({message: 'An error occurred! Please try again or contact us if you believe this should have worked.'});

  });
  /*jshint unused:true*/

};
