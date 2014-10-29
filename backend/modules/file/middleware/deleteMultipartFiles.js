'use strict';

var fs = require('fs');

module.exports = function() {

  return function(req, res, next) {

    for (var key in req.files) {
      fs.unlink(req.files[key].path);
    }

  };

};
