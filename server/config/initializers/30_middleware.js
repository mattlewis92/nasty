var express = require('express')
  , poweredBy = require('connect-powered-by')
  , path = require('path');

module.exports = function() {
  // Use middleware.  Standard [Connect](http://www.senchalabs.org/connect/)
  // middleware is built-in, with additional [third-party](https://github.com/senchalabs/connect/wiki)
  // middleware available as separate modules.
  if ('development' == this.env) {
    this.use(express.logger());
  }

  var config = this._di.get('config');

  this.use(poweredBy('Locomotive'));
  this.use(express.favicon());
  this.use(express.static(config.get('rootPath') + config.get('frontendPath')));
  this.use(express.json());
  this.use(express.urlencoded());
  this.use(express.methodOverride());
  this.use(this.router);
  this.use(function (req, res, next) {
    res.sendfile(path.resolve(config.get('rootPath') + config.get('frontendPath') + '/index.html'));
  });
  this.use(express.errorHandler());
}