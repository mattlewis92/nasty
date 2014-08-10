'use strict';

angular
  .module('mean.app.directives')
  .directive('loadingBox', function(Loading) {

    return {
      restrict: 'EA',
      transclude: true,
      templateUrl: 'views/app/directives/loadingBox.html',
      link: function(scope) {
        scope.Loading = Loading;
      }
    };

  });
