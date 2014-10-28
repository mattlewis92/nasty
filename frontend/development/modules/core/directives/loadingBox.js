'use strict';

angular
  .module('nasty.core.directives')
  .directive('loadingBox', function(loading) {

    return {
      restrict: 'EA',
      transclude: true,
      templateUrl: 'modules/core/views/directives/loadingBox.html',
      link: function(scope) {
        scope.loading = loading;
      }
    };

  });
