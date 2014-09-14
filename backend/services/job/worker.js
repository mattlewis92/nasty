'use strict';

module.exports = function() {

  var self = this;

  this.options = {};
  this.job = null;

  this.options = function(opts) {
    self.options = opts;
    return self;
  };

  this.concurrency = function(value) {
    self.options.concurrency = value;
    return self;
  };

  this.frequency = function(value) {
    self.options.frequency = value;
    return self;
  };

  this.action = function(value) {
    self.job = value;
    return self;
  };

};
