'use strict';

angular.module('nasty.app.directives', []);
angular.module('nasty.app.services', []);
angular.module('nasty.app.ctrls', [
  'nasty.app.services',
  'classy'
]).classy.options.controller = {
  addFnsToScope: false
};
angular.module('nasty.app', [
  'nasty.app.ctrls',
  'nasty.app.services',
  'nasty.app.directives'
]);
