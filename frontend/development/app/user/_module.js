'use strict';

angular.module('<%= _.slugify(angularAppName) %>.user.directives', []);

angular.module('<%= _.slugify(angularAppName) %>.user.states', [
  'classy'
]).classy.options.controller = {
  addFnsToScope: false
};

angular.module('<%= _.slugify(angularAppName) %>.user.services', []);

angular.module('<%= _.slugify(angularAppName) %>.user', [
  '<%= _.slugify(angularAppName) %>.user.states',
  '<%= _.slugify(angularAppName) %>.user.services',
  '<%= _.slugify(angularAppName) %>.user.directives'
]);
