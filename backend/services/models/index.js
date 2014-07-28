'use strict';

var mongoose = require('mongoose');
var requireAll = require('require-all');
var mongooseTypes = require('mongoose-types');
var bluebird = require('bluebird');
var bcrypt = require('bcrypt');
bluebird.promisifyAll(mongoose);
bluebird.promisifyAll(bcrypt);
mongooseTypes.loadTypes(mongoose);

module.exports = function() {

  return function(config) {

    var mongo = config.get('mongo');

    var uri = 'mongodb://' + mongo.host + ':' + mongo.port + '/' + mongo.database;
    mongoose.connect(uri);

    var models = requireAll(__dirname);
    delete models.index; //remove this file

    for (var model in models) {
      var elems = models[model];
      var schema = new mongoose.Schema(elems.schema(mongoose));

      if (elems.plugins) {
        elems.plugins(mongoose, schema);
      }

      if (elems.pre) {
        elems.pre(mongoose, schema);
      }

      if (elems.methods) {
        elems.methods(mongoose, schema);
      }

      models[model] = mongoose.model(model, schema);
    }

    return models;

  };

};