'use strict';

angular.module('mean.user.directives', ['mean.views']);
angular.module('mean.user.services', []);
angular.module('mean.user.ctrls', [
  'mean.user.services',
  'classy'
]).classy.options.controller = {
  addFnsToScope: false
};
angular.module('mean.user', [
  'mean.views',
  'mean.user.ctrls',
  'mean.user.services',
  'mean.user.directives'
]);
