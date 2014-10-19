'use strict';

angular
  .module('nasty.app.directives')
  .directive('loadingBox', function(Loading) {

    return {
      restrict: 'EA',
      transclude: true,
      templateUrl: 'modules/app/views/directives/loadingBox.html',
      link: function(scope) {
        scope.Loading = Loading;
      }
    };

  });
