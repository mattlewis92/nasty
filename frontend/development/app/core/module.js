'use strict';

angular.module('nasty.core.directives', ['classy']);

angular.module('nasty.core.routes', [
  'classy'
]).classy.options.controller = {
  addFnsToScope: false
};

angular.module('nasty.core.services', []);

angular.module('nasty.core', [
  'nasty.core.routes',
  'nasty.core.services',
  'nasty.core.directives'
]);
