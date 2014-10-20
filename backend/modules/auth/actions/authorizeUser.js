'use strict';

module.exports = function(req, res, next, models) {

  models.user
    .findFromToken(req.headers['x-access-token'], req.headers['x-finger-print'])
    .then(function(user) {

      req.session.user = {_id: user._id};
      res.json({success: true});

    }).catch(next);

};
