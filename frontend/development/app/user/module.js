'use strict';

angular.module('nasty.user.directives', []);
angular.module('nasty.user.services', []);
angular.module('nasty.user.ctrls', [
  'nasty.user.services',
  'classy'
]).classy.options.controller = {
  addFnsToScope: false
};
angular.module('nasty.user', [
  'nasty.user.ctrls',
  'nasty.user.services',
  'nasty.user.directives'
]);
