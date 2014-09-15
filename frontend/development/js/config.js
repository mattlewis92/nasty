'use strict';

angular
  .module('mean')
  .config(function($locationProvider) {

    $locationProvider.html5Mode(true);

  })
  .config(function(DSProvider) {

    DSProvider.defaults.baseUrl = '/api/v1';
    DSProvider.defaults.idAttribute = '_id';

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
