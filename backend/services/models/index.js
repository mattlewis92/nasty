'use strict';
/*jshint loopfunc: true */

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
      if (!schema.options.toObject) {
        schema.options.toObject = {};
      }

      ['plugins', 'pre', 'methods', 'options'].forEach(function(key) {
        if (elems[key]) {
          elems[key](mongoose, schema);
        }
      });

      // remove the __v of every document before returning the result
      var originalTransform;
      if (schema.options.toObject.transform) {
        originalTransform = schema.options.toObject.transform;
      }

      schema.options.toObject.transform = function (doc, ret, options) {
        delete ret.__v;
        if (originalTransform) {
          originalTransform(doc, ret, options);
        }
      };

      models[model] = mongoose.model(model, schema);
    }

    return models;

  };

};