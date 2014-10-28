'use strict';

angular.module('nasty.core.directives', []);
angular.module('nasty.core.services', []);
angular.module('nasty.core.ctrls', [
  'nasty.core.services',
  'classy'
]).classy.options.controller = {
  addFnsToScope: false
};
angular.module('nasty.core', [
  'nasty.core.ctrls',
  'nasty.core.services',
  'nasty.core.directives'
]);
