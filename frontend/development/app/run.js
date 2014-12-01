'use strict';

angular
  .module('<%= _.slugify(angularAppName) %>')
  .run(function(config, $translate, API) {

    API.get('app/info').success(function(result) {
      for (var key in result) {
        config[key] = result[key];
      }
      $translate.fallbackLanguage(config.i18n.default);
    });

  }).run(function(authentication) {

    authentication.setHeaders().socketAuthInit();

  }).run(function($rootScope, $state, errorHandler, authentication) {

    $rootScope.$on('$stateChangeError', function(event, toState, toParams, fromState, fromParams, error) {

      errorHandler.generic(error); //This will handle all non HTTP errors from resolved promises

      if (fromState.name && fromState.name !== '') {
        $state.go(fromState.name);
      }

    });

    $rootScope.$on('$stateChangeStart', function(event, toState) {

      if (authentication.isAuthenticated() && toState.ifAuth) {
        event.preventDefault();
        $state.go(toState.ifAuth);
      }

    });

  }).run(function($location, socialNetwork) {

    if ($location.search().authCallback) {
      socialNetwork.authenticateCallback();
    }

  }).run(function(bootstrap3ElementModifier, validator) {
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

    //Disable valid element styling
    validator.setValidElementStyling(false);

  });
