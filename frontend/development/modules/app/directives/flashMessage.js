'use strict';

angular
  .module('nasty.app.directives')
  .directive('flashMessage', function(flash) {
    return {
      restrict: 'A',
      templateUrl: 'modules/app/views/directives/flashMessage.html',
      scope: true,
      link: function(scope, elm, attrs) {
        scope.messageId = attrs.flashMessage;
        scope.flash = flash;
      }
    };

  });
