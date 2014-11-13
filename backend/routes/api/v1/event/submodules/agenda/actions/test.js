'use strict';

module.exports = function(req, res) {

  res.json({hello: req.params.eventId});

};