'use strict';

angular.module('<%= _.slugify(angularAppName) %>.core.directives', ['classy']);

angular.module('<%= _.slugify(angularAppName) %>.core.states', [
  'classy'
]).classy.options.controller = {
  addFnsToScope: false
};

angular.module('<%= _.slugify(angularAppName) %>.core.services', []);

angular.module('<%= _.slugify(angularAppName) %>.core', [
  '<%= _.slugify(angularAppName) %>.core.states',
  '<%= _.slugify(angularAppName) %>.core.services',
  '<%= _.slugify(angularAppName) %>.core.directives'
]);
