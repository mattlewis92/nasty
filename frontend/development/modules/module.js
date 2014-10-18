'use strict';

angular.module('mean.views', []);
angular.module('mean.constants', []);

angular.module('mean', [
  'ngAnimate',
  'ngTouch',
  'classy',
  'angular-data.DSCacheFactory',
  'angular-data.DS',
  'jcs-autoValidate',
  'pascalprecht.translate',
  'ui.router',
  'ct.ui.router.extras',
  'ui.bootstrap',
  'ajoslin.promise-tracker',
  'ngStorage',
  'btford.socket-io',
  'mean.views',
  'mean.constants',
  'mean.app',
  'mean.user'
]);
