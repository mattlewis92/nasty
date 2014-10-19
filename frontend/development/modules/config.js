'use strict';

angular
  .module('nasty')
  .config(function($locationProvider) {

    $locationProvider.html5Mode(true);

  })
  .config(function(DSProvider) {

    DSProvider.defaults.idAttribute = '_id';
    DSProvider.defaults.baseURL = '/api/v1/';

  })
  .config(function($translateProvider, DSProvider) {

    $translateProvider
      .useUrlLoader(DSProvider.defaults.baseURL + 'translations/fetch')
      .determinePreferredLanguage()
      .useSanitizeValueStrategy('escaped')
      .useMissingTranslationHandlerLog()
      .fallbackLanguage('en');

  })
  .config(function($provide) {

    $provide.decorator('$exceptionHandler', function($delegate) {
      return function(exception, cause) {
        $delegate(exception, cause);
        window.exceptions.handler.handle({ error: exception, data: { cause: cause } });
      };
    });

  })
  .config(function($httpProvider) {

    if (!$httpProvider.defaults.headers.get) {
      $httpProvider.defaults.headers.get = {};
    }
    //disable IE ajax request caching
    $httpProvider.defaults.headers.get['If-Modified-Since'] = '0';

    //Add custom error interceptor
    $httpProvider.interceptors.push('HTTPInterceptor');

  });
