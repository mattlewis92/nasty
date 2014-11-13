'use strict';

angular
  .module('nasty.core.directives')
  .directive('flashMessage', function(flash) {
    return {
      restrict: 'A',
      templateUrl: 'app/core/directives/flashMessage/core.flashMessage.template.html',
      scope: true,
      link: function(scope, elm, attrs) {
        scope.messageId = attrs.flashMessage;
        scope.flash = flash;
      }
    };

  });
