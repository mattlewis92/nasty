'use strict';

angular
  .module('mean.app.directives')
  .directive('errorBox', function(ErrorHandler) {
    return {
      restrict: 'EA',
      templateUrl: 'views/app/directives/errorBox.html',
      link: function(scope) {
        scope.errorHandler = ErrorHandler;
      }
    };

  });
