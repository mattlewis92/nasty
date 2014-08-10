'use strict';

module.exports = function(res, next, userAuthenticate, models) {

  models
    .user
    .findByIdAsync(userAuthenticate._id)
    .then(function(user) {
      /*setTimeout(function() {
        res.json(user.toObject());
      }, 3000);*/
      res.json(user.toObject());
    })
    .catch(next);

};
