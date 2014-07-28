'use strict';

var mongoose = require('mongoose')
  , requireAll = require('require-all')
  , mongooseTypes = require('openifyit-mongoose-types');
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

      ['plugins', 'pre', 'methods'].forEach(function(key) {
        if (elems[key]) {
          elems[key](mongoose, schema);
        }
      });

      models[model] = mongoose.model(model, schema);
    }

    return models;

  };

};