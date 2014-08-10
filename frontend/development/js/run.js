'use strict';

angular
  .module('mean')
  .run(function(Authentication) {

    Authentication.setHeaders();

  })
  .run(function($rootScope, $state, ErrorHandler) {

    $rootScope.$on('$stateChangeError', function(event, toState, toParams, fromState, fromParams, error) {

      ErrorHandler.generic(error); //This will handle all non HTTP errors from resolved promises

      if (fromState.name && fromState.name !== '') {
        $state.go(fromState.name);
      }

    });

    $rootScope.$on('$stateChangeSuccess', function() {

      ErrorHandler.errors = [];

    });

  })
  .run(function(Restangular, $state, ErrorHandler) {

    Restangular.setErrorInterceptor(function(response) {

      if (401 === response.status) {
        $state.go('user.login').then(function() {
          ErrorHandler.http(response);
        });
        return false;
      } else {
        response.__isHttp = true;
        ErrorHandler.http(response);
      }

      return true; // error not handled

    });

  });
