'use strict';

angular
  .module('mean')
  .run(function(Config, Authentication) {

    Authentication.setHeaders();
    Authentication.socketAuthInit();

  })
  .run(function($rootScope, $state, ErrorHandler, Authentication, HistoryManager) {

    $rootScope.$on('$stateChangeError', function(event, toState, toParams, fromState, fromParams, error) {

      ErrorHandler.generic(error); //This will handle all non HTTP errors from resolved promises

      if (fromState.name && fromState.name !== '') {
        $state.go(fromState.name);
      }

    });

    $rootScope.$on('$stateChangeSuccess', function(event, toState, toParams, fromState, fromParams) {

      HistoryManager.previousUrl = $state.href(fromState, fromParams);

      if (Authentication.isAuthenticated() && toState.ifAuth) {
        $state.go(toState.ifAuth);
      }

    });

  })
  .run(function($rootScope, $state, ErrorHandler) {

    $rootScope.$on('user.unauthorized', function(event, error) {
      $state.go('user.login').then(function() {
        ErrorHandler.http(error);
      });
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

  });
