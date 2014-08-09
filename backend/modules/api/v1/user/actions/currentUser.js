'use strict';

module.exports = function(res, next, userAuthenticate, models) {

  models
    .user
    .findByIdAsync(userAuthenticate._id)
    .then(function(user) {
      res.json(user.toObject());
    })
    .catch(next);

};
