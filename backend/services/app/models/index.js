'use strict';
/*jshint loopfunc: true */

var mongoose = require('mongoose'),
    requireAll = require('require-all'),
    _ = require('lodash'),
    mongooseTypes = require('openifyit-mongoose-types');

mongooseTypes.loadTypes(mongoose);
require('mongoose-long')(mongoose);

_.mixin({
  pickDeep: function(obj) {
    var copy = {},
      keys = Array.prototype.concat.apply(Array.prototype, Array.prototype.slice.call(arguments, 1));

    this.each(keys, function(key) {
      var subKeys = key.split('.');
      key = subKeys.shift();

      if (key in obj) {
        // pick nested properties
        if (subKeys.length>0) {
          // extend property (if defined before)
          if (copy[key]) {
            _.extend(copy[key], _.pickDeep(obj[key], subKeys.join('.')));
          } else {
            copy[key] = _.pickDeep(obj[key], subKeys.join('.'));
          }
        } else {
          copy[key] = obj[key];
        }
      }
    });

    return copy;
  }
});

module.exports = function(app) {

  return function(config) {

    var mongo = config.get('mongo'),
        uri = 'mongodb://' + mongo.host + ':' + mongo.port + '/' + mongo.database;

    mongoose.connect(uri, {server: {socketOptions: {keepAlive: 1}}});

    var models = requireAll(__dirname);
    delete models.index; //remove this file
    delete models.pagination; //remove the pagination patch

    for (var model in models) {
      var elems = models[model],
          schema = new mongoose.Schema(elems.schema(mongoose));
      if (!schema.options.toObject) {
        schema.options.toObject = {};
      }

      ['plugins', 'pre', 'post', 'methods', 'options', 'statics', 'virtuals'].forEach(function(key) {
        if (elems[key]) {
          elems[key](schema, app.get('services'));
        }
      });

      var originalTransform;
      if (schema.options.toObject.transform) {
        originalTransform = schema.options.toObject.transform;
      }

      schema.options.toObject.transform = function(doc, ret, options) {
        delete ret.id; //Remove the virtual id
        //This is called when saving the object to the database, so dont apply the transformation then
        if (options._useSchemaOptions) {
          delete ret.__v; // remove the __v of every document before returning the result
          if (originalTransform) {
            originalTransform(doc, ret, options);
          }
        }
      };

      schema.options.toObject.getters = true;
      schema.options.toObject.virtuals = true;

      schema.methods.extend = function(obj, schema) {
        var result = _.extend(this, _.pickDeep(obj, schema)), self = this;
        schema.forEach(function(field) {
          self.markModified(field);
        });
        return result;
      };

      schema.pre('save', function(next) {
        this.wasNew = this.isNew;
        next();
      });

      models[model] = mongoose.model(model, schema, model);
    }

    return models;

  };

};
