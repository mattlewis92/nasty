'use strict';

var mongoose = require('mongoose');
var requireIndex = require('requireindex');

module.exports = function() {

  return function(config) {

    var mongo = config.get('mongo');

    var uri = 'mongodb://' + mongo.host + ':' + mongo.port + '/' + mongo.database;
    mongoose.connect(uri);

    var models = requireIndex(__dirname);
    delete models.index; //remove this file

    for (var model in models) {
      models[model] = models[model](mongoose);
    }

    return models;

  };

};