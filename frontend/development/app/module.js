'use strict';

angular.module('<%= _.slugify(angularAppName) %>.views', []);
angular.module('<%= _.slugify(angularAppName) %>.constants', []);

angular.module('<%= _.slugify(angularAppName) %>', [
  'ngAnimate',
  'ngTouch',
  'ngSanitize',
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
  'ui.select',
  'cgPrompt',
  'angular-growl',
  'mwl.bluebird',
  '<%= _.slugify(angularAppName) %>.views',
  '<%= _.slugify(angularAppName) %>.constants',
  '<%= _.slugify(angularAppName) %>.core',
  '<%= _.slugify(angularAppName) %>.user'
]);
