'use strict';

angular
  .module('mean.app.services')
  .factory('Loading', function($rootScope) {

    var service = {
      isLoading: false
    };

    $rootScope.$on('$stateChangeStart', function(event, toState) {
      if (toState.resolve) {
        service.isLoading = true;
      }
    });

    $rootScope.$on('$stateChangeSuccess', function() {
      service.isLoading = false;
    });

    $rootScope.$on('$stateChangeError', function() {
      service.isLoading = false;
    });

    return service;

  });
