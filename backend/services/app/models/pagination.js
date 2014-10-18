'use strict';

var mongoose = require('mongoose'),
    bluebird = require('bluebird');

mongoose.Query.prototype.paginate = function paginate(page, limit, cont) {
  page = page || 1;
  limit = limit || 10;

  var query = this,
      model = this.model,
      skipFrom = (page * limit) - limit;

  query = query.skip(skipFrom).limit(limit);

  if (!cont) {

    var promises = [
      query.execAsync(),
      model.countAsync(query._conditions)
    ];

    return bluebird.all(promises);

  } else {
    return this;
  }
};
