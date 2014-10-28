'use strict';

angular.module('nasty.views', []);
angular.module('nasty.constants', []);

angular.module('nasty', [
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
  'ui.checkbox',
  'angularFileUpload',
  'nasty.views',
  'nasty.constants',
  'nasty.app',
  'nasty.user'
]);
