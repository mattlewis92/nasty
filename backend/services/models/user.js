'use strict';

module.exports = function(mongoose) {

  var user = mongoose.model('user', { name: String });

  return user;

};