'use strict';

angular.module('mean.app.directives', ['mean.views']);
angular.module('mean.app.services', []);
angular.module('mean.app.ctrls', [
  'mean.app.services',
  'classy'
]).classy.options.controller = {
  addFnsToScope: false
};
angular.module('mean.app', [
  'mean.views',
  'mean.app.ctrls',
  'mean.app.services',
  'mean.app.directives'
]);
