'use strict';

angular
  .module('nasty.core.directives')
  .directive('flashMessage', function(flash) {
    return {
      restrict: 'A',
      templateUrl: 'modules/core/views/directives/flashMessage.html',
      scope: true,
      link: function(scope, elm, attrs) {
        scope.messageId = attrs.flashMessage;
        scope.flash = flash;
      }
    };

  });
