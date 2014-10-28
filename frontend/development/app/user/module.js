'use strict';

angular.module('nasty.user.directives', []);

angular.module('nasty.user.routes', [
  'classy'
]).classy.options.controller = {
  addFnsToScope: false
};

angular.module('nasty.user.services', []);

angular.module('nasty.user', [
  'nasty.user.routes',
  'nasty.user.services',
  'nasty.user.directives'
]);
