'use strict';

angular
  .module('nasty')
  .run(function(config, authentication) {

    authentication.setHeaders().socketAuthInit();

  })
  .run(function($rootScope, $state, errorHandler, authentication) {

    $rootScope.$on('$stateChangeError', function(event, toState, toParams, fromState, fromParams, error) {

      errorHandler.generic(error); //This will handle all non HTTP errors from resolved promises

      if (fromState.name && fromState.name !== '') {
        $state.go(fromState.name);
      }

    });

    $rootScope.$on('$stateChangeSuccess', function(event, toState, toParams, fromState, fromParams) {

      if (authentication.isAuthenticated() && toState.ifAuth) {
        $state.go(toState.ifAuth);
      }

    });

  })
  .run(function($location, socialNetwork) {

    if ($location.search().authCallback) {
      socialNetwork.authenticateCallback();
    }

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

  });
