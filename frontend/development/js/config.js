'use strict';

angular
  .module('mean')
  .config(function($locationProvider) {

    $locationProvider.html5Mode(true);

  })
  .config(function(DSProvider) {

    DSProvider.defaults.idAttribute = '_id';

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
