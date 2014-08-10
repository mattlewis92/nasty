'use strict';

angular
  .module('mean')
  .run(function(Authentication) {

    Authentication.setHeaders();

  })
  .run(function($rootScope, $state, ErrorHandler, Authentication) {

    $rootScope.$on('$stateChangeError', function(event, toState, toParams, fromState, fromParams, error) {

      ErrorHandler.generic(error); //This will handle all non HTTP errors from resolved promises

      if (fromState.name && fromState.name !== '') {
        $state.go(fromState.name);
      }

    });

    $rootScope.$on('$stateChangeSuccess', function(event, toState) {

      if (Authentication.getToken() && toState.ifAuth) {
        $state.go(toState.ifAuth);
      }

    });

  })
  .run(function(bootstrap3ElementModifier) {
    //A hack to use font awesome instead of glyphicons for auto validation icons
    var makeValid = bootstrap3ElementModifier.makeValid,
        makeInvalid = bootstrap3ElementModifier.makeInvalid,
        insertAfter = function(referenceNode, newNode) {
          referenceNode[0].parentNode.insertBefore(newNode[0], referenceNode[0].nextSibling);
        };

    bootstrap3ElementModifier.makeValid = function(el) {
      makeValid(el);
      insertAfter(el, angular.element('<span class="fa fa-check form-control-feedback"></span>'));
    };

    bootstrap3ElementModifier.makeInvalid = function(el, msg) {
      makeInvalid(el, msg);
      insertAfter(el, angular.element('<span class="fa fa-times form-control-feedback"></span>'));
    };

  })
  .run(function(Restangular, $state, ErrorHandler) {

    Restangular.setErrorInterceptor(function(response) {

      if (401 === response.status) {
        $state.go('user.login').then(function() {
          ErrorHandler.http(response);
        });
        return false;
      } else {
        //If the error then gets passed to the generic handler it will know it is http and handle it as such
        response.__isHttp = true;
      }

      return true; // error not handled

    });

  });
