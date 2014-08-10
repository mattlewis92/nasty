'use strict';

angular
  .module('mean.app.directives')
  .directive('flashMessage', function(Flash) {
    return {
      restrict: 'A',
      templateUrl: 'views/app/directives/flashMessage.html',
      scope: true,
      link: function(scope, elm, attrs) {
        scope.messageId = attrs.flashMessage;
        scope.flash = Flash;
      }
    };

  });
