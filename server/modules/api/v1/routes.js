var fs = require('fs');

module.exports = function() {

  var self = this;

  var modules = fs.readdirSync(__dirname).filter(function(module) {
    return module.indexOf('.js') == -1;
  });

  modules.forEach(function(module) {

    var routes = require(__dirname + '/' + module + '/routes.js');

    self.namespace('api/v1', function() {
      routes.call(self);
    });

  });

}