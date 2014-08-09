'use strict';

angular.module('mean.app.directives', []);
angular.module('mean.app.services', []);
angular.module('mean.app.ctrls', [
  'mean.app.services'
]);
angular.module('mean.app', [
  'mean.app.ctrls',
  'mean.app.services',
  'mean.app.directives'
]);
