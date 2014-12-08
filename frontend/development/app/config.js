'use strict';

angular
  .module('<%= _.slugify(angularAppName) %>')
  .config(function($locationProvider) {

    $locationProvider.html5Mode(true);

  }).config(function($httpProvider) {

    //Combine processing of multiple http responses received at around the same time
    $httpProvider.useApplyAsync(true);

  }).config(function($compileProvider) {

    //Disable runtime debug information in the compiler
    $compileProvider.debugInfoEnabled(false);

  }).config(function(DSProvider) {

    DSProvider.defaults.idAttribute = '_id';
    DSProvider.defaults.baseURL = '/api/v1/';

  }).config(function($translateProvider, DSProvider) {

    $translateProvider
      .useUrlLoader(DSProvider.defaults.baseURL + 'translations/fetch')
      .determinePreferredLanguage()
      .useSanitizeValueStrategy('escaped')
      .useMissingTranslationHandlerLog()
      .fallbackLanguage('en');

  }).config(function(growlProvider) {

    growlProvider.globalReversedOrder(true);
    growlProvider.globalTimeToLive(60 * 1000);
    growlProvider.globalDisableCountDown(true);
    growlProvider.globalInlineMessages(true);

  }).config(function($provide) {

    $provide.decorator('$exceptionHandler', function($delegate, $window) {
      return function(exception, cause) {
        $delegate(exception, cause);
        $window.exceptions.handler.handle({
          error: exception,
          data: {
            cause: cause
          }
        });
      };
    });

  }).config(function(uiSelectConfig) {

    uiSelectConfig.theme = 'bootstrap';

  }).config(function($httpProvider) {

    if (!$httpProvider.defaults.headers.get) {
      $httpProvider.defaults.headers.get = {};
    }
    //disable IE ajax request caching
    $httpProvider.defaults.headers.get['If-Modified-Since'] = '0';

    //Add custom error interceptor
    $httpProvider.interceptors.push('httpInterceptor');

  });
