'use strict';

angular.module('nasty.core.ctrls', [
  'classy'
]).classy.options.controller = {
  addFnsToScope: false
};

angular.module('nasty.core.directives', []);

angular.module('nasty.core.routes', [
  'classy'
]).classy.options.controller = {
  addFnsToScope: false
};

angular.module('nasty.core.services', []);

angular.module('nasty.core', [
  'nasty.core.routes',
  'nasty.core.ctrls',
  'nasty.core.services',
  'nasty.core.directives'
]);
