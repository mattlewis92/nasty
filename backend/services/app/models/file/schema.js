'use strict';

module.exports = function(mongoose) {

  return {
    name: String,
    size: Number,
    mime: String,
    checksum: String,
    url: {
      type: mongoose.SchemaTypes.Url,
      required: true
    },
    owner: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: 'user'
    }
  };

};
