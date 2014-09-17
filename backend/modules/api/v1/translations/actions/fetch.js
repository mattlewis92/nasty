'use strict';

var fs = require('fs');

module.exports = function(req, res, next, config) {

  var lang = req.query.lang.split('_')[0],
      langPath = config.get('i18n:directory').replace('%rootPath%', config.get('rootPath')) + '/' + lang + '.json';

  fs.readFileAsync(langPath).then(function(data) {

    res.json(JSON.parse(data.toString()));

  }).catch(next);

};
