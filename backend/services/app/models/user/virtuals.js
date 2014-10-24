'use strict';

module.exports = function(schema) {

  schema
    .virtual('name.full')
    .get(function() {
      return (this.name.first + ' ' + this.name.last).trim();
    })
    .set(function(name) {
      var split = name.split(' ');
      this.name.first = split.shift();
      this.name.last = split.join(' ');
    });

};
