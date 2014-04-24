var express = require('express');

module.exports = function() {
  // Use middleware.  Standard [Connect](http://www.senchalabs.org/connect/)
  // middleware is built-in, with additional [third-party](https://github.com/senchalabs/connect/wiki)
  // middleware available as separate modules.
  if ('development' == this.env) {
    this.app.use(express.logger());
  }

  var config = this.services.get('config');

  this.app.use(express.favicon());
  this.app.use(express.static(config.get('rootPath') + config.get('frontendPath')));
  this.app.use(express.json());
  this.app.use(express.urlencoded());
  this.app.use(express.methodOverride());
  this.app.use(this.app.router);
  this.app.use(express.errorHandler());
}