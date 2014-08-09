'use strict';

angular
  .module('mean')
  .run(function(Authentication) {
    Authentication.setHeaders();
  })
  .run(function($rootScope, $state, ErrorHandler) {

    $rootScope.$on('$stateChangeError', function(event, toState, toParams, fromState, fromParams, error) {
      console.log('STATE CHANGE ERRROR', error);
    });

    $rootScope.$on('$stateChangeSuccess', function() {
      ErrorHandler.errors = [];
    });

  });
