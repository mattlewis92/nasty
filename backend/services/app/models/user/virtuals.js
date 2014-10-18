'use strict';

module.exports = function(schema) {

  schema
    .virtual('name.full')
    .get(function() {
      return this.name.first + ' ' + this.name.last;
    })
    .set(function(name) {
      var split = name.split(' ');
      this.name.first = split.splice(0, 1);
      this.name.last = split.join(' ');
    });

};
