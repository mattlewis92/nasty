'use strict';

angular
  .module('nasty.app.directives')
  .directive('loadingBox', function(loading) {

    return {
      restrict: 'EA',
      transclude: true,
      templateUrl: 'modules/app/views/directives/loadingBox.html',
      link: function(scope) {
        scope.loading = loading;
      }
    };

  });
