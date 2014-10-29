'use strict';

module.exports = function(schema) {

  schema.methods.isOfType = function(type) {

    return this.mime && this.mime.split('/')[0] === type;

  };

};
