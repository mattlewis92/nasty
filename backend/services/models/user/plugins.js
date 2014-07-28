'use strict';

var mongooseTimestamp = require('mongoose-timestamp');

module.exports = function(mongoose, schema) {

  schema.plugin(mongooseTimestamp, {
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  });

};